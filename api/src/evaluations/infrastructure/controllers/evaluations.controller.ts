import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Request,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { CreateEvaluationDto } from '../../application/dtos/create-evaluation.dto';
import { EvaluationResponseDto } from '../../application/dtos/evaluation-response.dto';
import { UpdateEvaluationDto } from '../../application/dtos/update-evaluation.dto';

type EvaluationRow = Prisma.evaluationsGetPayload<{
  include: { evaluation_challenges: { select: { challenge_id: true } } };
}>;

@ApiTags('Evaluations')
@ApiBearerAuth('JWT')
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  @ApiOperation({ summary: 'Listar evaluaciones' })
  @ApiResponse({ status: 200, type: [EvaluationResponseDto] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async getAll(): Promise<EvaluationResponseDto[]> {
    const evaluations = await this.prisma.evaluations.findMany({
      include: {
        evaluation_challenges: {
          select: { challenge_id: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return evaluations.map((evaluation) => this.toResponse(evaluation));
  }

  @Get('course/:courseId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  @ApiOperation({ summary: 'Listar evaluaciones de un curso' })
  @ApiParam({ name: 'courseId', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, type: [EvaluationResponseDto] })
  async getByCourse(
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<EvaluationResponseDto[]> {
    const evaluations = await this.prisma.evaluations.findMany({
      where: { course_id: courseId },
      include: {
        evaluation_challenges: {
          select: { challenge_id: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return evaluations.map((evaluation) => this.toResponse(evaluation));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  @ApiOperation({ summary: 'Obtener evaluación por ID' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, type: EvaluationResponseDto })
  @ApiNotFoundResponse()
  async getById(@Param('id', ParseUUIDPipe) id: string): Promise<EvaluationResponseDto> {
    const evaluation = await this.findEvaluationOrThrow(id);
    return this.toResponse(evaluation);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Crear evaluación' })
  @ApiResponse({ status: 201, type: EvaluationResponseDto })
  async create(
    @Body() dto: CreateEvaluationDto,
    @Request() req: { user: { id: number; role: string } },
  ): Promise<EvaluationResponseDto> {
    await this.assertCourseOwnership(dto.courseId, req.user.id, req.user.role);

    const created = await this.prisma.$transaction(async (tx) => {
      const evaluation = await tx.evaluations.create({
        data: {
          name: dto.title,
          description: dto.description ?? null,
          course_id: dto.courseId,
          start_date: dto.startDate ? new Date(dto.startDate) : null,
          end_date: dto.endDate ? new Date(dto.endDate) : null,
          duration_minutes: dto.durationMinutes ?? null,
          max_attempts: dto.maxAttempts ?? null,
          results_visibility: dto.resultsVisibility ?? 'after_deadline',
        },
      });

      if (dto.challengeIds.length > 0) {
        await tx.evaluation_challenges.createMany({
          data: dto.challengeIds.map((challengeId) => ({
            evaluation_id: evaluation.id,
            challenge_id: challengeId,
          })),
        });
      }

      return tx.evaluations.findUnique({
        where: { id: evaluation.id },
        include: {
          evaluation_challenges: {
            select: { challenge_id: true },
          },
        },
      });
    });

    if (!created) {
      throw new BadRequestException('No se pudo crear la evaluación');
    }

    return this.toResponse(created);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Actualizar evaluación' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, type: EvaluationResponseDto })
  @ApiNotFoundResponse()
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEvaluationDto,
    @Request() req: { user: { id: number; role: string } },
  ): Promise<EvaluationResponseDto> {
    const current = await this.findEvaluationOrThrow(id);
    const effectiveCourseId = dto.courseId ?? current.course_id;

    if (!effectiveCourseId) {
      throw new BadRequestException('La evaluación debe pertenecer a un curso');
    }

    await this.assertCourseOwnership(effectiveCourseId, req.user.id, req.user.role);

    const updated = await this.prisma.$transaction(async (tx) => {
      const evaluation = await tx.evaluations.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { name: dto.title } : {}),
          ...(dto.description !== undefined ? { description: dto.description } : {}),
          ...(dto.courseId !== undefined ? { course_id: dto.courseId } : {}),
          ...(dto.startDate !== undefined ? { start_date: dto.startDate ? new Date(dto.startDate) : null } : {}),
          ...(dto.endDate !== undefined ? { end_date: dto.endDate ? new Date(dto.endDate) : null } : {}),
          ...(dto.durationMinutes !== undefined ? { duration_minutes: dto.durationMinutes } : {}),
          ...(dto.maxAttempts !== undefined ? { max_attempts: dto.maxAttempts } : {}),
          ...(dto.resultsVisibility !== undefined ? { results_visibility: dto.resultsVisibility } : {}),
        },
      });

      if (dto.challengeIds !== undefined) {
        await tx.evaluation_challenges.deleteMany({ where: { evaluation_id: id } });

        if (dto.challengeIds.length > 0) {
          await tx.evaluation_challenges.createMany({
            data: dto.challengeIds.map((challengeId) => ({
              evaluation_id: id,
              challenge_id: challengeId,
            })),
          });
        }
      }

      return tx.evaluations.findUnique({
        where: { id: evaluation.id },
        include: {
          evaluation_challenges: {
            select: { challenge_id: true },
          },
        },
      });
    });

    if (!updated) {
      throw new BadRequestException('No se pudo actualizar la evaluación');
    }

    return this.toResponse(updated);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Eliminar evaluación' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 204 })
  @ApiNotFoundResponse()
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: { id: number; role: string } },
  ): Promise<void> {
    const current = await this.findEvaluationOrThrow(id);

    if (!current.course_id) {
      throw new BadRequestException('La evaluación debe pertenecer a un curso');
    }

    await this.assertCourseOwnership(current.course_id, req.user.id, req.user.role);

    await this.prisma.$transaction(async (tx) => {
      await tx.evaluation_challenges.deleteMany({ where: { evaluation_id: id } });
      await tx.evaluation_attempts.deleteMany({ where: { evaluation_id: id } });
      await tx.evaluations.delete({ where: { id } });
    });
  }

  private async findEvaluationOrThrow(id: string): Promise<EvaluationRow> {
    const evaluation = await this.prisma.evaluations.findUnique({
      where: { id },
      include: {
        evaluation_challenges: {
          select: { challenge_id: true },
        },
      },
    });

    if (!evaluation) {
      throw new NotFoundException('Evaluación no encontrada');
    }

    return evaluation;
  }

  private async assertCourseOwnership(courseId: string, userId: number, role: string): Promise<void> {
    if (role === 'ADMIN') return;

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      select: { professor_id: true },
    });

    if (!course) {
      throw new NotFoundException('Curso no encontrado');
    }

    if (course.professor_id !== userId) {
      throw new ForbiddenException('No tienes permiso para modificar evaluaciones de este curso');
    }
  }

  private toResponse(evaluation: EvaluationRow): EvaluationResponseDto {
    return {
      id: evaluation.id,
      title: evaluation.name,
      description: evaluation.description ?? undefined,
      courseId: evaluation.course_id ?? '',
      challengeIds: evaluation.evaluation_challenges.map((item) => item.challenge_id),
      startDate: evaluation.start_date?.toISOString(),
      endDate: evaluation.end_date?.toISOString(),
      durationMinutes: evaluation.duration_minutes ?? undefined,
      maxAttempts: evaluation.max_attempts ?? undefined,
      resultsVisibility:
        (evaluation.results_visibility as 'immediate' | 'after_deadline' | 'manual' | null) ??
        'after_deadline',
      createdAt: evaluation.created_at?.toISOString(),
    };
  }
}
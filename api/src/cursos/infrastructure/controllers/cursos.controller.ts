import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  SetMetadata,
  Request,
  BadRequestException,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CrearCursoUseCase } from '../../aplication/use-cases/crear-curso.use-case';
import { GetCursosUseCase } from '../../aplication/use-cases/get-cursos.use-case';
import { GetCursoUseCase } from '../../aplication/use-cases/get-curso.use-case';
import { UpdateCursoUseCase } from '../../aplication/use-cases/update-curso.use-case';
import { DeleteCursoUseCase } from '../../aplication/use-cases/delete-curso.use-case';
import { AddStudentToCursoUseCase } from '../../aplication/use-cases/add-student-to-curso.use-case';
import { AddStudentDto } from '../../aplication/dtos/add-student.dto';
import { Curso } from '../../domain/entities/curso.entity';
import { CreateCursoDto } from '../../aplication/dtos/create-curso.dto';
import { UpdateCursoDto } from '../../aplication/dtos/update-curso.dto';
import { CursoResponseDto } from '../../aplication/dtos/curso-response.dto';
import { DeleteCursoResponseDto } from '../../aplication/dtos/delete-curso-response.dto';

@ApiTags('Cursos')
@ApiBearerAuth('JWT')
@Controller('cursos')
export class CursosController {
  constructor(
    private readonly crearCursoUseCase: CrearCursoUseCase,
    private readonly getCursosUseCase: GetCursosUseCase,
    private readonly getCursoUseCase: GetCursoUseCase,
    private readonly updateCursoUseCase: UpdateCursoUseCase,
    private readonly deleteCursoUseCase: DeleteCursoUseCase,
    private readonly addStudentToCursoUseCase: AddStudentToCursoUseCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({
    summary: 'Listar cursos del profesor',
    description: 'Lista cursos filtrados por el profesor autenticado. Roles: **PROFESSOR**, **ADMIN**.',
  })
  @ApiResponse({ status: 200, description: 'Lista de cursos', type: [CursoResponseDto] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Rol no permitido' })
  async getAllCursos(@Request() req: { user: { id: number } }) {
    try {
      return await this.getCursosUseCase.execute({
        professorId: req.user.id,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener cursos',
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Obtener curso por ID (UUID)' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, type: CursoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getCurso(@Param('id') id: string) {
    try {
      return await this.getCursoUseCase.execute(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener el curso',
      );
    }
  }

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({
    summary: 'Crear curso',
    description: 'Asigna automáticamente `professorId` al usuario autenticado.',
  })
  @ApiBody({
    type: CreateCursoDto,
    examples: {
      ejemploCurso: {
        summary: 'Curso de ejemplo',
        value: {
          name: 'Arquitectura de Software',
          code: 'ARQ-401',
          period: '2026-1',
          groupNumber: '2',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Curso creado', type: CursoResponseDto })
  @ApiResponse({ status: 400, description: 'Código duplicado o error de validación' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async crearCurso(
    @Body() dto: CreateCursoDto,
    @Request() req: { user: { id: number } },
  ) {
    try {
      const cursoData: Omit<Curso, 'id' | 'createdAt'> = {
        name: dto.name,
        code: dto.code,
        period: dto.period,
        groupNumber: dto.groupNumber,
        professorId: req.user.id,
      };
      return await this.crearCursoUseCase.execute(cursoData);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al crear el curso',
      );
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({
    summary: 'Actualizar curso',
    description: 'Solo el profesor dueño o **ADMIN**. No se puede cambiar `professorId` desde aquí.',
  })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({
    type: UpdateCursoDto,
    examples: {
      parcial: {
        summary: 'Actualización parcial',
        value: {
          name: 'Arquitectura de Empresarial',
          groupNumber: '5',
        },
      },
    },
  })
  @ApiResponse({ status: 200, type: CursoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Sin permiso sobre el curso' })
  @ApiNotFoundResponse()
  async updateCurso(
    @Param('id') id: string,
    @Body() updates: UpdateCursoDto,
    @Request() req: { user: { id: number; role: string } },
  ) {
    try {
      const curso = await this.getCursoUseCase.execute(id);
      if (curso.professorId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new BadRequestException('No tienes permiso para actualizar este curso');
      }

      const safeUpdates: Partial<Omit<Curso, 'id' | 'createdAt'>> = {};
      if (updates.name !== undefined) safeUpdates.name = updates.name;
      if (updates.code !== undefined) safeUpdates.code = updates.code;
      if (updates.period !== undefined) safeUpdates.period = updates.period;
      if (updates.groupNumber !== undefined) safeUpdates.groupNumber = updates.groupNumber;

      return await this.updateCursoUseCase.execute(id, safeUpdates);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al actualizar el curso',
      );
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Eliminar curso', description: 'Solo el dueño o **ADMIN**.' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, type: DeleteCursoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async deleteCurso(@Param('id') id: string, @Request() req: { user: { id: number; role: string } }) {
    try {
      const curso = await this.getCursoUseCase.execute(id);
      if (curso.professorId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new BadRequestException('No tienes permiso para eliminar este curso');
      }

      await this.deleteCursoUseCase.execute(id);
      return { message: 'Curso eliminado exitosamente' };
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al eliminar el curso',
      );
    }
  }

  @Post(':id/students')
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Agregar estudiante al curso' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: AddStudentDto })
  @ApiResponse({ status: 201, description: 'Estudiante añadido al curso' })
  async addStudentToCurso(@Param('id') id: string, @Body() body: AddStudentDto) {
    try {
      const studentId = body.studentId;
      if (typeof studentId !== 'number') {
        throw new BadRequestException('studentId debe ser un número');
      }

      await this.addStudentToCursoUseCase.execute(id, studentId);
      return { message: 'Estudiante añadido al curso' };
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error instanceof Error ? error.message : 'Error al agregar estudiante');
    }
  }
}

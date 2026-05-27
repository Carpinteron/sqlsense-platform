// src/submissions/infrastructure/controllers/submissions.controller.ts

import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  ParseIntPipe, 
  ParseUUIDPipe, 
  Request, 
  UseGuards,
  SetMetadata,
  BadRequestException,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CreateSubmissionUseCase } from '../../application/use-cases/create-submission.use-case';
import { GetSubmissionByIdUseCase } from '../../application/use-cases/get-submission-by-id.use-case';
import { GetSubmissionsByStudentUseCase } from '../../application/use-cases/get-submission-by-student.use-case';
import { GetSubmissionsByChallengeUseCase } from '../../application/use-cases/get-submission-by-challenge.use-case';
import { GetChallengeReportUseCase } from '../../application/use-cases/get-challenge-report.use-case';

import { CreateSubmissionDto } from '../../application/dtos/create-submission.dto';
import { SubmissionCreatedResponseDto } from '../../application/dtos/submission-created-response.dto';
import { ChallengeReportResponseDto } from '../../application/dtos/grade-report-response.dto';
import { Submission } from '../../domain/entities/submission.interface';

import { GetStudentReportUseCase } from '../../application/use-cases/get-student-report.use-case';
import { StudentReportResponseDto } from '../../application/dtos/student-report-response.dto';

import { GetCourseReportUseCase } from '../../application/use-cases/get-course-report.use-case';
import { CourseReportResponseDto } from '../../application/dtos/course-report-response.dto';

@ApiTags('Submissions')
@ApiBearerAuth('JWT')
@Controller('submissions')
export class SubmissionsController {
  constructor(
    private readonly _createSubmissionUseCase: CreateSubmissionUseCase,
    private readonly _getSubmissionByIdUseCase: GetSubmissionByIdUseCase,
    private readonly _getSubmissionsByStudentUseCase: GetSubmissionsByStudentUseCase,
    private readonly _getSubmissionsByChallengeUseCase: GetSubmissionsByChallengeUseCase,
    private readonly _getChallengeReportUseCase: GetChallengeReportUseCase,
    private readonly _getStudentReportUseCase: GetStudentReportUseCase,
    private readonly _getCourseReportUseCase: GetCourseReportUseCase,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['STUDENT','ADMIN'])
  @ApiOperation({ 
    summary: 'Crear entrega de un reto', 
    description: 'Roles: **STUDENT**. Extrae el ID del estudiante directamente de la sesión segura del JWT.' 
  })
  @ApiResponse({ status: 201, type: SubmissionCreatedResponseDto })
  async create(
    @Body() dto: CreateSubmissionDto,
    @Request() req: { user: { id: number; email: string; role: string } }, 
  ): Promise<SubmissionCreatedResponseDto> {
    try {
      if (!req.user || !req.user.id) {
        throw new ForbiddenException('No se encontró un usuario válido en la sesión.');
      }

      const studentId = Number(req.user.id);
      const userRole = req.user.role;

      return await this._createSubmissionUseCase.execute(dto, studentId, userRole);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al registrar la entrega',
      );
    }
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  @ApiOperation({ summary: 'Obtener detalle de una entrega por ID (UUID)' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  async getById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<Submission> {
    try {
      return await this._getSubmissionByIdUseCase.execute(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener la entrega',
      );
    }
  }

  @Get('student/:studentId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  @ApiOperation({ 
    summary: 'Obtener historial de entregas de un estudiante',
    description: 'Roles: **PROFESSOR**, **ADMIN**, **STUDENT**. Si eres estudiante, por seguridad deberías consultar solo tu propio ID (puedes validar esto opcionalmente).'
  })
  @ApiParam({ name: 'studentId', example: 1 })
  async getByStudent(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Request() req: { user: { id: number; email: string; role: string } },
  ): Promise<Submission[]> {
    try {
      const authUserId = Number(req.user.id);

      if (req.user.role === 'STUDENT' && authUserId !== studentId) {
        throw new ForbiddenException('No tienes permiso para ver el historial de otro estudiante.');
      }

      return await this._getSubmissionsByStudentUseCase.execute(studentId);
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener el historial',
      );
    }
  }

  @Get('challenge/:challengeId/report')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Obtener reporte de notas y feedback de la IA para un reto (Esquema: challenge)' })
  @ApiParam({ name: 'challengeId', example: 'aa0e8400-e29b-41d4-a716-446655441111' })
  async getChallengeReport(
    @Param('challengeId', ParseUUIDPipe) challengeId: string
  ): Promise<ChallengeReportResponseDto> {
    try {
      return await this._getChallengeReportUseCase.execute(challengeId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al generar el reporte',
      );
    }
  }

  //Reporte de estudiante
  @Get('student/:studentId/report')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  @ApiOperation({ summary: 'Obtener reporte de entregas de un estudiante' })
  @ApiParam({ name: 'studentId', example: 1 })
  async getStudentReport(
    @Param('studentId', ParseIntPipe) studentId: number,
  ): Promise<StudentReportResponseDto> {
    try {
      return await this._getStudentReportUseCase.execute(studentId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al generar el reporte del estudiante',
      );
    }
  }
  //Fin reporte de estudiante

  //Reporte de curso
  @Get('course/:courseId/report')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Obtener reporte de notas y progreso de un curso' })
  @ApiParam({ name: 'courseId', example: 'aa0e8400-e29b-41d4-a716-446655441111' })
  async getCourseReport(
    @Param('courseId', ParseUUIDPipe) courseId: string,
  ): Promise<CourseReportResponseDto> {
    try {
      return await this._getCourseReportUseCase.execute(courseId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al generar el reporte del curso',
      );
    }
  }
  //Fin reporte de curso

  @Get('challenge/:challengeId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Listar todas las entregas crudas asociadas a un reto' })
  @ApiParam({ name: 'challengeId', example: 'aa0e8400-e29b-41d4-a716-446655441111' })
  async getByChallenge(
    @Param('challengeId', ParseUUIDPipe) challengeId: string
  ): Promise<Submission[]> {
    try {
      return await this._getSubmissionsByChallengeUseCase.execute(challengeId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener las entregas',
      );
    }
  }
}
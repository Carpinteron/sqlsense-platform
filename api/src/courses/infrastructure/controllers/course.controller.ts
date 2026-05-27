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
  ParseIntPipe,
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
import { GetCoursesUseCase } from '../../aplication/use-cases/get-cursos.use-case';
import { GetCourseUseCase } from '../../aplication/use-cases/get-curso.use-case';
import { UpdateCourseUseCase } from '../../aplication/use-cases/update-curso.use-case';
import { DeleteCourseUseCase } from '../../aplication/use-cases/delete-curso.use-case';
import { AddStudentToCourseUseCase } from '../../aplication/use-cases/add-student-to-curso.use-case';
import { GetCourseStudentsUseCase } from '../../aplication/use-cases/get-course-students.use-case';
import { GetStudentCursosUseCase } from '../../aplication/use-cases/get-student-cursos.use-case';
import { AddStudentDto } from '../../aplication/dtos/add-student.dto';
import { Course } from '../../domain/entities/course.entity';
import { CreateCourseDto } from '../../aplication/dtos/create-course.dto';
import { UpdateCourseDto } from '../../aplication/dtos/update-course.dto';
import { CourseResponseDto } from '../../aplication/dtos/course-response.dto';
import { DeleteCourseResponseDto } from '../../aplication/dtos/delete-course-response.dto';
import { UserResponseDto } from '../../../users/application/dtos/user-response.dto';

@ApiTags('Cursos')
@ApiBearerAuth('JWT')
@Controller('cursos')
export class CursosController {
  constructor(
    private readonly crearCursoUseCase: CrearCursoUseCase,
    private readonly getCursosUseCase: GetCoursesUseCase,
    private readonly getCursoUseCase: GetCourseUseCase,
    private readonly updateCursoUseCase: UpdateCourseUseCase,
    private readonly deleteCursoUseCase: DeleteCourseUseCase,
    private readonly addStudentToCourseUseCase: AddStudentToCourseUseCase,
    private readonly getCourseStudentsUseCase: GetCourseStudentsUseCase,
    private readonly getStudentCursosUseCase: GetStudentCursosUseCase,
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({
    summary: 'Listar cursos del profesor',
    description: 'Lista cursos filtrados por el profesor autenticado. Roles: **PROFESSOR**, **ADMIN**.',
  })
  @ApiResponse({ status: 200, description: 'Lista de cursos', type: [CourseResponseDto] })
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
  @ApiResponse({ status: 200, type: CourseResponseDto })
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

  @Get(':id/students')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Listar estudiantes de un curso' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Lista de estudiantes', type: [UserResponseDto] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getCourseStudents(@Param('id') id: string) {
    try {
      return await this.getCourseStudentsUseCase.execute(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener estudiantes del curso',
      );
    }
  }

  @Get('estudiantes/:studentId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['STUDENT', 'PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Listar cursos de un estudiante' })
  @ApiParam({ name: 'studentId', example: 2 })
  @ApiResponse({ status: 200, description: 'Lista de cursos', type: [CourseResponseDto] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getStudentCursos(@Param('studentId', ParseIntPipe) studentId: number) {
    try {
      return await this.getStudentCursosUseCase.execute(studentId);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener cursos del estudiante',
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
    type: CreateCourseDto,
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
  @ApiResponse({ status: 201, description: 'Curso creado', type: CourseResponseDto })
  @ApiResponse({ status: 400, description: 'Código duplicado o error de validación' })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async crearCurso(
    @Body() dto: CreateCourseDto,
    @Request() req: { user: { id: number } },
  ) {
    try {
      const cursoData: Omit<Course, 'id' | 'createdAt'> = {
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
    type: UpdateCourseDto,
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
  @ApiResponse({ status: 200, type: CourseResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Sin permiso sobre el curso' })
  @ApiNotFoundResponse()
  async updateCourse(
    @Param('id') id: string,
    @Body() updates: UpdateCourseDto,
    @Request() req: { user: { id: number; role: string } },
  ) {
    try {
      const curso = await this.getCursoUseCase.execute(id);
      if (curso.professorId !== req.user.id && req.user.role !== 'ADMIN') {
        throw new BadRequestException('No tienes permiso para actualizar este curso');
      }

      const safeUpdates: Partial<Omit<Course, 'id' | 'createdAt'>> = {};
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
  @ApiResponse({ status: 200, type: DeleteCourseResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async deleteCourse(@Param('id') id: string, @Request() req: { user: { id: number; role: string } }) {
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

  @Post(':id/student')
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

      await this.addStudentToCourseUseCase.execute(id, studentId);
      return { message: 'Estudiante añadido al curso' };
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(error instanceof Error ? error.message : 'Error al agregar estudiante');
    }
  }
}

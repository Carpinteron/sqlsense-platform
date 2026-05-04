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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { CrearCursoUseCase } from '../../aplication/use-cases/crear-curso.use-case';
import { GetCursosUseCase } from '../../aplication/use-cases/get-cursos.use-case';
import { GetCursoUseCase } from '../../aplication/use-cases/get-curso.use-case';
import { UpdateCursoUseCase } from '../../aplication/use-cases/update-curso.use-case';
import { DeleteCursoUseCase } from '../../aplication/use-cases/delete-curso.use-case';
import { Curso } from '../../domain/entities/curso.entity';

@Controller('cursos')
export class CursosController {
  constructor(
    private readonly crearCursoUseCase: CrearCursoUseCase,
    private readonly getCursosUseCase: GetCursosUseCase,
    private readonly getCursoUseCase: GetCursoUseCase,
    private readonly updateCursoUseCase: UpdateCursoUseCase,
    private readonly deleteCursoUseCase: DeleteCursoUseCase,
  ) {}

  // GET todos los cursos - solo profesores
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async getAllCursos(@Request() req) {
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

  // GET un curso específico - solo profesores
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
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

  // POST crear curso - solo profesores
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async crearCurso(@Body() body: Omit<Curso, 'id' | 'createdAt'>, @Request() req) {
    try {
      // Asignar el profesor actual al curso
      const cursoData = {
        ...body,
        professorId: req.user.id,
      };
      return await this.crearCursoUseCase.execute(cursoData);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al crear el curso',
      );
    }
  }

  // PUT actualizar curso - solo profesores (y solo el suyo)
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async updateCurso(
    @Param('id') id: string,
    @Body() updates: Partial<Omit<Curso, 'id' | 'createdAt'>>,
    @Request() req,
  ) {
    try {
      // Validar que el profesor sea dueño del curso
      const curso = await this.getCursoUseCase.execute(id);
      if (
        curso.professorId !== req.user.id &&
        req.user.role !== 'ADMIN'
      ) {
        throw new BadRequestException(
          'No tienes permiso para actualizar este curso',
        );
      }

      // No permitir cambiar el profesor
      const { professorId, ...safeUpdates } = updates;
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

  // DELETE eliminar curso - solo profesores (y solo el suyo)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async deleteCurso(@Param('id') id: string, @Request() req) {
    try {
      // Validar que el profesor sea dueño del curso
      const curso = await this.getCursoUseCase.execute(id);
      if (
        curso.professorId !== req.user.id &&
        req.user.role !== 'ADMIN'
      ) {
        throw new BadRequestException(
          'No tienes permiso para eliminar este curso',
        );
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
}

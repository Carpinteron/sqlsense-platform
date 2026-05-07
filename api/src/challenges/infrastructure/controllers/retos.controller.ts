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
import { CrearRetoUseCase } from '../../aplication/use-cases/crear-reto.use-case';
import { GetRetosUseCase } from '../../aplication/use-cases/get-retos.use-case';
import { GetRetoByIdUseCase } from '../../aplication/use-cases/get-reto-by-id.use-case';
import { GetRetoByTitleUseCase } from '../../aplication/use-cases/get-reto-by-title.use-case';
import { UpdateRetoUseCase } from '../../aplication/use-cases/update-reto.use-case';
import { DeleteRetoUseCase } from '../../aplication/use-cases/delete-reto.use-case';
import { Reto } from '../../domain/entities/reto.entity';

@Controller('retos')
export class RetosController {
  constructor(
    private readonly crearRetoUseCase: CrearRetoUseCase,
    private readonly getRetosUseCase: GetRetosUseCase,
    private readonly getRetoByIdUseCase: GetRetoByIdUseCase,
    private readonly getRetoByTitleUseCase: GetRetoByTitleUseCase,
    private readonly updateRetoUseCase: UpdateRetoUseCase,
    private readonly deleteRetoUseCase: DeleteRetoUseCase,
  ) {}

  // GET todos los retos
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  async getAllRetos(@Request() req) {
    try {
      const filter = req.user.role === 'STUDENT'
        ? { status: 'published' as const }
        : {};
      return await this.getRetosUseCase.execute(filter);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener retos',
      );
    }
  }

  // GET por título - debe ir ANTES que /:id
  @Get('title/:title')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async getRetoByTitle(@Param('title') title: string) {
    try {
      return await this.getRetoByTitleUseCase.execute(title);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener el reto',
      );
    }
  }

  // GET por id - debe ir DESPUÉS de /title/:title
  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN', 'STUDENT'])
  async getReto(@Param('id') id: string) {
    try {
      return await this.getRetoByIdUseCase.execute(id);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener el reto',
      );
    }
  }

  // POST crear reto - solo profesores
  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async crearReto(@Body() body: any, @Request() req) {
    try {
      const retoData: Omit<Reto, 'id' | 'createdAt'> = {
        title: body.title,
        description: body.description,
        difficulty: body.difficulty,
        tags: body.tags,
        databaseEngine: body.databaseEngine,
        timeLimit: body.timeLimit,
        status: body.status ?? 'draft',
        courseId: body.courseId,
        createdBy: req.user.id,
        schemaSql: body.schemaSql,
        seedDataSql: body.seedDataSql,
        expectedResult: body.expectedResult,
      };
      return await this.crearRetoUseCase.execute(retoData);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al crear el reto',
      );
    }
  }

  // PUT actualizar reto - solo el profesor que lo creó
  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async updateReto(
    @Param('id') id: string,
    @Body() updates: any,
    @Request() req,
  ) {
    try {
      const reto = await this.getRetoByIdUseCase.execute(id);
      if (reto.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
        throw new BadRequestException(
          'No tienes permiso para actualizar este reto',
        );
      }

      const safeUpdates: Partial<Omit<Reto, 'id' | 'createdAt'>> = {};
      if (updates.title !== undefined) safeUpdates.title = updates.title;
      if (updates.description !== undefined) safeUpdates.description = updates.description;
      if (updates.difficulty !== undefined) safeUpdates.difficulty = updates.difficulty;
      if (updates.tags !== undefined) safeUpdates.tags = updates.tags;
      if (updates.timeLimit !== undefined) safeUpdates.timeLimit = updates.timeLimit;
      if (updates.status !== undefined) safeUpdates.status = updates.status;
      if (updates.schemaSql !== undefined) safeUpdates.schemaSql = updates.schemaSql;
      if (updates.seedDataSql !== undefined) safeUpdates.seedDataSql = updates.seedDataSql;
      if (updates.expectedResult !== undefined) safeUpdates.expectedResult = updates.expectedResult;
      // No se permite cambiar courseId ni createdBy

      return await this.updateRetoUseCase.execute(id, safeUpdates);
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al actualizar el reto',
      );
    }
  }

  // DELETE eliminar reto - solo el profesor que lo creó
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async deleteReto(@Param('id') id: string, @Request() req) {
    try {
      const reto = await this.getRetoByIdUseCase.execute(id);
      if (reto.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
        throw new BadRequestException(
          'No tienes permiso para eliminar este reto',
        );
      }

      await this.deleteRetoUseCase.execute(id);
      return { message: 'Reto eliminado exitosamente' };
    } catch (error) {
      if (error instanceof Error && error.message.includes('no encontrado')) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al eliminar el reto',
      );
    }
  }
}
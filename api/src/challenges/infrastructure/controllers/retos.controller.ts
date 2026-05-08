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
import { CrearRetoUseCase } from '../../aplication/use-cases/crear-reto.use-case';
import { GetRetosUseCase } from '../../aplication/use-cases/get-retos.use-case';
import { GetRetoByIdUseCase } from '../../aplication/use-cases/get-reto-by-id.use-case';
import { GetRetoByTitleUseCase } from '../../aplication/use-cases/get-reto-by-title.use-case';
import { UpdateRetoUseCase } from '../../aplication/use-cases/update-reto.use-case';
import { DeleteRetoUseCase } from '../../aplication/use-cases/delete-reto.use-case';
import { Reto } from '../../domain/entities/reto.entity';
import { CreateRetoDto } from '../../aplication/dtos/create-reto.dto';
import { UpdateRetoDto } from '../../aplication/dtos/update-reto.dto';
import { RetoResponseDto } from '../../aplication/dtos/reto-response.dto';
import { DeleteRetoResponseDto } from '../../aplication/dtos/delete-reto-response.dto';

@ApiTags('Retos')
@ApiBearerAuth('JWT')
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
  @ApiOperation({
    summary: 'Listar retos',
    description:
      'Roles: **PROFESSOR**, **ADMIN**, **STUDENT**. Si el usuario es STUDENT, el backend filtra automáticamente a `status=published`.',
  })
  @ApiResponse({ status: 200, type: [RetoResponseDto] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async getAllRetos(@Request() req: { user: { role: string } }) {
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
  @ApiOperation({ summary: 'Obtener reto por título' })
  @ApiParam({ name: 'title', example: 'SELECT_BASICO_001' })
  @ApiResponse({ status: 200, type: RetoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getRetoByTitle(@Param('title') title: string) {
    try {
      return await this.getRetoByTitleUseCase.execute(title);
    } catch (error) {
      if (error instanceof Error && (error.message.includes('no encontrado') || error.message.includes('not found'))) {
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
  @ApiOperation({ summary: 'Obtener reto por ID (UUID)' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, type: RetoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getReto(@Param('id') id: string) {
    try {
      return await this.getRetoByIdUseCase.execute(id);
    } catch (error) {
      if (error instanceof Error && (error.message.includes('no encontrado') || error.message.includes('not found'))) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al obtener el reto',
      );
    }
  }

  // POST crear reto - solo profesores
  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  @ApiOperation({ summary: 'Crear reto' })
  @ApiBody({
    type: CreateRetoDto,
    examples: {
      ejemplo: {
        summary: 'Reto de ejemplo',
        value: {
          title: 'SELECT_BASICO_001',
          description: 'Devuelve todos los usuarios ordenados por fecha de creación.',
          difficulty: 'Easy',
          tags: ['select', 'order-by'],
          databaseEngine: 'PostgreSQL',
          timeLimit: 60,
          status: 'draft',
          courseId: '550e8400-e29b-41d4-a716-446655440000',
          schemaSql: 'CREATE TABLE users(id INT PRIMARY KEY, created_at TIMESTAMP);',
          seedDataSql: 'INSERT INTO users(id, created_at) VALUES (1, NOW());',
          expectedResult: { rows: [{ id: 1 }] },
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: RetoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async crearReto(
    @Body() dto: CreateRetoDto,
    @Request() req: { user: { id: number } },
  ) {
    try {
      const retoData: Omit<Reto, 'id' | 'createdAt'> = {
        title: dto.title,
        description: dto.description,
        difficulty: dto.difficulty,
        tags: dto.tags,
        databaseEngine: dto.databaseEngine,
        timeLimit: dto.timeLimit,
        status: dto.status ?? 'draft',
        courseId: dto.courseId,
        createdBy: req.user.id,
        schemaSql: dto.schemaSql,
        seedDataSql: dto.seedDataSql,
        expectedResult: dto.expectedResult,
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
  @ApiOperation({ summary: 'Actualizar reto' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiBody({ type: UpdateRetoDto })
  @ApiResponse({ status: 200, type: RetoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Sin permiso (no creador ni ADMIN)' })
  @ApiNotFoundResponse()
  async updateReto(
    @Param('id') id: string,
    @Body() updates: UpdateRetoDto,
    @Request() req: { user: { id: number; role: string } },
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
      if (updates.databaseEngine !== undefined) safeUpdates.databaseEngine = updates.databaseEngine;
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
  @ApiOperation({ summary: 'Eliminar reto' })
  @ApiParam({ name: 'id', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, type: DeleteRetoResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async deleteReto(
    @Param('id') id: string,
    @Request() req: { user: { id: number; role: string } },
  ) {
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
      if (error instanceof Error && (error.message.includes('no encontrado') || error.message.includes('not found'))) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Error al eliminar el reto',
      );
    }
  }
}
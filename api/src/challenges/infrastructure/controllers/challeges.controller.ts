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
import { GetChallengesUseCase } from '../../aplication/use-cases/get-challeges.use-case';
import { GetChallengeByIdUseCase } from '../../aplication/use-cases/get-challege-by-id.use-case';
import { GetChallengeByTitleUseCase } from '../../aplication/use-cases/get-challege-by-title.use-case';
import { UpdateChallengeUseCase } from '../../aplication/use-cases/update-challege.use-case';
import { DeleteChallengeUseCase } from '../../aplication/use-cases/delete-challege.use-case';
import { Challenge } from '../../domain/entities/challege.entity';
import { CreateChallengeDto } from '../../aplication/dtos/create-challege.dto';
import { UpdateChallengeDto } from '../../aplication/dtos/update-challege.dto';
import { ChallengeResponseDto} from '../../aplication/dtos/challege-response.dto';
import { DeleteChallengeResponseDto } from '../../aplication/dtos/delete-challege-response.dto';
import { CreateChallengeWithExpectedQueryUseCase } from '../../aplication/use-cases/create-challenge-with-expected-query.use-case';

@ApiTags('Challenges')
@ApiBearerAuth('JWT')
@Controller('challenges')
export class ChallengesController {
  constructor(
    private readonly createChallengeWithExpectedQueryUseCase: CreateChallengeWithExpectedQueryUseCase,
    private readonly getChallengesUseCase: GetChallengesUseCase,
    private readonly getChallengeByIdUseCase: GetChallengeByIdUseCase,
    private readonly getChallengeByTitleUseCase: GetChallengeByTitleUseCase,
    private readonly updateChallengeUseCase: UpdateChallengeUseCase,
    private readonly deleteChallengeUseCase: DeleteChallengeUseCase,
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
  @ApiResponse({ status: 200, type: [ChallengeResponseDto] })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async getAllChallenges(@Request() req: { user: { role: string } }) {
    try {
      const filter = req.user.role === 'STUDENT'
        ? { status: 'published' as const }
        : {};
      return await this.getChallengesUseCase.execute(filter);
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
  @ApiResponse({ status: 200, type: ChallengeResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getChallengeByTitle(@Param('title') title: string) {
    try {
      return await this.getChallengeByTitleUseCase.execute(title);
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
  @ApiResponse({ status: 200, type: ChallengeResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async getChallenge(@Param('id') id: string) {
    try {
      return await this.getChallengeByIdUseCase.execute(id);
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
    type: CreateChallengeDto,
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
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: ChallengeResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  async crearChallenge(
    @Body() dto: CreateChallengeDto,
    @Request() req: { user: { id: number } },
  ) {
    try {
      return await this.createChallengeWithExpectedQueryUseCase.execute(dto, req.user.id);
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
  @ApiBody({ type: UpdateChallengeDto })
  @ApiResponse({ status: 200, type: ChallengeResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse({ description: 'Sin permiso (no creador ni ADMIN)' })
  @ApiNotFoundResponse()
  async updateChallenge(
    @Param('id') id: string,
    @Body() updates: UpdateChallengeDto,
    @Request() req: { user: { id: number; role: string } },
  ) {
    try {
      const challenge = await this.getChallengeByIdUseCase.execute(id);
      if (challenge.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
        throw new BadRequestException(
          'No tienes permiso para actualizar este reto',
        );
      }

      const safeUpdates: Partial<Omit<Challenge, 'id' | 'createdAt'>> = {};
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

      return await this.updateChallengeUseCase.execute(id, safeUpdates);
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
  @ApiResponse({ status: 200, type: DeleteChallengeResponseDto })
  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiNotFoundResponse()
  async deleteChallenge(
    @Param('id') id: string,
    @Request() req: { user: { id: number; role: string } },
  ) {
    try {
      const challenge = await this.getChallengeByIdUseCase.execute(id);
      if (challenge.createdBy !== req.user.id && req.user.role !== 'ADMIN') {
        throw new BadRequestException(
          'No tienes permiso para eliminar este reto',
        );
      }

      await this.deleteChallengeUseCase.execute(id);
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
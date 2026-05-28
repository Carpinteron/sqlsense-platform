import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  BadRequestException,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { GenerateMockDataDto } from '../../application/dtos/generate-mock-data.dto';
import { EnqueueMockDataUseCase } from '../../application/use-cases/enqueue-mock-data.use-case';
import { GetMockDataJobUseCase } from '../../application/use-cases/get-mock-data-job.use-case';

@Controller('mock-data')
@ApiTags('Mock Data')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
export class MockDataController {
  constructor(
    private readonly enqueueUseCase: EnqueueMockDataUseCase,
    private readonly getJobUseCase: GetMockDataJobUseCase,
  ) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Encolar generación de mock data',
    description: 'Encola un job para generar datos fake. Devuelve un jobId para consultar el resultado. Solo PROFESSOR y ADMIN.',
  })
  @ApiBody({ type: GenerateMockDataDto })
  @ApiResponse({
    status: 201,
    description: 'Job encolado correctamente',
    schema: { example: { jobId: '42' } },
  })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  async generate(@Body() body: GenerateMockDataDto) {
    if (!body?.table?.trim()) {
      throw new BadRequestException('table is required');
    }
    if (!Number.isInteger(body.rows) || body.rows < 1) {
      throw new BadRequestException('rows must be a positive integer');
    }
    if (!body.fields || typeof body.fields !== 'object' || Object.keys(body.fields).length === 0) {
      throw new BadRequestException('fields must be a non-empty object');
    }
    for (const [name, spec] of Object.entries(body.fields)) {
      if (!spec?.type) {
        throw new BadRequestException(`field "${name}" is missing a type`);
      }
      if (spec.type === 'enum' && (!Array.isArray(spec.values) || spec.values.length === 0)) {
        throw new BadRequestException(`field "${name}" of type enum requires a non-empty values array`);
      }
      if (spec.type === 'foreign_key' && !spec.references) {
        throw new BadRequestException(`field "${name}" of type foreign_key requires a references value`);
      }
    }

    return this.enqueueUseCase.execute({
      table: body.table.trim(),
      rows: body.rows,
      fields: body.fields,
    });
  }

  @Get('jobs/:jobId')
  @ApiOperation({
    summary: 'Consultar estado de un job de mock data',
    description: 'Devuelve el estado actual del job y el resultado si ya completó.',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        jobId: '42',
        status: 'completed',
        result: {
          table: 'orders',
          count: 100,
          sql: "INSERT INTO orders (...) VALUES ...;",
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Job no encontrado' })
  async getJob(@Param('jobId') jobId: string) {
    return this.getJobUseCase.execute(jobId);
  }
}

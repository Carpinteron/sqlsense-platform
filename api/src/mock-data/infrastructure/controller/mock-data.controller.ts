import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { GenerateMockDataUseCase } from '../../application/use-cases/generate-mock-data.use-case';
import { GenerateMockDataDto } from '../../application/dtos/generate-mock-data.dto';
import { MockDataParseError } from '../../domain/errors/mock-data-parse.error';

@Controller('mock-data')
@ApiTags('Mock Data')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
export class MockDataController {
  constructor(private readonly generateMockData: GenerateMockDataUseCase) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generar datos mock para una tabla',
    description: 'Genera datos fake para una tabla SQL a partir de especificaciones de campos usando IA. Solo PROFESSOR y ADMIN.',
  })
  @ApiBody({
    type: GenerateMockDataDto,
    examples: {
      standard: {
        value: {
          table: 'orders',
          rows: 100,
          fields: {
            customer_id: {
              type: 'foreign_key',
              references: 'customers.id',
            },
            total: {
              type: 'decimal',
              min: 10000,
              max: 5000000,
            },
            created_at: {
              type: 'date',
              from: '2026-01-01',
              to: '2026-12-31',
            },
            status: {
              type: 'enum',
              values: ['PENDING', 'PAID', 'CANCELLED'],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Datos mock generados correctamente con SQL INSERT',
    schema: {
      example: {
        table: 'orders',
        sql: "INSERT INTO orders (customer_id, total, created_at, status) VALUES (1, 25000, '2026-06-15', 'PENDING'), ...",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validación fallida (table, rows, fields inválidos)',
  })
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

    try {
      return await this.generateMockData.execute(body);
    } catch (err) {
      if (err instanceof MockDataParseError) throw new BadRequestException(err.message);
      throw err;
    }
  }
}

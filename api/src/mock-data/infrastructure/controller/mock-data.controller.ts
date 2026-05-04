import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../auth/infrastructure/guards/roles.guard';
import { GenerateMockDataUseCase } from '../../application/use-cases/generate-mock-data.use-case';
import type { MockDataSpec } from '../../domain/entities/mock-data.entity';
import { MockDataParseError } from '../../domain/errors/mock-data-parse.error';

@Controller('mock-data')
export class MockDataController {
  constructor(private readonly generateMockData: GenerateMockDataUseCase) {}

  @Post('generate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async generate(@Body() body: MockDataSpec) {
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

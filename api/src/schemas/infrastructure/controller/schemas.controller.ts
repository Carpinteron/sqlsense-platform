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
import { GenerateSchemaUseCase } from '../../application/use-cases/generate-schema.use-case';
import { RegenerateSchemaUseCase } from '../../application/use-cases/regenerate-schema.use-case';
import type { SchemaTable } from '../../domain/entities/schema.entity';

@Controller('schemas')
export class SchemasController {
  constructor(
    private readonly generateSchema: GenerateSchemaUseCase,
    private readonly regenerateSchema: RegenerateSchemaUseCase,
  ) {}

  @Post('generate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async generate(@Body() body: { prompt: string }) {
    if (!body?.prompt?.trim()) {
      throw new BadRequestException('prompt is required');
    }
    return this.generateSchema.execute(body.prompt.trim());
  }

  @Post('regenerate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
  async regenerate(
    @Body()
    body: {
      prompt: string;
      previousSchema: { tables: SchemaTable[] };
      previousSql: string;
      variationLevel?: number;
    },
  ) {
    if (!body?.prompt?.trim()) {
      throw new BadRequestException('prompt is required');
    }
    if (
      !body?.previousSchema?.tables ||
      !Array.isArray(body.previousSchema.tables)
    ) {
      throw new BadRequestException(
        'previousSchema.tables is required and must be an array',
      );
    }
    if (typeof body?.previousSql !== 'string' || !body.previousSql.trim()) {
      throw new BadRequestException('previousSql is required');
    }
    if (
      body.variationLevel !== undefined &&
      (body.variationLevel < 0 || body.variationLevel > 1)
    ) {
      throw new BadRequestException('variationLevel must be between 0 and 1');
    }

    return this.regenerateSchema.execute({
      prompt: body.prompt.trim(),
      previousSchema: body.previousSchema,
      previousSql: body.previousSql.trim(),
      variationLevel: body.variationLevel,
    });
  }
}

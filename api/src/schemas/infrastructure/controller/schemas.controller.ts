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
import { GenerateSchemaUseCase } from '../../application/use-cases/generate-schema.use-case';
import { RegenerateSchemaUseCase } from '../../application/use-cases/regenerate-schema.use-case';
import { GenerateSchemaDto } from '../../application/dtos/generate-schema.dto';
import { RegenerateSchemaDto } from '../../application/dtos/regenerate-schema.dto';
import { SchemaParseError } from '../../domain/errors/schema-parse.error';

@Controller('schemas')
@ApiTags('Schemas')
@ApiBearerAuth('JWT')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@SetMetadata('roles', ['PROFESSOR', 'ADMIN'])
export class SchemasController {
  constructor(
    private readonly generateSchema: GenerateSchemaUseCase,
    private readonly regenerateSchema: RegenerateSchemaUseCase,
  ) {}

  @Post('generate')
  @ApiOperation({
    summary: 'Generar un nuevo schema',
    description: 'Genera una definición de schema SQL a partir de una descripción natural usando IA. Solo PROFESSOR y ADMIN.',
  })
  @ApiBody({ type: GenerateSchemaDto })
  @ApiResponse({
    status: 201,
    description: 'Schema generado correctamente con SQL',
    schema: {
      example: {
        schema: {
          tables: [
            {
              name: 'employees',
              columns: [
                { name: 'id', type: 'int', primary: true, foreign: null },
                { name: 'name', type: 'varchar', primary: false, foreign: null },
              ],
            },
          ],
        },
        sql: 'CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(255));',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Prompt vacío, inválido o error en la generación del schema',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  async generate(@Body() body: GenerateSchemaDto) {
    if (!body?.prompt?.trim()) {
      throw new BadRequestException('prompt is required');
    }
    try {
      return await this.generateSchema.execute(body.prompt.trim());
    } catch (err) {
      if (err instanceof SchemaParseError) throw new BadRequestException(err.message);
      throw err;
    }
  }

  @Post('regenerate')
  @ApiOperation({
    summary: 'Regenerar un schema existente',
    description: 'Regenera un schema a partir de uno anterior con variabilidad controlada. Solo PROFESSOR y ADMIN.',
  })
  @ApiBody({ type: RegenerateSchemaDto })
  @ApiResponse({
    status: 201,
    description: 'Schema regenerado correctamente',
    schema: {
      example: {
        schema: {
          tables: [
            {
              name: 'employees',
              columns: [
                { name: 'id', type: 'int', primary: true, foreign: null },
                { name: 'name', type: 'varchar', primary: false, foreign: null },
              ],
            },
          ],
        },
        sql: 'CREATE TABLE employees (id INT PRIMARY KEY, name VARCHAR(255));',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validación fallida (prompt, previousSchema, previousSql, variationLevel inválidos)',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Rol insuficiente' })
  async regenerate(@Body() body: RegenerateSchemaDto) {
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

    try {
      return await this.regenerateSchema.execute({
        prompt: body.prompt.trim(),
        previousSchema: body.previousSchema,
        previousSql: body.previousSql.trim(),
        variationLevel: body.variationLevel,
      });
    } catch (err) {
      if (err instanceof SchemaParseError) throw new BadRequestException(err.message);
      throw err;
    }
  }
}

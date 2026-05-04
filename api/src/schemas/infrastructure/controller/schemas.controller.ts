import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { GenerateSchemaUseCase } from '../../application/use-cases/generate-schema.use-case';

@Controller('schemas')
export class SchemasController {
  constructor(private readonly generateSchema: GenerateSchemaUseCase) {}

  @Post('generate')
  async generate(@Body() body: { prompt: string }) {
    if (!body?.prompt?.trim()) {
      throw new BadRequestException('prompt is required');
    }
    return this.generateSchema.execute(body.prompt.trim());
  }
}

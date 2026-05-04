import { Injectable, Inject } from '@nestjs/common';
import type { ISchemaGeneratorPort } from '../../domain/ports/schema-generator.port';
import type { GenerateSchemaResponse } from '../../domain/entities/schema.entity';

@Injectable()
export class GenerateSchemaUseCase {
  constructor(
    @Inject('ISchemaGeneratorPort')
    private readonly generator: ISchemaGeneratorPort,
  ) {}

  execute(prompt: string): Promise<GenerateSchemaResponse> {
    return this.generator.generate(prompt);
  }
}

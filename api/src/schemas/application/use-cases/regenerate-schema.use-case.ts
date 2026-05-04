import { Injectable, Inject } from '@nestjs/common';
import type { ISchemaGeneratorPort } from '../../domain/ports/schema-generator.port';
import type {
  GenerateSchemaResponse,
  RegenerateSchemaInput,
} from '../../domain/entities/schema.entity';

@Injectable()
export class RegenerateSchemaUseCase {
  constructor(
    @Inject('ISchemaGeneratorPort')
    private readonly generator: ISchemaGeneratorPort,
  ) {}

  execute(input: RegenerateSchemaInput): Promise<GenerateSchemaResponse> {
    return this.generator.regenerate(input);
  }
}

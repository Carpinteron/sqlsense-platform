import { GenerateSchemaResponse, RegenerateSchemaInput } from '../entities/schema.entity';
export interface ISchemaGeneratorPort {
  generate(description: string): Promise<GenerateSchemaResponse>;
  regenerate(input: RegenerateSchemaInput): Promise<GenerateSchemaResponse>;
}
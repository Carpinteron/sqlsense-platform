import { GenerateSchemaResponse } from '../entities/schema.entity';
export interface ISchemaGeneratorPort {
  generate(description: string): Promise<GenerateSchemaResponse>;
}
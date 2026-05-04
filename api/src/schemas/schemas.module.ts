import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { SchemasController } from './infrastructure/controller/schemas.controller';
import { GenerateSchemaUseCase } from './application/use-cases/generate-schema.use-case';
import { RegenerateSchemaUseCase } from './application/use-cases/regenerate-schema.use-case';
import { AiSchemaAdapter } from './infrastructure/adapters/ai-schema.adapter';
import { AiSchemaResponseMapper } from './infrastructure/mappers/ai-schema-response.mapper';

@Module({
  imports: [AiModule],
  controllers: [SchemasController],
  providers: [
    GenerateSchemaUseCase,
    RegenerateSchemaUseCase,
    AiSchemaResponseMapper,
    {
      provide: 'ISchemaGeneratorPort',
      useClass: AiSchemaAdapter,
    },
  ],
})
export class SchemasModule {}

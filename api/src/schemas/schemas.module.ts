import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { SchemasController } from './infrastructure/controller/schemas.controller';
import { GenerateSchemaUseCase } from './application/use-cases/generate-schema.use-case';
import { AiSchemaAdapter } from './infrastructure/adapters/ai-schema.adapter';

@Module({
  imports: [AiModule],
  controllers: [SchemasController],
  providers: [
    GenerateSchemaUseCase,
    {
      provide: 'ISchemaGeneratorPort',
      useClass: AiSchemaAdapter,
    },
  ],
})
export class SchemasModule {}

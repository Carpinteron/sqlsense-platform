import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { SchemasController } from './infrastructure/controller/schemas.controller';
import { GenerateSchemaUseCase } from './application/use-cases/generate-schema.use-case';

@Module({
  imports: [AiModule],
  controllers: [SchemasController],
  providers: [GenerateSchemaUseCase],
})
export class SchemasModule {}

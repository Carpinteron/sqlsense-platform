import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ExpectedQueryController } from './infrastructure/controller/expected-query.controller';
import { GenerateExpectedQueryUseCase } from './application/use-cases/generate-expected-query.use-case';
import { AiExpectedQueryAdapter } from './infrastructure/adapters/ai-expected-query.adapter';
import { AiExpectedQueryResponseMapper } from './infrastructure/mappers/ai-expected-query-response.mapper';

@Module({
  imports: [AiModule],
  controllers: [ExpectedQueryController],
  providers: [
    GenerateExpectedQueryUseCase,
    AiExpectedQueryResponseMapper,
    {
      provide: 'IExpectedQueryGeneratorPort',
      useClass: AiExpectedQueryAdapter,
    },
  ],
})
export class ExpectedQueryModule {}

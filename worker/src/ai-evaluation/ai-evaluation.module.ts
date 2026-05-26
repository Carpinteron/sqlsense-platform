import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { EvaluateQueryUseCase } from './application/use-cases/evaluate-query.use-case';
import { AiQuerySemanticsAdapter } from './infrastructure/adapters/ai-query-semantics.adapter';
import { QueryParsingAdapter } from './infrastructure/adapters/query-parsing.adapter';
import { AiReviseMetricsAdapter } from './infrastructure/adapters/ai-revise-metrics.adapter';
import { SemanticResponseMapper } from './infrastructure/mappers/semantic-response.mapper';
import { MetricsResponseMapper } from './infrastructure/mappers/metrics-response.mapper';
import { AiEvaluationAdapter } from './infrastructure/ai-evaluation.adapter';

@Module({
  imports: [AiModule],
  providers: [
    EvaluateQueryUseCase,
    SemanticResponseMapper,
    MetricsResponseMapper,
    {
      provide: 'IQuerySemanticsPort',
      useClass: AiQuerySemanticsAdapter,
    },
    {
      provide: 'IQueryParsingPort',
      useClass: QueryParsingAdapter,
    },
    {
      provide: 'IReviseMetricsPort',
      useClass: AiReviseMetricsAdapter,
    },
    AiEvaluationAdapter,
  ],
  exports: [AiEvaluationAdapter],
})
export class AiEvaluationModule {}

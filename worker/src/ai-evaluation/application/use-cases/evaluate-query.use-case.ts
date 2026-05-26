import { Injectable, Inject } from '@nestjs/common';
import type { IQuerySemanticsPort } from '../../domain/repositories/query-semantics.port';
import type { IQueryParsingPort } from '../../domain/repositories/query-parsing.port';
import type { IReviseMetricsPort } from '../../domain/repositories/revise-metrics.port';
import type { EvaluateQueryDto } from '../dtos/evaluate-query.dto';

export interface EvaluationGrade {
  score: number;
  feedback: string;
  requiresOptimization: boolean;
  optimizationOpportunities: string[];
}

@Injectable()
export class EvaluateQueryUseCase {
  constructor(
    @Inject('IQuerySemanticsPort')
    private readonly semantics: IQuerySemanticsPort,
    @Inject('IQueryParsingPort')
    private readonly parsing: IQueryParsingPort,
    @Inject('IReviseMetricsPort')
    private readonly metrics: IReviseMetricsPort,
  ) {}

  async execute(dto: EvaluateQueryDto): Promise<EvaluationGrade> {
    const semanticResult = await this.semantics.analyze(dto.userQuery, dto.expectedQuery);

    let performanceScore = 100;
    let requiresOptimization = false;
    let optimizationOpportunities: string[] = [];
    let metricsFeedback = '';

    if (dto.runnerResult.explainAnalyze) {
      const analysis = this.parsing.parse(
        dto.runnerResult.explainAnalyze,
        dto.runnerResult.executionTimeMs,
      );
      const review = await this.metrics.review(analysis, dto.userQuery, dto.expectedQuery);

      performanceScore = review.performanceScore;
      requiresOptimization = review.severity !== 'low';
      optimizationOpportunities = review.optimizationOpportunities;
      metricsFeedback = review.summary;
    }

    const score = Math.round(semanticResult.grade * 0.6 + performanceScore * 0.4);
    const feedback = metricsFeedback
      ? `${semanticResult.explanation}\n\n${metricsFeedback}`
      : semanticResult.explanation;

    return { score, feedback, requiresOptimization, optimizationOpportunities };
  }
}

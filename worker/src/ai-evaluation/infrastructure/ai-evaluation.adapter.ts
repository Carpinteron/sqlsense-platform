import { Injectable } from '@nestjs/common';
import type { IAIAssistant, EvaluationResult } from '../../evaluation/domain/interfaces/ai-assistant.interface';
import type { RunnerResponse } from '../../evaluation/domain/interfaces/sql-executor.interface';
import { EvaluateQueryUseCase } from '../application/use-cases/evaluate-query.use-case';

@Injectable()
export class AiEvaluationAdapter implements IAIAssistant {
  private _lastOptimizationOpportunities: string[] = [];

  constructor(private readonly evaluateQuery: EvaluateQueryUseCase) {}

  async evaluate(
    userQuery: string,
    expectedQuery: string,
    runnerResult: RunnerResponse,
    schema: string,
  ): Promise<EvaluationResult> {
    const result = await this.evaluateQuery.execute({
      userQuery,
      expectedQuery,
      schema,
      runnerResult: {
        executionTimeMs: runnerResult.executionTimeMs,
        explainAnalyze: runnerResult.explainAnalyze,
      },
    });

    this._lastOptimizationOpportunities = result.optimizationOpportunities;

    return {
      score: result.score,
      feedback: result.feedback,
      requiresOptimization: result.requiresOptimization,
    };
  }

  async getOptimizationTips(_query: string, _executionTimeMs: number): Promise<string> {
    return this._lastOptimizationOpportunities.join('\n');
  }
}

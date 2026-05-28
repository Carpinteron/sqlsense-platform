import type { RunnerResponse } from './sql-executor.interface';

export interface EvaluationResult {
  score: number;
  feedback: string;
  requiresOptimization: boolean;
}

export interface IAIAssistant {
  evaluate(
    userQuery: string,
    expectedQuery: string,
    runnerResult: RunnerResponse,
    schema: string,
  ): Promise<EvaluationResult>;

  getOptimizationTips(
    query: string,
    executionTimeMs: number,
  ): Promise<string>;
}
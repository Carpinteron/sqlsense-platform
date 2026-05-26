export interface EvaluateQueryDto {
  userQuery: string;
  expectedQuery: string;
  runnerResult: {
    executionTimeMs: number;
    explainAnalyze?: string | null;
  };
}

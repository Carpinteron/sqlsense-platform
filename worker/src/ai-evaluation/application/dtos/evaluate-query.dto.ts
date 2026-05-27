export interface EvaluateQueryDto {
  userQuery: string;
  expectedQuery: string;
  schema: string;
  runnerResult: {
    executionTimeMs: number;
    explainAnalyze?: string | object | null;
  };
}

export interface EvaluationResult {
  score: number;      
  feedback: string;  
  requiresOptimization: boolean;
}

export interface IAIAssistant {
  evaluate(
    userQuery: string,
    expectedQuery: any,
  ): Promise<EvaluationResult>;

  getOptimizationTips(
    query: string,
    executionTimeMs: number
  ): Promise<string>;
}
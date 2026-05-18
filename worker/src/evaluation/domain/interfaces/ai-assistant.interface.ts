export interface EvaluationResult {
  score: number;      
  feedback: string;  
  requiresOptimization: boolean;
}

export interface IAIAssistant {
  evaluate(
    query: string,
    expectedResult: any,
    actualResult: any,
    error?: string
  ): Promise<EvaluationResult>;

  getOptimizationTips(
    query: string,
    executionTimeMs: number
  ): Promise<string>;
}
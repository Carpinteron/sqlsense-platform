import type { PerformanceAnalysis } from '../entities/performance-analysis.entity';

export interface IQueryParsingPort {
  parse(explainAnalyze: string | object, executionTimeMs: number): PerformanceAnalysis;
}

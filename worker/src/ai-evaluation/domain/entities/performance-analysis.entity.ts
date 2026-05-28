export interface PerformanceMetrics {
  executionTimeMs: number;
  planningTimeMs: number;
  seqScans: number;
  indexScans: number;
  nestedLoops: number;
  sortOperations: number;
}

export type PerformanceIssue =
  | 'POSSIBLE_MISSING_INDEX'
  | 'EXPENSIVE_NESTED_LOOP'
  | 'EXPENSIVE_SORT';

export interface PerformanceAnalysis {
  performance: PerformanceMetrics;
  issues: PerformanceIssue[];
}

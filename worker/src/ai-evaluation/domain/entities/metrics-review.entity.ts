export type Severity = 'low' | 'medium' | 'high';

export interface MetricsReviewIssue {
  type: string;
  severity: Severity;
  explanation: string;
  recommendation: string;
}

export interface MetricsReview {
  performanceScore: number;
  severity: Severity;
  summary: string;
  issues: MetricsReviewIssue[];
  comparison: {
    fasterThanProfessor: boolean;
    relativePerformance: string;
  };
  optimizationOpportunities: string[];
}

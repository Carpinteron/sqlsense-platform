import type { PerformanceAnalysis } from '../entities/performance-analysis.entity';
import type { MetricsReview } from '../entities/metrics-review.entity';

export interface IReviseMetricsPort {
  review(
    analysis: PerformanceAnalysis,
    userQuery: string,
    expectedQuery: string,
  ): Promise<MetricsReview>;
}

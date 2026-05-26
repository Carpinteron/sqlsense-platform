import { Injectable, Inject } from '@nestjs/common';
import type { IAiGeneratorPort } from '../../../ai/domain/repositories/ai-generator.port';
import type { IReviseMetricsPort } from '../../domain/repositories/revise-metrics.port';
import type { PerformanceAnalysis } from '../../domain/entities/performance-analysis.entity';
import type { MetricsReview } from '../../domain/entities/metrics-review.entity';
import { MetricsResponseMapper } from '../mappers/metrics-response.mapper';

const SYSTEM_PROMPT = `You are a PostgreSQL query performance analyst. Given performance metrics and two SQL queries, provide a detailed performance assessment.

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no backticks, no explanation outside the JSON.

Required structure:
{
  "performanceScore": number between 0 and 100,
  "severity": "low" | "medium" | "high",
  "summary": "string",
  "issues": [
    {
      "type": "string",
      "severity": "low" | "medium" | "high",
      "explanation": "string",
      "recommendation": "string"
    }
  ],
  "comparison": {
    "fasterThanProfessor": boolean,
    "relativePerformance": "string (e.g. '2x faster' or '3x slower')"
  },
  "optimizationOpportunities": ["string"]
}

Rules:
- "performanceScore" of 100 means optimal performance, 0 means very poor
- "severity" summarizes the overall performance concern level
- All text fields must be in Spanish
- Output ONLY the JSON object, nothing else`;

@Injectable()
export class AiReviseMetricsAdapter implements IReviseMetricsPort {
  constructor(
    @Inject('IAiGeneratorPort') private readonly ai: IAiGeneratorPort,
    private readonly mapper: MetricsResponseMapper,
  ) {}

  async review(
    analysis: PerformanceAnalysis,
    userQuery: string,
    expectedQuery: string,
  ): Promise<MetricsReview> {
    const userPrompt = JSON.stringify(
      {
        performance: analysis.performance,
        issues: analysis.issues,
        userQuery,
        expectedQuery,
      },
      null,
      2,
    );
    const raw = await this.ai.complete(SYSTEM_PROMPT, userPrompt);
    return this.mapper.parse(raw);
  }
}

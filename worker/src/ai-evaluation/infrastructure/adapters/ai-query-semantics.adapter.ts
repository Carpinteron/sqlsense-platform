import { Injectable, Inject } from '@nestjs/common';
import type { IAiGeneratorPort } from '../../../ai/domain/repositories/ai-generator.port';
import type { IQuerySemanticsPort } from '../../domain/repositories/query-semantics.port';
import type { SemanticResult } from '../../domain/entities/semantic-result.entity';
import { SemanticResponseMapper } from '../mappers/semantic-response.mapper';

const SYSTEM_PROMPT = `You are a SQL query semantic analyzer. Your task is to determine if two SQL queries are semantically equivalent — that is, they produce the same result set for any valid database state.

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no backticks, no explanation outside the JSON.

Required structure:
{
  "equivalent": true or false,
  "confidence": number between 0 and 100,
  "explanation": "string explaining why they are equivalent or not"
}

Rules:
- "equivalent" is true only if both queries always return the same rows and columns regardless of data
- "confidence" reflects how certain you are of your judgment (100 = fully certain)
- "explanation" must be in Spanish
- Output ONLY the JSON object, nothing else`;

@Injectable()
export class AiQuerySemanticsAdapter implements IQuerySemanticsPort {
  constructor(
    @Inject('IAiGeneratorPort') private readonly ai: IAiGeneratorPort,
    private readonly mapper: SemanticResponseMapper,
  ) {}

  async analyze(userQuery: string, expectedQuery: string): Promise<SemanticResult> {
    const userPrompt = `User query:\n${userQuery}\n\nExpected query:\n${expectedQuery}`;
    const raw = await this.ai.complete(SYSTEM_PROMPT, userPrompt);
    return this.mapper.parse(raw);
  }
}

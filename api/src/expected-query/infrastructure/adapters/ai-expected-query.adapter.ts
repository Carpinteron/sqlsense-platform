import { Injectable, Inject } from '@nestjs/common';
import type { IAiGeneratorPort } from '../../../ai/domain/repositories/ai-generator.port';
import type { IExpectedQueryGeneratorPort } from '../../domain/repositories/expected-query-generator.port';
import type { ExpectedQueryResponse } from '../../domain/entities/expected-query.entity';
import { AiExpectedQueryResponseMapper } from '../mappers/ai-expected-query-response.mapper';

const SYSTEM_PROMPT = `You are a SQL query generator. Given a natural language description and a database schema, generate the expected SQL statement that solves the described task.

CRITICAL: Respond with ONLY the raw SQL. No explanation, no markdown, no backticks, no preamble.

Rules:
- Generate valid PostgreSQL syntax
- Use the provided schema to reference the correct table and column names
- The SQL can be any valid statement: SELECT, INSERT, UPDATE, DELETE, CREATE, etc.
- Output ONLY the SQL, nothing else`;

@Injectable()
export class AiExpectedQueryAdapter implements IExpectedQueryGeneratorPort {
  constructor(
    @Inject('IAiGeneratorPort') private readonly ai: IAiGeneratorPort,
    private readonly mapper: AiExpectedQueryResponseMapper,
  ) {}

  async generate(prompt: string, schema: object): Promise<ExpectedQueryResponse> {
    const userPrompt = `Schema:\n${JSON.stringify(schema, null, 2)}\n\nTask: ${prompt}`;
    const raw = await this.ai.complete(SYSTEM_PROMPT, userPrompt);
    return this.mapper.parse(raw);
  }
}

import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import type { IAiGeneratorPort } from '../../../ai/domain/ports/ai-generator.port';
import type { ISchemaGeneratorPort } from '../../domain/ports/schema-generator.port';
import type {
  GenerateSchemaResponse,
  RegenerateSchemaInput,
} from '../../domain/entities/schema.entity';

const SYSTEM_PROMPT = `You are a database schema generator. Your task is to infer and generate a relational database schema from ANY input — whether it is a natural language description, an SQL challenge, a query problem, or a data scenario.

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no backticks, no explanation, no preamble. Only raw JSON.

IMPORTANT BEHAVIOR RULES:
- If the user provides an SQL query (SELECT, INSERT, UPDATE, etc.), DO NOT execute or answer it — instead, infer the tables and columns needed to support that query and generate the schema.
- If the user describes a challenge or exercise (e.g. "find the top 3 selling products"), infer the database structure required to model that problem.
- NEVER generate query results or data rows.
- NEVER generate DML statements (SELECT, INSERT, UPDATE, DELETE).
- ALWAYS generate only DDL structure (CREATE TABLE statements) and the schema JSON.

Required structure:
{
  "schema": {
    "tables": [
      {
        "name": "table_name",
        "columns": [
          { "name": "id", "type": "int", "primary": true, "foreign": null },
          { "name": "fk_col", "type": "int", "primary": false, "foreign": "other_table.id" }
        ]
      }
    ]
  },
  "sql": "CREATE TABLE table_name (...); ..."
}

Rules:
- Every table must have a primary key (primary: true)
- Foreign keys use "table.column" format; all other columns have "foreign": null
- SQL must be valid PostgreSQL syntax
- Output ONLY the JSON object, nothing else`;

@Injectable()
export class AiSchemaAdapter implements ISchemaGeneratorPort {
  constructor(
    @Inject('IAiGeneratorPort') private readonly ai: IAiGeneratorPort,
  ) {}

  async generate(description: string): Promise<GenerateSchemaResponse> {
    const raw = await this.ai.complete(SYSTEM_PROMPT, description);
    return this.parse(raw);
  }

  async regenerate(input: RegenerateSchemaInput): Promise<GenerateSchemaResponse> {
    const userPrompt = this.buildRegeneratePrompt(input);
    const raw = await this.ai.complete(SYSTEM_PROMPT, userPrompt);
    return this.parse(raw);
  }

  private buildRegeneratePrompt(input: RegenerateSchemaInput): string {
    const level = input.variationLevel ?? 0.5;
    const variationInstruction =
      level < 0.33
        ? 'Make only minor adjustments — fix data types, add missing constraints, rename columns for clarity. Preserve the overall structure.'
        : level < 0.67
          ? 'Redesign the schema with moderate changes — restructure some tables, reconsider relationships, split or merge entities where appropriate.'
          : 'Design an entirely different schema — use a completely different approach, different normalization level, different tables, or a different data modeling strategy.';

    return `The user rejected the following schema for this description: "${input.prompt}"

PREVIOUS SCHEMA (rejected):
${JSON.stringify(input.previousSchema, null, 2)}

PREVIOUS SQL (rejected):
${input.previousSql}

Variation instruction: ${variationInstruction}

Generate a NEW schema for the same description. Do NOT repeat the same design.`;
  }

  private parse(raw: string): GenerateSchemaResponse {
    let cleaned = raw.trim();

    const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) {
      cleaned = codeBlock[1].trim();
    }

    if (!cleaned.startsWith('{')) {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        cleaned = cleaned.slice(start, end + 1);
      }
    }

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new BadRequestException(
        'The AI returned an invalid JSON response. Please try again.',
      );
    }

    if (
      !parsed.schema?.tables ||
      !Array.isArray(parsed.schema.tables) ||
      typeof parsed.sql !== 'string'
    ) {
      throw new BadRequestException(
        'AI response does not match the expected schema format.',
      );
    }

    return parsed as GenerateSchemaResponse;
  }
}

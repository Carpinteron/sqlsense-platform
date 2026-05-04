import { Injectable, BadRequestException } from '@nestjs/common';
import { AiService } from '../../../ai/ai.service';
import type { GenerateSchemaResponse } from '../../domain/entities/schema.entity';

const SYSTEM_PROMPT = `You are a database schema designer. Your task is to generate a relational database schema from a natural language description.

CRITICAL: Respond with ONLY a valid JSON object. No markdown, no backticks, no explanation, no preamble. Only raw JSON.

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
export class GenerateSchemaUseCase {
  constructor(private readonly aiService: AiService) {}

  async execute(prompt: string): Promise<GenerateSchemaResponse> {
    const raw = await this.aiService.complete(SYSTEM_PROMPT, prompt);
    return this.parse(raw);
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

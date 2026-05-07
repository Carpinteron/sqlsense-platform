import { Injectable } from '@nestjs/common';
import type { GenerateSchemaResponse } from '../../domain/entities/schema.entity';
import { SchemaParseError } from '../../domain/errors/schema-parse.error';

@Injectable()
export class AiSchemaResponseMapper {
  parse(raw: string): GenerateSchemaResponse {
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
      throw new SchemaParseError(
        'The AI returned an invalid JSON response. Please try again.',
      );
    }

    if (
      !parsed.schema?.tables ||
      !Array.isArray(parsed.schema.tables) ||
      typeof parsed.sql !== 'string'
    ) {
      throw new SchemaParseError(
        'AI response does not match the expected schema format.',
      );
    }

    return parsed as GenerateSchemaResponse;
  }
}
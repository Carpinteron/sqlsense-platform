import { Injectable } from '@nestjs/common';
import type { AiMockDataRaw } from '../../domain/entities/mock-data.entity';
import { MockDataParseError } from '../../domain/errors/mock-data-parse.error';

@Injectable()
export class AiMockDataResponseMapper {
  parse(raw: string): AiMockDataRaw {
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
      throw new MockDataParseError(
        'The AI returned an invalid JSON response. Please try again.',
      );
    }

    if (typeof parsed.table !== 'string' || !Array.isArray(parsed.data)) {
      throw new MockDataParseError(
        'AI response does not match the expected mock data format.',
      );
    }

    return parsed as AiMockDataRaw;
  }
}

import { Injectable } from '@nestjs/common';
import type { SemanticResult } from '../../domain/entities/semantic-result.entity';
import { SemanticParseError } from '../../domain/errors/semantic-parse.error';

interface RawSemanticResponse {
  equivalent: boolean;
  confidence: number;
  explanation: string;
}

@Injectable()
export class SemanticResponseMapper {
  parse(raw: string): SemanticResult {
    let cleaned = raw.trim();

    const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) cleaned = codeBlock[1].trim();

    if (!cleaned.startsWith('{')) {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
    }

    let parsed: RawSemanticResponse;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new SemanticParseError('La IA devolvió un JSON inválido en la evaluación semántica.');
    }

    if (
      typeof parsed.equivalent !== 'boolean' ||
      typeof parsed.confidence !== 'number' ||
      typeof parsed.explanation !== 'string'
    ) {
      throw new SemanticParseError('La respuesta de la IA no tiene el formato semántico esperado.');
    }

    const grade = parsed.equivalent ? parsed.confidence : 100 - parsed.confidence;

    return {
      grade: Math.max(0, Math.min(100, grade)),
      explanation: parsed.explanation,
    };
  }
}

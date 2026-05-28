import { Injectable } from '@nestjs/common';
import type { MetricsReview } from '../../domain/entities/metrics-review.entity';
import { MetricsParseError } from '../../domain/errors/metrics-parse.error';

@Injectable()
export class MetricsResponseMapper {
  parse(raw: string): MetricsReview {
    let cleaned = raw.trim();

    const codeBlock = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlock) cleaned = codeBlock[1].trim();

    if (!cleaned.startsWith('{')) {
      const start = cleaned.indexOf('{');
      const end = cleaned.lastIndexOf('}');
      if (start !== -1 && end !== -1) cleaned = cleaned.slice(start, end + 1);
    }

    let parsed: MetricsReview;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      throw new MetricsParseError('La IA devolvió un JSON inválido en la revisión de métricas.');
    }

    if (
      typeof parsed.performanceScore !== 'number' ||
      !['low', 'medium', 'high'].includes(parsed.severity) ||
      !Array.isArray(parsed.issues) ||
      !Array.isArray(parsed.optimizationOpportunities)
    ) {
      throw new MetricsParseError('La respuesta de la IA no tiene el formato de métricas esperado.');
    }

    return parsed;
  }
}

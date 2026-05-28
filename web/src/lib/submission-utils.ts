import type { Submission, SubmissionStatus } from '@/types/domain';

export const SUBMISSION_STATUS_CONFIG: Record<
  SubmissionStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  QUEUED: {
    label: 'En cola',
    color: 'text-slate-400',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/30',
  },
  RUNNING: {
    label: 'Ejecutando',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
  },
  ACCEPTED: {
    label: 'Aceptada',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
  },
  WRONG_ANSWER: {
    label: 'Respuesta incorrecta',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
  },
  SYNTAX_ERROR: {
    label: 'Error de sintaxis',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
  },
  TIME_LIMIT_EXCEEDED: {
    label: 'Tiempo excedido',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
  },
  RUNTIME_ERROR: {
    label: 'Error en ejecución',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
  },
  OPTIMIZATION_REQUIRED: {
    label: 'Optimización sugerida',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
  },
};

export function parseSubmissionResult(result: unknown): {
  rows: Record<string, unknown>[];
  columns: string[];
} {
  if (!result) return { rows: [], columns: [] };

  if (Array.isArray(result)) {
    const rows = result as Record<string, unknown>[];
    const columns = rows[0] ? Object.keys(rows[0]) : [];
    return { rows, columns };
  }

  if (typeof result === 'object' && result !== null) {
    const obj = result as Record<string, unknown>;
    if (Array.isArray(obj.rows)) {
      const rows = obj.rows as Record<string, unknown>[];
      return { rows, columns: rows[0] ? Object.keys(rows[0]) : [] };
    }
    if (Array.isArray(obj.data)) {
      const rows = obj.data as Record<string, unknown>[];
      return { rows, columns: rows[0] ? Object.keys(rows[0]) : [] };
    }
  }

  return { rows: [], columns: [] };
}

export interface AiRecommendationInsight {
  summary: string;
  optimizations: string[];
  indexes: string[];
  rewrittenSql: string | null;
  warnings: string[];
  performanceNotes: string[];
  originalQuery: string;
}

/** Parse worker/API feedback into structured AI-style sections */
export function parseFeedbackToInsights(
  submission: Submission,
): AiRecommendationInsight {
  const feedback = submission.feedback ?? '';
  const sections = feedback.split(/\n\n+/);
  const optimizations: string[] = [];
  const indexes: string[] = [];
  const warnings: string[] = [];
  const performanceNotes: string[] = [];
  let rewrittenSql: string | null = null;

  for (const block of sections) {
    const lower = block.toLowerCase();
    if (lower.includes('índice') || lower.includes('index')) {
      indexes.push(...block.split('\n').filter((l) => l.trim()));
    } else if (lower.includes('select') && block.includes('FROM')) {
      rewrittenSql = block.trim();
    } else if (lower.includes('warning') || lower.includes('advertencia')) {
      warnings.push(block);
    } else if (lower.includes('ms') || lower.includes('performance') || lower.includes('rendimiento')) {
      performanceNotes.push(block);
    } else if (block.trim()) {
      optimizations.push(block);
    }
  }

  if (!optimizations.length && feedback) {
    optimizations.push(feedback);
  }

  return {
    summary:
      submission.status === 'ACCEPTED'
        ? 'Tu solución fue aceptada. Revisa posibles mejoras de rendimiento.'
        : submission.status === 'OPTIMIZATION_REQUIRED'
          ? 'Solución correcta con oportunidades de optimización.'
          : 'Análisis de tu última entrega.',
    optimizations,
    indexes,
    rewrittenSql,
    warnings,
    performanceNotes,
    originalQuery: submission.query,
  };
}

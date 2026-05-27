import type { Evaluation } from '@/types/domain';

const STORAGE_KEY = 'sqlsense_evaluations';

function readAll(): Evaluation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Evaluation[]) : [];
  } catch {
    return [];
  }
}

function writeAll(evaluations: Evaluation[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(evaluations));
}

export type CreateEvaluationPayload = Omit<Evaluation, 'id' | 'createdAt'>;

/** Client-side persistence until REST evaluations module exists */
export const evaluationsService = {
  async getAll(): Promise<Evaluation[]> {
    return readAll();
  },

  async getByCourse(courseId: string): Promise<Evaluation[]> {
    return readAll().filter((e) => e.courseId === courseId);
  },

  async create(payload: CreateEvaluationPayload): Promise<Evaluation> {
    const evaluation: Evaluation = {
      ...payload,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const all = readAll();
    writeAll([evaluation, ...all]);
    return evaluation;
  },

  async update(id: string, payload: Partial<CreateEvaluationPayload>): Promise<Evaluation> {
    const all = readAll();
    const index = all.findIndex((e) => e.id === id);
    if (index === -1) throw new Error('Evaluación no encontrada');
    all[index] = { ...all[index], ...payload };
    writeAll(all);
    return all[index];
  },

  async delete(id: string): Promise<void> {
    writeAll(readAll().filter((e) => e.id !== id));
  },
};

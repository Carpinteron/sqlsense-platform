import { apiClient } from '@/lib/axios';
import type { Evaluation } from '@/types/domain';

export type CreateEvaluationPayload = Omit<Evaluation, 'id' | 'createdAt'>;

export const evaluationsService = {
  async getAll(): Promise<Evaluation[]> {
    const { data } = await apiClient.get<Evaluation[]>('/evaluations');
    return data;
  },

  async getByCourse(courseId: string): Promise<Evaluation[]> {
    const { data } = await apiClient.get<Evaluation[]>(`/evaluations/course/${courseId}`);
    return data;
  },

  async create(payload: CreateEvaluationPayload): Promise<Evaluation> {
    const { data } = await apiClient.post<Evaluation>('/evaluations', payload);
    return data;
  },

  async update(id: string, payload: Partial<CreateEvaluationPayload>): Promise<Evaluation> {
    const { data } = await apiClient.put<Evaluation>(`/evaluations/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/evaluations/${id}`);
  },
};

import { apiClient } from '@/lib/axios';
import type { ChallengeDifficulty, ChallengeStatus, Reto } from '@/types/domain';

export interface CreateRetoPayload {
  title: string;
  description: string;
  difficulty?: ChallengeDifficulty;
  tags?: string[];
  databaseEngine?: string;
  timeLimit?: number;
  status?: ChallengeStatus;
  courseId?: string;
  schemaSql?: string;
  seedDataSql?: string;
  expectedResult?: string | null;
}

export type UpdateRetoPayload = Partial<CreateRetoPayload>;

export const retosService = {
  async getAll(): Promise<Reto[]> {
    const { data } = await apiClient.get<Reto[]>('/challenges');
    return data;
  },

  async getById(id: string): Promise<Reto> {
    const { data } = await apiClient.get<Reto>(`/challenges/${id}`);
    return data;
  },

  async getByTitle(title: string): Promise<Reto> {
    const { data } = await apiClient.get<Reto>(`/challenges/title/${encodeURIComponent(title)}`);
    return data;
  },

  async create(payload: CreateRetoPayload): Promise<Reto> {
    const { data } = await apiClient.post<Reto>('/challenges', payload);
    return data;
  },

  async update(id: string, payload: UpdateRetoPayload): Promise<Reto> {
    const { data } = await apiClient.put<Reto>(`/challenges/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/challenges/${id}`);
  },
};

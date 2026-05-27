import { apiClient } from '@/lib/axios';
import type { FieldSpec, MockDataJob } from '@/types/domain';

export interface GenerateMockDataPayload {
  table: string;
  rows: number;
  fields: Record<string, FieldSpec>;
}

export const mockDataService = {
  async generate(payload: GenerateMockDataPayload): Promise<{ jobId: string }> {
    const { data } = await apiClient.post<{ jobId: string }>('/mock-data/generate', payload);
    return data;
  },

  async getJobStatus(jobId: string): Promise<MockDataJob> {
    const { data } = await apiClient.get<MockDataJob>(`/mock-data/jobs/${jobId}`);
    return data;
  },
};

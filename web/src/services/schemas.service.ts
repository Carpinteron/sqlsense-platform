import { apiClient } from '@/lib/axios';
import type { GeneratedSchema, SchemaTable } from '@/types/domain';

export const schemasService = {
  async generate(prompt: string): Promise<GeneratedSchema> {
    const { data } = await apiClient.post<GeneratedSchema>('/schemas/generate', { prompt });
    return data;
  },

  async regenerate(payload: {
    prompt: string;
    previousSchema: { tables: SchemaTable[] };
    previousSql: string;
    variationLevel?: number;
  }): Promise<GeneratedSchema> {
    const { data } = await apiClient.post<GeneratedSchema>('/schemas/regenerate', payload);
    return data;
  },
};

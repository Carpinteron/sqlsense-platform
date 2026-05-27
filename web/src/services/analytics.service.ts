import { apiClient } from '@/lib/axios';
import type { AdminAnalyticsSummary } from '@/types/domain';

export const analyticsService = {
  async getAdminSummary(): Promise<AdminAnalyticsSummary> {
    const { data } = await apiClient.get<AdminAnalyticsSummary>('/analytics/admin-summary');
    return data;
  },
};
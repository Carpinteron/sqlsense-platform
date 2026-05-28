import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics.service';

export const ANALYTICS_QUERY_KEYS = {
  adminSummary: ['analytics', 'admin-summary'] as const,
};

export function useAdminAnalytics(enabled = true) {
  return useQuery({
    queryKey: ANALYTICS_QUERY_KEYS.adminSummary,
    queryFn: () => analyticsService.getAdminSummary(),
    enabled,
  });
}
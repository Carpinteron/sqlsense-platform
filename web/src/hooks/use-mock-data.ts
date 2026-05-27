import { useMutation, useQuery } from '@tanstack/react-query';
import { mockDataService, GenerateMockDataPayload } from '@/services/mock-data.service';
import { toast } from 'sonner';

export const MOCK_DATA_KEYS = {
  job: (jobId: string) => ['mock-data', 'job', jobId] as const,
};

export function useGenerateMockData() {
  return useMutation({
    mutationFn: (payload: GenerateMockDataPayload) => mockDataService.generate(payload),
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al generar datos');
    },
  });
}

export function useMockDataJob(jobId: string | null, enabled = false) {
  return useQuery({
    queryKey: MOCK_DATA_KEYS.job(jobId ?? ''),
    queryFn: () => mockDataService.getJobStatus(jobId!),
    enabled: !!jobId && enabled,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (!status || status === 'completed' || status === 'failed') return false;
      return 2000;
    },
  });
}

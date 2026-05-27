import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  evaluationsService,
  CreateEvaluationPayload,
} from '@/services/evaluations.service';
import { toast } from 'sonner';

export const EVALUATION_QUERY_KEYS = {
  all: ['evaluations'] as const,
  byCourse: (courseId: string) => ['evaluations', 'course', courseId] as const,
};

export function useEvaluations() {
  return useQuery({
    queryKey: EVALUATION_QUERY_KEYS.all,
    queryFn: () => evaluationsService.getAll(),
  });
}

export function useEvaluationsByCourse(courseId: string, enabled = true) {
  return useQuery({
    queryKey: EVALUATION_QUERY_KEYS.byCourse(courseId),
    queryFn: () => evaluationsService.getByCourse(courseId),
    enabled: !!courseId && enabled,
  });
}

export function useCreateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateEvaluationPayload) => evaluationsService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EVALUATION_QUERY_KEYS.all });
      toast.success('Evaluación creada');
    },
    onError: () => toast.error('Error al crear evaluación'),
  });
}

export function useUpdateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateEvaluationPayload> }) =>
      evaluationsService.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EVALUATION_QUERY_KEYS.all });
      toast.success('Evaluación actualizada');
    },
    onError: () => toast.error('Error al actualizar evaluación'),
  });
}

export function useDeleteEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => evaluationsService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EVALUATION_QUERY_KEYS.all });
      toast.success('Evaluación eliminada');
    },
    onError: () => toast.error('Error al eliminar evaluación'),
  });
}

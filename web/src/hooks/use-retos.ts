import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { retosService, CreateRetoPayload, UpdateRetoPayload } from '@/services/retos.service';
import { toast } from 'sonner';

export const RETO_QUERY_KEYS = {
  all: ['retos'] as const,
  detail: (id: string) => ['retos', id] as const,
};

export function useRetos() {
  return useQuery({
    queryKey: RETO_QUERY_KEYS.all,
    queryFn: () => retosService.getAll(),
  });
}

export function useReto(id: string, enabled = true) {
  return useQuery({
    queryKey: RETO_QUERY_KEYS.detail(id),
    queryFn: () => retosService.getById(id),
    enabled: !!id && enabled,
  });
}

export function useCreateReto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRetoPayload) => retosService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RETO_QUERY_KEYS.all });
      toast.success('Reto creado exitosamente');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al crear el reto');
    },
  });
}

export function useUpdateReto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRetoPayload }) =>
      retosService.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: RETO_QUERY_KEYS.all });
      qc.invalidateQueries({ queryKey: RETO_QUERY_KEYS.detail(id) });
      toast.success('Reto actualizado');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el reto');
    },
  });
}

export function useDeleteReto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => retosService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: RETO_QUERY_KEYS.all });
      toast.success('Reto eliminado');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el reto');
    },
  });
}

import { useMutation } from '@tanstack/react-query';
import { schemasService } from '@/services/schemas.service';
import type { SchemaTable } from '@/types/domain';
import { toast } from 'sonner';

export function useGenerateSchema() {
  return useMutation({
    mutationFn: (prompt: string) => schemasService.generate(prompt),
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al generar esquema');
    },
  });
}

export function useRegenerateSchema() {
  return useMutation({
    mutationFn: (payload: {
      prompt: string;
      previousSchema: { tables: SchemaTable[] };
      previousSql: string;
      variationLevel?: number;
    }) => schemasService.regenerate(payload),
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al regenerar esquema');
    },
  });
}

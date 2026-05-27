import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersService, CreateUserPayload, UpdateUserPayload, UserRole } from '@/services/users.service';
import { toast } from 'sonner';

export const USER_QUERY_KEYS = {
  all: ['users'] as const,
  byId: (id: number) => ['users', id] as const,
};

export function useUsers(enabled = true) {
  return useQuery({
    queryKey: USER_QUERY_KEYS.all,
    queryFn: () => usersService.getAll(),
    enabled,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      toast.success('Usuario creado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al crear el usuario');
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      usersService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      toast.success('Usuario actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el usuario');
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      toast.success('Usuario eliminado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el usuario');
    },
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) =>
      usersService.changeRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEYS.all });
      toast.success('Rol actualizado exitosamente');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Error al cambiar el rol');
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cursosService,
  CreateCursoPayload,
  UpdateCursoPayload,
} from '@/services/cursos.service';
import { toast } from 'sonner';

export const CURSO_QUERY_KEYS = {
  all: ['cursos'] as const,
  detail: (id: string) => ['cursos', id] as const,
  students: (id: string) => ['cursos', id, 'students'] as const,
  byStudent: (studentId: number) => ['cursos', 'student', studentId] as const,
};

export function useCursos() {
  return useQuery({
    queryKey: CURSO_QUERY_KEYS.all,
    queryFn: () => cursosService.getAll(),
  });
}

export function useCurso(id: string, enabled = true) {
  return useQuery({
    queryKey: CURSO_QUERY_KEYS.detail(id),
    queryFn: () => cursosService.getById(id),
    enabled: !!id && enabled,
  });
}

export function useCourseStudents(courseId: string, enabled = true) {
  return useQuery({
    queryKey: CURSO_QUERY_KEYS.students(courseId),
    queryFn: () => cursosService.getStudents(courseId),
    enabled: !!courseId && enabled,
  });
}

export function useStudentCursos(studentId: number, enabled = true) {
  return useQuery({
    queryKey: CURSO_QUERY_KEYS.byStudent(studentId),
    queryFn: () => cursosService.getByStudent(studentId),
    enabled: studentId > 0 && enabled,
  });
}

export function useCreateCurso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCursoPayload) => cursosService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CURSO_QUERY_KEYS.all });
      toast.success('Curso creado exitosamente');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al crear el curso');
    },
  });
}

export function useUpdateCurso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCursoPayload }) =>
      cursosService.update(id, payload),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: CURSO_QUERY_KEYS.all });
      qc.invalidateQueries({ queryKey: CURSO_QUERY_KEYS.detail(id) });
      toast.success('Curso actualizado');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al actualizar el curso');
    },
  });
}

export function useDeleteCurso() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cursosService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CURSO_QUERY_KEYS.all });
      toast.success('Curso eliminado');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al eliminar el curso');
    },
  });
}

export function useEnrollStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, studentId }: { courseId: string; studentId: number }) =>
      cursosService.enrollStudent(courseId, studentId),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: CURSO_QUERY_KEYS.students(courseId) });
      toast.success('Estudiante inscrito');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al inscribir estudiante');
    },
  });
}

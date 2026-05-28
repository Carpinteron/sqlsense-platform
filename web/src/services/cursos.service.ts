import { apiClient } from '@/lib/axios';
import type { Curso } from '@/types/domain';
import type { User } from '@/services/users.service';

export interface CreateCursoPayload {
  name: string;
  code: string;
  period: string;
  groupNumber?: string;
}

export interface UpdateCursoPayload {
  name?: string;
  code?: string;
  period?: string;
  groupNumber?: string;
}

export const cursosService = {
  async getAll(): Promise<Curso[]> {
    const { data } = await apiClient.get<Curso[]>('/cursos');
    return data;
  },

  async getById(id: string): Promise<Curso> {
    const { data } = await apiClient.get<Curso>(`/cursos/${id}`);
    return data;
  },

  async getStudents(id: string): Promise<User[]> {
    const { data } = await apiClient.get<User[]>(`/cursos/${id}/students`);
    return data;
  },

  async getByStudent(studentId: number): Promise<Curso[]> {
    const { data } = await apiClient.get<Curso[]>(`/cursos/estudiantes/${studentId}`);
    return data;
  },

  async create(payload: CreateCursoPayload): Promise<Curso> {
    const { data } = await apiClient.post<Curso>('/cursos', payload);
    return data;
  },

  async update(id: string, payload: UpdateCursoPayload): Promise<Curso> {
    const { data } = await apiClient.put<Curso>(`/cursos/${id}`, payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/cursos/${id}`);
  },

  async enrollStudent(courseId: string, studentId: number): Promise<void> {
    await apiClient.post(`/cursos/${courseId}/student`, { studentId });
  },
};

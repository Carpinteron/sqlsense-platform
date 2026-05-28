import { apiClient } from '@/lib/axios';

export type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string | null;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserPayload {
  email?: string;
  password?: string;
}

export const usersService = {
  async getAll(): Promise<User[]> {
    const { data } = await apiClient.get<User[]>('/users');
    return data;
  },

  async getById(id: number): Promise<User> {
    const { data } = await apiClient.get<User>(`/users/${id}`);
    return data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const { data } = await apiClient.post<User>('/users', payload);
    return data;
  },

  async update(id: number, payload: UpdateUserPayload): Promise<User> {
    const { data } = await apiClient.put<User>(`/users/${id}`, payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async changeRole(id: number, role: UserRole): Promise<User> {
    const { data } = await apiClient.patch<User>(`/users/${id}/role`, { role });
    return data;
  },
};

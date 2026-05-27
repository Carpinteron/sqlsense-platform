import { apiClient } from '@/lib/axios';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'PROFESSOR' | 'STUDENT';
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthProfile {
  message: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register uses the POST /users endpoint (public, no auth required).
   * The backend CreateUserDto accepts { email, password, role }.
   * Note: /auth/register does NOT exist in the backend.
   */
  async register(data: RegisterRequest): Promise<any> {
    const response = await apiClient.post('/users', data);
    return response.data;
  },

  async refresh(refreshToken: string): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async getProfile(): Promise<AuthProfile> {
    const response = await apiClient.get<AuthProfile>('/auth/profile');
    return response.data;
  },
};

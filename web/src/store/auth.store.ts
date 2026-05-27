import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { authService, LoginRequest } from '@/services/auth.service';

interface JwtPayload {
  sub: number;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

interface AuthUser {
  id: number;
  email: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (access: string, refresh: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginRequest) => {
        try {
          set({ isLoading: true, error: null });
          const tokens = await authService.login(credentials);
          
          const decoded = jwtDecode<JwtPayload>(tokens.access_token);
          const user: AuthUser = {
            id: decoded.sub,
            email: decoded.email,
            role: decoded.role,
          };

          set({
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Error al iniciar sesión',
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          const { accessToken } = get();
          if (accessToken) {
            await authService.logout();
          }
        } catch (error) {
          console.error('Logout API failed:', error);
        } finally {
          get().clearAuth();
        }
      },

      setTokens: (access: string, refresh: string) => {
        const decoded = jwtDecode<JwtPayload>(access);
        const user: AuthUser = {
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
        };
        
        set({
          accessToken: access,
          refreshToken: refresh,
          user,
          isAuthenticated: true,
        });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      // Solo guardamos tokens en localStorage, el user se decodifica o se obtiene
    }
  )
);

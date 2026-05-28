// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string | null;
}

// ─── API Helpers ─────────────────────────────────────────────────────────────

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: UserRole[];
};

// ─── Dashboard ───────────────────────────────────────────────────────────────

export interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  trend?: { value: number; positive: boolean };
  icon: React.ElementType;
}

import type { AuthPayload } from '../entities/auth-payload.entity';

export interface IUserAuthRepository {
  validateCredentials(email: string, pass: string): Promise<AuthPayload | null>;
}
import type { User } from '../entities/user.entity';

export interface IUserManagementRepository {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(email: string, hashedPassword: string, role?: string): Promise<User>;
  update(id: number, email?: string, hashedPassword?: string): Promise<User | null>;
  delete(id: number): Promise<boolean>;
  changeRole(id: number, newRole: string): Promise<User | null>;
}

import type { UserRole } from '../../domain/entities/user.entity';

export class UserResponseDto {
  id: number;
  email: string;
  role: UserRole;
  createdAt: Date | null;

  constructor(id: number, email: string, role: UserRole, createdAt: Date | null) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }
}

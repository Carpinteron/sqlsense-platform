import type { UserRole } from '../../domain/entities/user.entity';

export class ChangeUserRoleDto {
  role: UserRole;

  constructor(role: UserRole) {
    this.role = role;
  }
}
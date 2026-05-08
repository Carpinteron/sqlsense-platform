import { IsIn } from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

export class ChangeUserRoleDto {
  @IsIn(['ADMIN', 'PROFESSOR', 'STUDENT'])
  role!: UserRole;
}
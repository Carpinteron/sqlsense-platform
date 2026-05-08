import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

export class ChangeUserRoleDto {
  @ApiProperty({ enum: ['ADMIN', 'PROFESSOR', 'STUDENT'], example: 'PROFESSOR' })
  @IsIn(['ADMIN', 'PROFESSOR', 'STUDENT'])
  role!: UserRole;
}
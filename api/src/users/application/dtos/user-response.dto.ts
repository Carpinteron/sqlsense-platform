import { ApiProperty } from '@nestjs/swagger';
import type { UserRole } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'admin@sqlsense.com' })
  email!: string;

  @ApiProperty({ enum: ['ADMIN', 'PROFESSOR', 'STUDENT'], example: 'ADMIN' })
  role!: UserRole;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z', nullable: true })
  createdAt!: Date | null;

  constructor(id: number, email: string, role: UserRole, createdAt: Date | null) {
    this.id = id;
    this.email = email;
    this.role = role;
    this.createdAt = createdAt;
  }
}

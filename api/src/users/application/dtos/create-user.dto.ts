import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import type { UserRole } from '../../domain/entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'nuevo@sqlsense.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiPropertyOptional({
    enum: ['ADMIN', 'PROFESSOR', 'STUDENT'],
    example: 'STUDENT',
    description: 'Por defecto STUDENT si se omite',
  })
  @IsOptional()
  @IsIn(['ADMIN', 'PROFESSOR', 'STUDENT'])
  role?: UserRole;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@sqlsense.com', description: 'Email del usuario' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    minLength: 6,
    description: 'Contraseña (mínimo 6 caracteres)',
  })
  @IsString()
  @MinLength(6)
  password!: string;
}

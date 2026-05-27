import { IsUUID, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubmissionDto {
  @IsUUID('4', { message: 'El challengeId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'ID del reto (UUID v4) a evaluar' })
  challengeId: string;

  @IsString()
  @IsNotEmpty({ message: 'La consulta SQL no puede estar vacía.' })
  @ApiProperty({ example: 'SELECT * FROM users WHERE id = 1;', description: 'Consulta SQL que se enviará al evaluador' })
  query: string;
}
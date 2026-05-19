import { IsUUID, IsString, IsNotEmpty } from 'class-validator';

export class CreateSubmissionDto {
  @IsUUID('4', { message: 'El challengeId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  challengeId: string;

  @IsString()
  @IsNotEmpty({ message: 'La consulta SQL no puede estar vacía.' })
  query: string;
}
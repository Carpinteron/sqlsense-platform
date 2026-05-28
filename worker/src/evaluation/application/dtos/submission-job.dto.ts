import { IsUUID, IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class EvaluateSubmissionJobDto {
  @Expose()
  @IsUUID('4', { message: 'El submissionId debe ser un UUID v4 válido.' })
  @IsNotEmpty({ message: 'El submissionId no puede estar vacío.' })
  submissionId: string;
}
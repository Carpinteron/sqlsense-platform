import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SubmissionCreatedResponseDto {
  @ApiProperty({ example: 'd9f1c2a0-4c3b-4a2a-ae9b-1a2b3c4d5e6f' })
  id: string;

  @ApiProperty({ example: 'QUEUED', description: 'Estado inicial del envío: QUEUED | RUNNING | ACCEPTED | WRONG_ANSWER | ...' })
  status: string;

  @ApiProperty({ example: 'Enviado correctamente' })
  message: string;

  @ApiPropertyOptional({ example: 123, description: 'Tiempo de ejecución en ms (cuando esté disponible)' })
  executionTimeMs?: number;

  @ApiPropertyOptional({ description: 'Resultado tabular o estructura devuelta por el evaluador cuando aplica' })
  result?: unknown;
}
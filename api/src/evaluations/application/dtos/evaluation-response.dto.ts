import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EvaluationResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string;

  @ApiProperty({ example: 'Parcial SQL 1' })
  title!: string;

  @ApiPropertyOptional({ example: 'Evaluación de práctica sobre joins y agregaciones.' })
  description?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  courseId!: string;

  @ApiProperty({ type: [String], example: ['550e8400-e29b-41d4-a716-446655440001'] })
  challengeIds!: string[];

  @ApiPropertyOptional({ example: '2026-06-01T08:00:00.000Z' })
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-06-10T23:59:59.000Z' })
  endDate?: string;

  @ApiPropertyOptional({ example: 60 })
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 3 })
  maxAttempts?: number;

  @ApiPropertyOptional({ enum: ['immediate', 'after_deadline', 'manual'], example: 'after_deadline' })
  resultsVisibility?: 'immediate' | 'after_deadline' | 'manual';

  @ApiPropertyOptional({ example: '2026-05-27T00:00:00.000Z' })
  createdAt?: string;
}
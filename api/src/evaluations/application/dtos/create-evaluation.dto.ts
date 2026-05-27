import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateEvaluationDto {
  @ApiProperty({ example: 'Parcial SQL 1' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'Evaluación de práctica sobre joins y agregaciones.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  courseId!: string;

  @ApiProperty({ type: [String], example: ['550e8400-e29b-41d4-a716-446655440001'] })
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  challengeIds!: string[];

  @ApiPropertyOptional({ example: '2026-06-01T08:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-06-10T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMinutes?: number;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxAttempts?: number;

  @ApiPropertyOptional({ enum: ['immediate', 'after_deadline', 'manual'], example: 'after_deadline' })
  @IsOptional()
  @IsIn(['immediate', 'after_deadline', 'manual'])
  resultsVisibility?: 'immediate' | 'after_deadline' | 'manual';
}
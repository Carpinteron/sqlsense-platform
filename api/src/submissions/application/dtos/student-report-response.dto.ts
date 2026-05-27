import { IsUUID, IsString, IsNotEmpty, IsNumber, IsDateString, IsInt, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ChallengeGradeDto {
  @IsUUID('4', { message: 'El challengeId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  challengeId: string;

  @IsUUID('4', { message: 'El submissionId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  @ApiProperty({ example: 'd9f1c2a0-4c3b-4a2a-ae9b-1a2b3c4d5e6f' })
  submissionId: string;

  @IsNumber({}, { message: 'El score debe ser un número.' })
  @ApiProperty({ example: 4 })
  score: number;

  @IsString({ message: 'El status debe ser una cadena de texto.' })
  @ApiProperty({ example: 'ACCEPTED' })
  status: string;

  @IsString({ message: 'El feedback debe ser una cadena de texto.' })
  @ApiPropertyOptional({ example: 'Buen uso de índices, revisar JOINs' })
  feedback: string;

  @IsDateString()
  @ApiPropertyOptional({ example: '2026-05-27T12:34:56.000Z' })
  submittedAt: Date | string | null;
}

export class StudentReportResponseDto {
  @IsInt({ message: 'El studentId debe ser un número entero.' })
  @IsNotEmpty()
  @ApiProperty({ example: 1 })
  studentId: number;

  @IsDateString()
  @ApiProperty({ example: '2026-05-27T12:00:00.000Z' })
  generatedAt: Date;

  @IsInt({ message: 'El totalSubmissions debe ser un número entero.' })
  @ApiProperty({ example: 42 })
  totalSubmissions: number;

  @IsNumber({}, { message: 'El averageScore debe ser un número.' })
  @ApiProperty({ example: 3.8 })
  averageScore: number;

  @IsArray({ message: 'El grades debe ser un arreglo.' })
  @ApiProperty({ type: [ChallengeGradeDto] })
  grades: ChallengeGradeDto[];
}
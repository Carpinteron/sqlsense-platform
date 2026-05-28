import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StudentGradeDto {
  @ApiProperty({ example: 1 })
  studentId: number;

  @ApiProperty({ example: 'Estudiante Ejemplo' })
  studentName: string;

  @ApiProperty({ example: 'd9f1c2a0-4c3b-4a2a-ae9b-1a2b3c4d5e6f' })
  submissionId: string;

  @ApiProperty({ example: 4 })
  score: number;

  @ApiProperty({ example: 'ACCEPTED' })
  status: string;

  @ApiPropertyOptional({ example: 'Feedback del evaluador' })
  feedback: string;
}

export class ChallengeReportResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  challengeId: string;

  @ApiProperty({ example: '2026-05-27T12:00:00.000Z' })
  generatedAt: Date;

  @ApiProperty({ example: 10 })
  totalSubmissions: number;

  @ApiProperty({ example: 3.6 })
  averageScore: number;

  @ApiProperty({ type: [StudentGradeDto] })
  grades: StudentGradeDto[];
}
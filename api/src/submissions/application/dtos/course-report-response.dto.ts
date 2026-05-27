import { IsUUID, IsNotEmpty, IsNumber, IsDateString, IsInt, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StudentScoreDto {
  @IsInt({ message: 'El studentId debe ser un número entero.' })
  @ApiProperty({ example: 1 })
  studentId: number;

  @IsNumber({}, { message: 'El averageScore debe ser un número.' })
  @ApiProperty({ example: 3.5 })
  averageScore: number;
}

export class ChallengeAverageDto {
  @IsUUID('4', { message: 'El challengeId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  challengeId: string;

  @IsNumber({}, { message: 'El averageScore debe ser un número.' })
  @ApiProperty({ example: 3.8 })
  averageScore: number;
}

export class CourseReportResponseDto {
  @IsUUID('4', { message: 'El courseId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  courseId: string;

  @IsDateString()
  @ApiProperty({ example: '2026-05-27T12:00:00.000Z' })
  generatedAt: Date;

  @IsInt({ message: 'El totalStudents debe ser un número entero.' })
  @ApiProperty({ example: 120 })
  totalStudents: number;

  @IsInt({ message: 'El totalChallenges debe ser un número entero.' })
  @ApiProperty({ example: 25 })
  totalChallenges: number;

  @IsArray({ message: 'El challenges debe ser un arreglo.' })
  @ApiProperty({ type: [ChallengeAverageDto] })
  challenges: ChallengeAverageDto[];

  @IsArray({ message: 'El students debe ser un arreglo.' })
  @ApiProperty({ type: [StudentScoreDto] })
  students: StudentScoreDto[];
}
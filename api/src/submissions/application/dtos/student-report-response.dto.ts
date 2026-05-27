import { IsUUID, IsString, IsNotEmpty, IsNumber, IsDateString, IsInt, IsArray } from 'class-validator';

export class ChallengeGradeDto {
  @IsUUID('4', { message: 'El challengeId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  challengeId: string;

  @IsUUID('4', { message: 'El submissionId debe ser un UUID v4 válido.' })
  @IsNotEmpty()
  submissionId: string;

  @IsNumber({}, { message: 'El score debe ser un número.' })
  score: number;

  @IsString({ message: 'El status debe ser una cadena de texto.' })
  status: string;

  @IsString({ message: 'El feedback debe ser una cadena de texto.' })
  feedback: string;

  @IsDateString()
  submittedAt: Date | string | null;
}

export class StudentReportResponseDto {
  @IsInt({ message: 'El studentId debe ser un número entero.' })
  @IsNotEmpty()
  studentId: number;

  @IsDateString()
  generatedAt: Date;

  @IsInt({ message: 'El totalSubmissions debe ser un número entero.' })
  totalSubmissions: number;

  @IsNumber({}, { message: 'El averageScore debe ser un número.' })
  averageScore: number;

  @IsArray({ message: 'El grades debe ser un arreglo.' })
  grades: ChallengeGradeDto[];
}
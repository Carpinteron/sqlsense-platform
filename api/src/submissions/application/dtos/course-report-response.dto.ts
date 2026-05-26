import { IsUUID, IsString, IsNotEmpty, IsNumber, IsDateString, IsInt, IsArray } from 'class-validator';

export class StudentScoreDto {
  @IsInt({}, { message: 'El studentId debe ser un número entero.' })
  studentId: number;

  @IsNumber({}, { message: 'El averageScore debe ser un número.' })
  averageScore: number;
}

export class ChallengeAverageDto {
  @IsUUID('4', { message: 'El challengeId debe ser un UUID v4 válido.' })
  challengeId: string;

  @IsNumber({}, { message: 'El averageScore debe ser un número.' })
  averageScore: number;
}

export class CourseReportResponseDto {
  @IsUUID('4', { message: 'El courseId debe ser un UUID v4 válido.' })
  courseId: string;

  @IsDateString({ message: 'El generatedAt debe ser una fecha válida.' })
  generatedAt: Date;

  @IsInt({}, { message: 'El totalStudents debe ser un número entero.' })
  totalStudents: number;

  @IsInt({}, { message: 'El totalChallenges debe ser un número entero.' })
  totalChallenges: number;

  @IsArray({ message: 'El challenges debe ser un arreglo.' })
  challenges: ChallengeAverageDto[];

  @IsArray({ message: 'El students debe ser un arreglo.' })
  students: StudentScoreDto[];
}
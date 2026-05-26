export class StudentScoreDto {
  studentId: number;
  averageScore: number;
}

export class ChallengeAverageDto {
  challengeId: string;
  averageScore: number;
}

export class CourseReportResponseDto {
  courseId: string;
  generatedAt: Date;
  totalStudents: number;
  totalChallenges: number;
  challenges: ChallengeAverageDto[];
  students: StudentScoreDto[];
}
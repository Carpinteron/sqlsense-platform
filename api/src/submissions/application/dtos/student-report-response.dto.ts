export class ChallengeGradeDto {
  challengeId: string;
  submissionId: string;
  score: number;
  status: string;
  feedback: string;
  submittedAt: Date | string | null;
}

export class StudentReportResponseDto {
  studentId: number;
  generatedAt: Date;
  totalSubmissions: number;
  averageScore: number;
  grades: ChallengeGradeDto[];
}
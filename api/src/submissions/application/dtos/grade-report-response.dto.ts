export class StudentGradeDto {
  studentId: number;
  studentName: string; 
  submissionId: string;
  score: number;
  status: string;
  feedback: string;  
}

export class ChallengeReportResponseDto {
  challengeId: string;
  generatedAt: Date;
  totalSubmissions: number;
  averageScore: number;   
  grades: StudentGradeDto[];
}
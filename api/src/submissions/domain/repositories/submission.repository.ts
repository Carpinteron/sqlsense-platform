import { Submission } from '../entities/submission.interface';

export interface ChallengeGradeReport {
  studentId: number;
  studentName?: string; 
  submissionId: string;
  score: number;
  status: string;
  feedback?: string;
  createdAt: Date | string;
}

export interface ISubmissionRepository {
  create(submission: Omit<Submission, 'id' | 'createdAt'>): Promise<Submission>;

  findById(id: string): Promise<Submission | null>;

  findByStudentId(studentId: number): Promise<Submission[]>;

  findByChallengeId(challengeId: string): Promise<Submission[]>;

  getGradeReportByChallengeId(challengeId: string): Promise<ChallengeGradeReport[]>;
}
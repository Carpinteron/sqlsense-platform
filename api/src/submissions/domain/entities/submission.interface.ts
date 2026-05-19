export type SubmissionStatus = 
  | 'QUEUED' | 'RUNNING' | 'ACCEPTED' 
  | 'WRONG_ANSWER' | 'SYNTAX_ERROR' 
  | 'TIME_LIMIT_EXCEEDED' | 'RUNTIME_ERROR'
  | 'OPTIMIZATION_REQUIRED';

export interface Submission {
  id: string;
  studentId: number; 
  challengeId: string; 
  query: string;
  status: SubmissionStatus;
  executionTimeMs?: number;
  score?: number;
  result?: any;
  feedback?: string;
  createdAt?: Date | string;
}
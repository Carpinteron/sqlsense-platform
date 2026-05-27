export type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT';

export type ChallengeDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ChallengeStatus = 'draft' | 'published' | 'archived';

export interface Curso {
  id: string;
  name: string;
  code: string;
  period: string;
  groupNumber?: string;
  professorId?: number;
  createdAt?: string;
}

export interface Reto {
  id: string;
  title: string;
  description: string;
  difficulty?: ChallengeDifficulty;
  tags?: string[];
  databaseEngine?: string;
  timeLimit?: number;
  status?: ChallengeStatus;
  courseId?: string;
  createdBy?: number;
  schemaSql?: string;
  seedDataSql?: string;
  expectedResult?: object | null;
  createdAt?: string;
}

export interface SchemaTable {
  name: string;
  columns: {
    name: string;
    type: string;
    primary?: boolean;
    foreign?: string;
  }[];
}

export interface GeneratedSchema {
  schema: { tables: SchemaTable[] };
  sql: string;
}

export type FieldSpecType =
  | 'int'
  | 'decimal'
  | 'varchar'
  | 'date'
  | 'enum'
  | 'foreign_key'
  | 'boolean'
  | 'text';

export interface FieldSpec {
  type: FieldSpecType;
  references?: string;
  min?: number;
  max?: number;
  from?: string;
  to?: string;
  values?: string[];
  nullPercent?: number;
  edgeCases?: string[];
}

export interface MockDataJob {
  jobId: string;
  status: 'waiting' | 'active' | 'completed' | 'failed';
  result?: { table: string; count: number; sql: string };
  error?: string;
}

export type SubmissionStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'SYNTAX_ERROR'
  | 'TIME_LIMIT_EXCEEDED'
  | 'RUNTIME_ERROR'
  | 'OPTIMIZATION_REQUIRED';

export interface Submission {
  id: string;
  studentId: number;
  challengeId: string;
  query: string;
  status: SubmissionStatus;
  executionTimeMs?: number;
  score?: number;
  result?: unknown;
  feedback?: string;
  createdAt?: string;
}

export interface ChallengeReport {
  challengeId: string;
  generatedAt: string;
  totalSubmissions: number;
  averageScore: number;
  grades: {
    studentId: number;
    studentName: string;
    submissionId: string;
    score: number;
    status: string;
    feedback: string;
  }[];
}

export interface StudentReport {
  studentId: number;
  generatedAt: string;
  totalSubmissions: number;
  averageScore: number;
  grades: {
    challengeId: string;
    submissionId: string;
    score: number;
    status: string;
    feedback: string;
    submittedAt: string;
  }[];
}

export interface CourseReport {
  courseId: string;
  generatedAt: string;
  totalStudents: number;
  totalChallenges: number;
  challenges: { challengeId: string; averageScore: number }[];
  students: { studentId: number; averageScore: number }[];
}

/** Local evaluation config until backend module exists */
export type EvaluationVisibility = 'immediate' | 'after_deadline' | 'manual';

export interface Evaluation {
  id: string;
  title: string;
  description?: string;
  courseId: string;
  challengeIds: string[];
  startDate: string;
  endDate: string;
  durationMinutes: number;
  maxAttempts: number;
  resultsVisibility: EvaluationVisibility;
  createdAt: string;
}

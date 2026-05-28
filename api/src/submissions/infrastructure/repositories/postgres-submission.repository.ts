import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { ISubmissionRepository, ChallengeGradeReport } from '../../domain/repositories/submission.repository';
import { Submission } from '../../domain/entities/submission.interface';

@Injectable()
export class PostgresSubmissionRepository implements ISubmissionRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(submission: Omit<Submission, 'id' | 'createdAt'>): Promise<Submission> {
    const created = await this._prisma.submissions.create({
      data: {
        student_id: submission.studentId,
        challenge_id: submission.challengeId,
        query: submission.query,
        status: submission.status, 
      },
    });

    return this._mapToDomain(created);
  }

  async isStudentEnrolledInChallengeCourse(studentId: number, challengeId: string): Promise<boolean> {
  const match = await this._prisma.courseStudent.findFirst({
    where: {
      student_id: studentId,
      courses: {
        challenges: {
          some: {
            id: challengeId
          }
        }
      }
    }
  });

  return match !== null;
}

  async findById(id: string): Promise<Submission | null> {
    const found = await this._prisma.submissions.findUnique({
      where: { id },
    });

    if (!found) return null;
    return this._mapToDomain(found);
  }

  async findByStudentId(studentId: number): Promise<Submission[]> {
    const list = await this._prisma.submissions.findMany({
      where: { student_id: studentId },
      orderBy: { created_at: 'desc' }, 
    });

    return list.map(this._mapToDomain);
  }

  async findByChallengeId(challengeId: string): Promise<Submission[]> {
    const list = await this._prisma.submissions.findMany({
      where: { challenge_id: challengeId },
      orderBy: { created_at: 'desc' },
    });

    return list.map(this._mapToDomain);
  }

  async getGradeReportByChallengeId(challengeId: string): Promise<ChallengeGradeReport[]> {
    const dbReport = await this._prisma.submissions.findMany({ 
      where: { 
        challenge_id: challengeId,
        status: {
          notIn: ['QUEUED', 'RUNNING']
        }
      },
      include: {
        users: {
          select: {
            email: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return dbReport.map(row => ({
      studentId: row.student_id ?? 0, 
      studentName: row.users?.email || 'Estudiante sin correo',
      submissionId: row.id,
      score: row.score ?? 0,
      status: row.status || 'QUEUED',
      feedback: row.feedback ?? undefined,
      createdAt: row.created_at ?? new Date(),
    }));
  }

  private _mapToDomain(db: any): Submission {
    return {
      id: db.id,
      studentId: db.student_id ?? 0,
      challengeId: db.challenge_id,
      query: db.query,
      status: db.status,
      executionTimeMs: db.execution_time_ms ?? undefined,
      score: db.score ?? undefined,
      result: db.result,
      feedback: db.feedback ?? undefined,
      createdAt: db.created_at ?? new Date(),
    };
  }
}
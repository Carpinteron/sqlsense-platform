import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { ChallengeReportResponseDto } from '../dtos/grade-report-response.dto';

@Injectable()
export class GetChallengeReportUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
  ) {}

  async execute(challengeId: string): Promise<ChallengeReportResponseDto> {
    const rawReport = await this._submissionRepository.getGradeReportByChallengeId(challengeId);

    if (!rawReport || rawReport.length === 0) {
      return {
        challengeId,
        generatedAt: new Date(),
        totalSubmissions: 0,
        averageScore: 0,
        grades: [],
      };
    }

    const totalSubmissions = rawReport.length;
    
    const sumScores = rawReport.reduce((acc, current) => acc + (current.score || 0), 0);
    // Redondeamos el promedio a dos decimales
    const averageScore = Math.round((sumScores / totalSubmissions) * 100) / 100;

    const grades = rawReport.map(row => ({
      studentId: row.studentId,
      studentName: row.studentName || 'Estudiante Anónimo', 
      submissionId: row.submissionId,
      score: row.score || 0,
      status: row.status,
      feedback: row.feedback || 'Sin feedback disponible.', 
    }));

    return {
      challengeId,
      generatedAt: new Date(),
      totalSubmissions,
      averageScore,
      grades,
    };
  }
}
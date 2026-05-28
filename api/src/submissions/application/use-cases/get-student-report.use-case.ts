import { Injectable, Inject } from '@nestjs/common';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { StudentReportResponseDto } from '../dtos/student-report-response.dto';

@Injectable()
export class GetStudentReportUseCase {
  constructor(
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
  ) {}

  async execute(studentId: number): Promise<StudentReportResponseDto> {
    const submissions = await this._submissionRepository.findByStudentId(studentId);

    if (!submissions || submissions.length === 0) {
      return {
        studentId,
        generatedAt: new Date(),
        totalSubmissions: 0,
        averageScore: 0,
        grades: [],
      };
    }

    const totalSubmissions = submissions.length;

    const sumScores = submissions.reduce((acc, s) => acc + (s.score || 0), 0);
    const averageScore = Math.round((sumScores / totalSubmissions) * 100) / 100;

    const grades = submissions.map(s => ({
      challengeId: s.challengeId,
      submissionId: s.id,
      score: s.score ?? 0,
      status: s.status,
      feedback: s.feedback ?? 'Sin feedback disponible.',
      submittedAt: s.createdAt ?? null,
    }));

    return {
      studentId,
      generatedAt: new Date(),
      totalSubmissions,
      averageScore,
      grades,
    };
  }
}
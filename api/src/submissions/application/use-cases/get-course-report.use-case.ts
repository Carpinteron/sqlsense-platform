import { Injectable, Inject } from '@nestjs/common';
import type { ICourseRepository } from '../../../courses/domain/repositories/course.repository';
import type { IRetoRepository } from '../../../challenges/domain/repositories/reto.repository';
import type { ISubmissionRepository } from '../../domain/repositories/submission.repository';
import { CourseReportResponseDto, StudentScoreDto, ChallengeAverageDto } from '../dtos/course-report-response.dto';

@Injectable()
export class GetCourseReportUseCase {
  constructor(
    @Inject('COURSE_REPOSITORY')
    private readonly _courseRepository: ICourseRepository,
    @Inject('RETO_REPOSITORY')
    private readonly _retoRepository: IRetoRepository,
    @Inject('ISubmissionRepository')
    private readonly _submissionRepository: ISubmissionRepository,
  ) {}

  async execute(courseId: string): Promise<CourseReportResponseDto> {
    // 1. Estudiantes inscritos
    const students = await this._courseRepository.findStudentsByCourseId(courseId);

    // 2. Retos del curso
    const challenges = await this._retoRepository.findAll({ courseId });

    if (!challenges.length) {
      return {
        courseId,
        generatedAt: new Date(),
        totalStudents: students.length,
        totalChallenges: 0,
        challenges: [],
        students: [],
      };
    }

    // 3. Grade report por cada reto
    const reportsPerChallenge = await Promise.all(
      challenges.map(c => this._submissionRepository.getGradeReportByChallengeId(c.id)),
    );

    // 4. Promedio por reto
    const challengeAverages: ChallengeAverageDto[] = challenges.map((c, i) => {
      const rows = reportsPerChallenge[i];
      const avg = rows.length
        ? Math.round((rows.reduce((acc, r) => acc + (r.score || 0), 0) / rows.length) * 100) / 100
        : 0;
      return { challengeId: c.id, averageScore: avg };
    });

    // 5. Promedio por estudiante (mejor score por reto)
    const studentScores: StudentScoreDto[] = students.map(student => {
      const scoresPerChallenge = reportsPerChallenge.map(rows => {
        const row = rows.find(r => r.studentId === student.id);
        return row?.score || 0;
      });

      const avg = scoresPerChallenge.length
        ? Math.round((scoresPerChallenge.reduce((a, b) => a + b, 0) / scoresPerChallenge.length) * 100) / 100
        : 0;

      return {
        studentId: student.id,
        averageScore: avg,
      };
    });

    return {
      courseId,
      generatedAt: new Date(),
      totalStudents: students.length,
      totalChallenges: challenges.length,
      challenges: challengeAverages,
      students: studentScores,
    };
  }
}
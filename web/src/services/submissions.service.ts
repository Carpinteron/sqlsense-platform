import { apiClient } from '@/lib/axios';
import type { ChallengeReport, CourseReport, StudentReport, Submission } from '@/types/domain';

export const submissionsService = {
  async getById(id: string): Promise<Submission> {
    const { data } = await apiClient.get<Submission>(`/submissions/${id}`);
    return data;
  },

  async getByStudent(studentId: number): Promise<Submission[]> {
    const { data } = await apiClient.get<Submission[]>(`/submissions/student/${studentId}`);
    return data;
  },

  async getByChallenge(challengeId: string): Promise<Submission[]> {
    const { data } = await apiClient.get<Submission[]>(`/submissions/challenge/${challengeId}`);
    return data;
  },

  async getChallengeReport(challengeId: string): Promise<ChallengeReport> {
    const { data } = await apiClient.get<ChallengeReport>(
      `/submissions/challenge/${challengeId}/report`,
    );
    return data;
  },

  async getStudentReport(studentId: number): Promise<StudentReport> {
    const { data } = await apiClient.get<StudentReport>(`/submissions/student/${studentId}/report`);
    return data;
  },

  async getCourseReport(courseId: string): Promise<CourseReport> {
    const { data } = await apiClient.get<CourseReport>(`/submissions/course/${courseId}/report`);
    return data;
  },
};

import { useQuery } from '@tanstack/react-query';
import { submissionsService } from '@/services/submissions.service';

export const SUBMISSION_QUERY_KEYS = {
  byStudent: (id: number) => ['submissions', 'student', id] as const,
  byChallenge: (id: string) => ['submissions', 'challenge', id] as const,
  challengeReport: (id: string) => ['submissions', 'report', 'challenge', id] as const,
  studentReport: (id: number) => ['submissions', 'report', 'student', id] as const,
  courseReport: (id: string) => ['submissions', 'report', 'course', id] as const,
};

export function useSubmissionsByStudent(studentId: number, enabled = true) {
  return useQuery({
    queryKey: SUBMISSION_QUERY_KEYS.byStudent(studentId),
    queryFn: () => submissionsService.getByStudent(studentId),
    enabled: studentId > 0 && enabled,
  });
}

export function useSubmissionsByChallenge(challengeId: string, enabled = true) {
  return useQuery({
    queryKey: SUBMISSION_QUERY_KEYS.byChallenge(challengeId),
    queryFn: () => submissionsService.getByChallenge(challengeId),
    enabled: !!challengeId && enabled,
  });
}

export function useChallengeReport(challengeId: string, enabled = true) {
  return useQuery({
    queryKey: SUBMISSION_QUERY_KEYS.challengeReport(challengeId),
    queryFn: () => submissionsService.getChallengeReport(challengeId),
    enabled: !!challengeId && enabled,
  });
}

export function useStudentReport(studentId: number, enabled = true) {
  return useQuery({
    queryKey: SUBMISSION_QUERY_KEYS.studentReport(studentId),
    queryFn: () => submissionsService.getStudentReport(studentId),
    enabled: studentId > 0 && enabled,
  });
}

export function useCourseReport(courseId: string, enabled = true) {
  return useQuery({
    queryKey: SUBMISSION_QUERY_KEYS.courseReport(courseId),
    queryFn: () => submissionsService.getCourseReport(courseId),
    enabled: !!courseId && enabled,
  });
}

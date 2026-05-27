import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  submissionsService,
  CreateSubmissionPayload,
} from '@/services/submissions.service';
import type { Submission, SubmissionStatus } from '@/types/domain';
import { toast } from 'sonner';

export const SUBMISSION_QUERY_KEYS = {
  detail: (id: string) => ['submissions', id] as const,
  byStudent: (id: number) => ['submissions', 'student', id] as const,
  byChallenge: (id: string) => ['submissions', 'challenge', id] as const,
  challengeReport: (id: string) => ['submissions', 'report', 'challenge', id] as const,
  studentReport: (id: number) => ['submissions', 'report', 'student', id] as const,
  courseReport: (id: string) => ['submissions', 'report', 'course', id] as const,
};

const TERMINAL_STATUSES: SubmissionStatus[] = [
  'ACCEPTED',
  'WRONG_ANSWER',
  'SYNTAX_ERROR',
  'TIME_LIMIT_EXCEEDED',
  'RUNTIME_ERROR',
  'OPTIMIZATION_REQUIRED',
];

export function isSubmissionPending(status?: SubmissionStatus): boolean {
  return status === 'QUEUED' || status === 'RUNNING';
}

export function useSubmission(id: string | null, poll = false) {
  return useQuery({
    queryKey: SUBMISSION_QUERY_KEYS.detail(id ?? ''),
    queryFn: () => submissionsService.getById(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      if (!poll) return false;
      const status = query.state.data?.status;
      if (!status || !isSubmissionPending(status)) return false;
      return 1500;
    },
  });
}

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

export function useCreateSubmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubmissionPayload) => submissionsService.create(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: SUBMISSION_QUERY_KEYS.detail(data.id) });
      queryClient.invalidateQueries({
        queryKey: SUBMISSION_QUERY_KEYS.byChallenge(variables.challengeId),
      });
      toast.success('Consulta enviada — evaluando…');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Error al enviar la solución');
    },
  });
}

export function useSubmitAndPoll(studentId: number) {
  const queryClient = useQueryClient();
  const create = useCreateSubmission();

  const submit = async (payload: CreateSubmissionPayload): Promise<Submission> => {
    const created = await create.mutateAsync(payload);

    const pollUntilDone = async (): Promise<Submission> => {
      const sub = await submissionsService.getById(created.id);
      if (!isSubmissionPending(sub.status)) {
        queryClient.setQueryData(SUBMISSION_QUERY_KEYS.detail(created.id), sub);
        queryClient.invalidateQueries({
          queryKey: SUBMISSION_QUERY_KEYS.byStudent(studentId),
        });
        queryClient.invalidateQueries({
          queryKey: SUBMISSION_QUERY_KEYS.studentReport(studentId),
        });
        return sub;
      }
      await new Promise((r) => setTimeout(r, 1500));
      return pollUntilDone();
    };

    return pollUntilDone();
  };

  return { submit, isPending: create.isPending };
}

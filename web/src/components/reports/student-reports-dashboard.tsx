"use client";

import { useState } from "react";
import { Trophy, Target, BarChart3 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useStudentCursos } from "@/hooks/use-cursos";
import { useRetos } from "@/hooks/use-retos";
import { useStudentReport, useCourseReport } from "@/hooks/use-submissions";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import type { SubmissionStatus } from "@/types/domain";

export function StudentReportsDashboard() {
  const user = useAuthStore((s) => s.user);
  const studentId = user?.id ?? 0;
  const { data: courses } = useStudentCursos(studentId, studentId > 0);
  const { data: retos } = useRetos();
  const { data: studentReport, isLoading: loadingStudent } = useStudentReport(studentId, studentId > 0);
  const [courseId, setCourseId] = useState("");
  const { data: courseReport, isLoading: loadingCourse } = useCourseReport(courseId, !!courseId);

  const getChallengeTitle = (id: string) => retos?.find((r) => r.id === id)?.title ?? id.slice(0, 8);

  const chartData =
    studentReport?.grades.map((g) => ({
      name: getChallengeTitle(g.challengeId).slice(0, 12),
      score: g.score,
    })) ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Mis envíos"
          value={studentReport?.totalSubmissions ?? 0}
          icon={Target}
          isLoading={loadingStudent}
        />
        <StatCard
          title="Promedio"
          value={studentReport?.averageScore?.toFixed(1) ?? "—"}
          icon={BarChart3}
          iconClass="text-primary"
          isLoading={loadingStudent}
        />
        <StatCard
          title="Cursos"
          value={courses?.length ?? 0}
          icon={Trophy}
          iconClass="text-amber-500"
        />
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Rendimiento por reto</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStudent ? (
            <Skeleton className="h-[200px]" />
          ) : !chartData.length ? (
            <p className="text-sm text-muted-foreground">Sin datos de rendimiento.</p>
          ) : (
            <ChartContainer
              config={{ score: { label: "Score", color: "var(--color-chart-1)" } }}
              className="h-[220px] w-full"
            >
              <BarChart data={chartData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis domain={[0, 5]} fontSize={10} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Historial de entregas</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingStudent ? (
            <Skeleton className="h-32" />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentReport?.grades.map((g) => (
                  <TableRow key={g.submissionId}>
                    <TableCell className="font-medium text-sm">
                      {getChallengeTitle(g.challengeId)}
                    </TableCell>
                    <TableCell>
                      <SubmissionStatusBadge status={g.status as SubmissionStatus} />
                    </TableCell>
                    <TableCell className="text-right">{g.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="space-y-2">
        <label className="text-sm font-medium">Leaderboard del curso</label>
        <Select value={courseId} onValueChange={setCourseId}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un curso inscrito" />
          </SelectTrigger>
          <SelectContent>
            {courses?.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {courseId && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              Leaderboard — {courses?.find((c) => c.id === courseId)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCourse ? (
              <Skeleton className="h-40" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Estudiante</TableHead>
                    <TableHead className="text-right">Promedio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...(courseReport?.students ?? [])]
                    .sort((a, b) => b.averageScore - a.averageScore)
                    .map((s, i) => (
                      <TableRow
                        key={s.studentId}
                        className={s.studentId === studentId ? "bg-primary/5" : ""}
                      >
                        <TableCell>{i + 1}</TableCell>
                        <TableCell>
                          Estudiante #{s.studentId}
                          {s.studentId === studentId && " (tú)"}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {s.averageScore.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

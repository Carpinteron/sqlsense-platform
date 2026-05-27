"use client";

import { useState } from "react";
import { BarChart3, Trophy, Users, Target } from "lucide-react";
import { useCursos } from "@/hooks/use-cursos";
import { useRetos } from "@/hooks/use-retos";
import { useCourseReport, useChallengeReport } from "@/hooks/use-submissions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/shared/stat-card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "@/components/ui/chart";

export function ReportsDashboard() {
  const { data: courses } = useCursos();
  const { data: retos } = useRetos();
  const [courseId, setCourseId] = useState("");
  const [challengeId, setChallengeId] = useState("");

  const { data: courseReport, isLoading: loadingCourse } = useCourseReport(courseId, !!courseId);
  const { data: challengeReport, isLoading: loadingChallenge } = useChallengeReport(
    challengeId,
    !!challengeId,
  );

  const chartConfig = {
    score: { label: "Puntuación", color: "var(--color-chart-1)" },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Curso</label>
          <Select value={courseId} onValueChange={setCourseId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar curso para analytics" />
            </SelectTrigger>
            <SelectContent>
              {courses?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Reto</label>
          <Select value={challengeId} onValueChange={setChallengeId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar reto" />
            </SelectTrigger>
            <SelectContent>
              {retos?.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {courseId && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Estudiantes"
              value={courseReport?.totalStudents ?? "—"}
              icon={Users}
              iconClass="text-blue-500"
              isLoading={loadingCourse}
            />
            <StatCard
              title="Retos"
              value={courseReport?.totalChallenges ?? "—"}
              icon={Target}
              iconClass="text-primary"
              isLoading={loadingCourse}
            />
            <StatCard
              title="Promedio curso"
              value={
                courseReport?.students?.length
                  ? (
                      courseReport.students.reduce((a, s) => a + s.averageScore, 0) /
                      courseReport.students.length
                    ).toFixed(1)
                  : "—"
              }
              icon={BarChart3}
              isLoading={loadingCourse}
            />
            <StatCard
              title="Leaderboard"
              value={courseReport?.students?.length ?? 0}
              description="Estudiantes rankeados"
              icon={Trophy}
              iconClass="text-amber-500"
              isLoading={loadingCourse}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Rendimiento por reto</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingCourse ? (
                  <Skeleton className="h-[200px]" />
                ) : !courseReport?.challenges?.length ? (
                  <p className="text-sm text-muted-foreground">Sin datos de retos.</p>
                ) : (
                  <ChartContainer config={chartConfig} className="h-[200px] w-full">
                    <BarChart data={courseReport.challenges}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="challengeId" tickFormatter={(v) => v.slice(0, 8)} fontSize={10} />
                      <YAxis domain={[0, 100]} fontSize={10} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="averageScore" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} name="score" />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-base">Leaderboard estudiantes</CardTitle>
                <CardDescription>Ordenado por promedio de score</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingCourse ? (
                  <Skeleton className="h-[200px]" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Estudiante</TableHead>
                        <TableHead className="text-right">Score</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...(courseReport?.students ?? [])]
                        .sort((a, b) => b.averageScore - a.averageScore)
                        .slice(0, 10)
                        .map((s, i) => (
                          <TableRow key={s.studentId}>
                            <TableCell className="font-mono text-xs">{i + 1}</TableCell>
                            <TableCell>Estudiante #{s.studentId}</TableCell>
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
          </div>
        </>
      )}

      {challengeId && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Submissions del reto</CardTitle>
            <CardDescription>
              {challengeReport?.totalSubmissions ?? 0} envíos · Promedio{" "}
              {challengeReport?.averageScore?.toFixed(1) ?? "—"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingChallenge ? (
              <Skeleton className="h-32" />
            ) : !challengeReport?.grades?.length ? (
              <p className="text-sm text-muted-foreground">Sin submissions para este reto.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Estudiante</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {challengeReport.grades.map((g) => (
                    <TableRow key={g.submissionId}>
                      <TableCell>{g.studentName || `#${g.studentId}`}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{g.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">{g.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {!courseId && !challengeId && (
        <Card className="border-dashed border-border/50 p-12 text-center text-muted-foreground text-sm">
          Selecciona un curso o reto para ver analytics, scores y leaderboards.
        </Card>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  BookOpen,
  Code2,
  Award,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useStudentCursos } from "@/hooks/use-cursos";
import { useRetos } from "@/hooks/use-retos";
import { useSubmissionsByStudent, useStudentReport } from "@/hooks/use-submissions";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DifficultyBadge } from "@/components/shared/challenge-badges";
import type { SubmissionStatus } from "@/types/domain";

export function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const studentId = user?.id ?? 0;

  const { data: courses, isLoading: loadingCourses } = useStudentCursos(studentId, studentId > 0);
  const { data: retos, isLoading: loadingRetos } = useRetos();
  const { data: submissions, isLoading: loadingSubs } = useSubmissionsByStudent(studentId, studentId > 0);
  const { data: report, isLoading: loadingReport } = useStudentReport(studentId, studentId > 0);

  const publishedRetos = retos?.filter((r) => r.status === "published") ?? [];
  const accepted =
    submissions?.filter((s) => s.status === "ACCEPTED" || s.status === "OPTIMIZATION_REQUIRED")
      .length ?? 0;
  const totalAttempts = submissions?.length ?? 0;
  const progressPct =
    publishedRetos.length > 0
      ? Math.round((accepted / publishedRetos.length) * 100)
      : 0;

  const recentSubs = [...(submissions ?? [])]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 6);

  const getRetoTitle = (id: string) =>
    retos?.find((r) => r.id === id)?.title ?? id.slice(0, 8);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Cursos inscritos"
          value={courses?.length ?? 0}
          icon={BookOpen}
          iconClass="text-blue-500"
          isLoading={loadingCourses}
        />
        <StatCard
          title="Retos disponibles"
          value={publishedRetos.length}
          icon={Code2}
          iconClass="text-primary"
          isLoading={loadingRetos}
        />
        <StatCard
          title="Completados"
          value={accepted}
          description={`de ${publishedRetos.length} publicados`}
          icon={CheckCircle2}
          iconClass="text-emerald-500"
          isLoading={loadingSubs}
        />
        <StatCard
          title="Promedio score"
          value={report?.averageScore?.toFixed(1) ?? "—"}
          description={`${report?.totalSubmissions ?? 0} envíos`}
          icon={TrendingUp}
          iconClass="text-amber-500"
          isLoading={loadingReport}
        />
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Progreso general</CardTitle>
          <CardDescription>
            {accepted} retos resueltos · {totalAttempts} intentos totales
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingSubs ? (
            <Skeleton className="h-3 w-full" />
          ) : (
            <Progress value={progressPct} className="h-2" />
          )}
          <p className="text-xs text-muted-foreground mt-2">{progressPct}% de retos publicados</p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Retos disponibles</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/workspace">
                Workspace <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingRetos ? (
              Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)
            ) : !publishedRetos.length ? (
              <p className="text-sm text-muted-foreground">Sin retos publicados.</p>
            ) : (
              publishedRetos.slice(0, 5).map((r) => (
                <Link
                  key={r.id}
                  href={`/workspace/${r.id}`}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3 hover:bg-primary/5 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.title}</p>
                    <DifficultyBadge difficulty={r.difficulty} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Actividad reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingSubs ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)
            ) : !recentSubs.length ? (
              <p className="text-sm text-muted-foreground">Aún no has enviado soluciones.</p>
            ) : (
              recentSubs.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border/40 px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <p className="font-medium truncate">{getRetoTitle(s.challengeId)}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.createdAt &&
                        format(new Date(s.createdAt), "dd MMM HH:mm", { locale: es })}
                    </p>
                  </div>
                  <SubmissionStatusBadge status={s.status as SubmissionStatus} />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Mis cursos</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCourses ? (
            <Skeleton className="h-20" />
          ) : !courses?.length ? (
            <p className="text-sm text-muted-foreground">No estás inscrito en cursos.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {courses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-lg border border-border/50 p-4 bg-muted/20"
                >
                  <p className="font-mono text-xs text-muted-foreground">{c.code}</p>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c.period}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { href: "/workspace", icon: Code2, label: "SQL Workspace" },
          { href: "/ai-recommendations", icon: Award, label: "Recomendaciones IA" },
          { href: "/reports", icon: TrendingUp, label: "Mis reportes" },
        ].map((item) => (
          <Button key={item.href} asChild variant="outline" className="h-auto py-4">
            <Link href={item.href} className="flex flex-col items-center gap-2">
              <item.icon className="h-5 w-5 text-primary" />
              <span className="text-sm">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}

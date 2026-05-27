"use client";

import { useMemo, useState } from "react";
import {
  Sparkles,
  Zap,
  Database,
  AlertTriangle,
  GitCompare,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useSubmissionsByStudent } from "@/hooks/use-submissions";
import { parseFeedbackToInsights } from "@/lib/submission-utils";
import { SqlEditor } from "@/components/shared/sql-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import type { Submission, SubmissionStatus } from "@/types/domain";
import { cn } from "@/lib/utils";

function InsightBlock({
  icon: Icon,
  title,
  children,
  accent = "primary",
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: "primary" | "amber" | "violet" | "emerald";
}) {
  const accents = {
    primary: "from-primary/20 to-primary/5 border-primary/20",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/20",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/20",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
  };

  return (
    <Card className={cn("border bg-gradient-to-br overflow-hidden", accents[accent])}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-foreground/90 leading-relaxed space-y-2">
        {children}
      </CardContent>
    </Card>
  );
}

export function AiRecommendationsPanel() {
  const user = useAuthStore((s) => s.user);
  const studentId = user?.id ?? 0;
  const { data: submissions, isLoading } = useSubmissionsByStudent(studentId, studentId > 0);
  const [selectedId, setSelectedId] = useState<string>("");

  const withFeedback = useMemo(
    () =>
      (submissions ?? []).filter(
        (s) =>
          s.feedback &&
          s.status !== "QUEUED" &&
          s.status !== "RUNNING",
      ),
    [submissions],
  );

  const selected: Submission | undefined =
    withFeedback.find((s) => s.id === selectedId) ?? withFeedback[0];

  const insights = selected ? parseFeedbackToInsights(selected) : null;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-2xl" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!withFeedback.length) {
    return (
      <Card className="border-border/50 glass-card">
        <EmptyState
          icon={Sparkles}
          title="Sin recomendaciones aún"
          description="Envía soluciones en el SQL Workspace. El feedback del evaluador (IA) aparecerá aquí como recomendaciones estructuradas."
          action={{
            label: "Ir al workspace",
            onClick: () => {
              window.location.href = "/workspace";
            },
          }}
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/10 via-primary/5 to-transparent p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/20 ring-1 ring-violet-500/30">
              <Sparkles className="h-6 w-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Asistente SQL</h2>
              <p className="text-sm text-muted-foreground mt-0.5 max-w-lg">
                Análisis basado en el feedback real de tus entregas evaluadas por el backend.
              </p>
            </div>
          </div>
          <Select
            value={selected?.id ?? ""}
            onValueChange={setSelectedId}
          >
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Seleccionar entrega" />
            </SelectTrigger>
            <SelectContent>
              {withFeedback.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.query.slice(0, 40)}… ({s.status})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selected && (
          <div className="mt-4 flex items-center gap-2">
            <SubmissionStatusBadge status={selected.status as SubmissionStatus} />
            {selected.score != null && (
              <Badge variant="secondary">Score {selected.score}/5</Badge>
            )}
          </div>
        )}
      </div>

      {insights && (
        <>
          <InsightBlock icon={MessageSquare} title="Resumen" accent="primary">
            <p>{insights.summary}</p>
          </InsightBlock>

          <div className="grid gap-4 lg:grid-cols-2">
            <InsightBlock icon={Zap} title="Recomendaciones de optimización" accent="violet">
              {insights.optimizations.map((o, i) => (
                <p key={i} className="whitespace-pre-wrap border-l-2 border-violet-500/40 pl-3">
                  {o}
                </p>
              ))}
            </InsightBlock>

            <InsightBlock icon={Database} title="Índices sugeridos" accent="emerald">
              {insights.indexes.length ? (
                insights.indexes.map((idx, i) => (
                  <code key={i} className="block text-xs font-mono bg-black/20 rounded px-2 py-1">
                    {idx}
                  </code>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No se detectaron sugerencias de índices en el feedback.
                </p>
              )}
            </InsightBlock>
          </div>

          {insights.warnings.length > 0 && (
            <InsightBlock icon={AlertTriangle} title="Advertencias" accent="amber">
              {insights.warnings.map((w, i) => (
                <p key={i}>{w}</p>
              ))}
            </InsightBlock>
          )}

          <InsightBlock icon={GitCompare} title="Comparación: original vs optimizado" accent="primary">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <p className="text-label mb-2">Consulta original</p>
                <SqlEditor value={insights.originalQuery} readOnly height="160px" />
              </div>
              <div>
                <p className="text-label mb-2">SQL sugerido / optimizado</p>
                {insights.rewrittenSql ? (
                  <SqlEditor value={insights.rewrittenSql} readOnly height="160px" />
                ) : (
                  <div className="rounded-lg border border-dashed border-border/50 p-6 text-center text-muted-foreground text-xs">
                    El feedback no incluyó una consulta reescrita. Revisa las recomendaciones
                    de optimización arriba.
                  </div>
                )}
              </div>
            </div>
          </InsightBlock>

          {insights.performanceNotes.length > 0 && (
            <InsightBlock icon={Zap} title="Performance insights" accent="amber">
              {insights.performanceNotes.map((n, i) => (
                <p key={i}>{n}</p>
              ))}
            </InsightBlock>
          )}
        </>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Datos obtenidos de GET /submissions/student/:id — no existe endpoint dedicado de
        recomendaciones IA; el contenido proviene del campo feedback de cada evaluación.
      </p>
    </div>
  );
}

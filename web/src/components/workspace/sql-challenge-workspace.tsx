"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  Play,
  Send,
  ChevronLeft,
  Terminal,
  Table2,
  History,
  FileCode,
  Clock,
  Plus,
  X,
} from "lucide-react";
import { useReto } from "@/hooks/use-retos";
import { useSubmissionsByStudent, useSubmitAndPoll } from "@/hooks/use-submissions";
import { useAuthStore } from "@/store/auth.store";
import type { Submission } from "@/types/domain";
import { SqlEditor } from "@/components/shared/sql-editor";
import { DifficultyBadge } from "@/components/shared/challenge-badges";
import { SubmissionFeedbackPanel } from "@/components/submissions/submission-feedback-panel";
import { ResultsTable } from "@/components/submissions/results-table";
import { SubmissionHistoryList } from "@/components/submissions/submission-history-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface QueryTab {
  id: string;
  name: string;
  sql: string;
}

const DEFAULT_SQL = "-- Escribe tu consulta SQL aquí\nSELECT ";

export function SqlChallengeWorkspace({ challengeId }: { challengeId: string }) {
  const user = useAuthStore((s) => s.user);
  const studentId = user?.id ?? 0;
  const { data: challenge, isLoading } = useReto(challengeId);
  const { data: history, isLoading: loadingHistory } = useSubmissionsByStudent(
    studentId,
    studentId > 0,
  );
  const { submit, isPending } = useSubmitAndPoll(studentId);

  const [tabs, setTabs] = useState<QueryTab[]>([
    { id: "1", name: "query.sql", sql: DEFAULT_SQL },
  ]);
  const [activeTabId, setActiveTabId] = useState("1");
  const [lastSubmission, setLastSubmission] = useState<Submission | null>(null);
  const [consoleLines, setConsoleLines] = useState<string[]>([]);
  const [bottomTab, setBottomTab] = useState("output");

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? tabs[0];

  const challengeHistory = useMemo(
    () => history?.filter((s) => s.challengeId === challengeId) ?? [],
    [history, challengeId],
  );
  const selectedSubmission = lastSubmission ?? challengeHistory[0] ?? null;

  const updateSql = useCallback(
    (sql: string) => {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t, sql } : t)),
      );
    },
    [activeTabId],
  );

  const log = (line: string) => {
    const ts = new Date().toLocaleTimeString();
    setConsoleLines((prev) => [`[${ts}] ${line}`, ...prev].slice(0, 50));
  };

  const runSubmission = async () => {
    if (!activeTab?.sql.trim()) return;
    log("Enviando consulta al evaluador…");
    setBottomTab("console");
    try {
      const result = await submit({
        challengeId,
        query: activeTab.sql,
      });
      setLastSubmission(result);
      log(`Evaluación completada: ${result.status}`);
      if (result.executionTimeMs != null) {
        log(`Tiempo de ejecución: ${result.executionTimeMs}ms`);
      }
      setBottomTab("output");
    } catch {
      log("Error al procesar el envío.");
    }
  };

  const addTab = () => {
    const id = String(Date.now());
    setTabs((prev) => [...prev, { id, name: `query_${prev.length + 1}.sql`, sql: DEFAULT_SQL }]);
    setActiveTabId(id);
  };

  const closeTab = (id: string) => {
    if (tabs.length <= 1) return;
    setTabs((prev) => prev.filter((t) => t.id !== id));
    if (activeTabId === id) setActiveTabId(tabs[0].id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[500px] w-full rounded-xl" />
      </div>
    );
  }

  if (!challenge) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">Reto no encontrado.</p>
        <Button asChild variant="link" className="mt-2">
          <Link href="/workspace">Volver al workspace</Link>
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-7rem)] min-h-[600px] animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/workspace">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold truncate">{challenge.title}</h1>
            <div className="flex flex-wrap gap-2 mt-1">
              <DifficultyBadge difficulty={challenge.difficulty} />
              {challenge.databaseEngine && (
                <Badge variant="secondary" className="text-xs">
                  {challenge.databaseEngine}
                </Badge>
              )}
              {challenge.timeLimit && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Clock className="h-3 w-3" />
                  {challenge.timeLimit}s
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={runSubmission}
            disabled={isPending}
          >
            <Play className="mr-2 h-4 w-4" />
            {isPending ? "Ejecutando…" : "Ejecutar"}
          </Button>
          <Button size="sm" onClick={runSubmission} disabled={isPending}>
            <Send className="mr-2 h-4 w-4" />
            Enviar solución
          </Button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid flex-1 min-h-0 gap-4 lg:grid-cols-[minmax(280px,340px)_1fr]">
        {/* Problem panel */}
        <Card className="border-border/50 bg-card/50 flex flex-col min-h-0 overflow-hidden">
          <CardHeader className="py-3 shrink-0">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileCode className="h-4 w-4" />
              Enunciado
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto text-sm space-y-4 pb-4">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {challenge.description}
            </p>
            {challenge.tags?.length ? (
              <div className="flex flex-wrap gap-1">
                {challenge.tags.map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px]">
                    {t}
                  </Badge>
                ))}
              </div>
            ) : null}
            <Tabs defaultValue="schema">
              <TabsList className="w-full">
                <TabsTrigger value="schema" className="flex-1 text-xs">
                  Schema
                </TabsTrigger>
                <TabsTrigger value="seed" className="flex-1 text-xs">
                  Seed
                </TabsTrigger>
              </TabsList>
              <TabsContent value="schema" className="mt-2">
                <pre className="text-xs font-mono bg-muted/40 rounded-lg p-3 overflow-x-auto max-h-48">
                  {challenge.schemaSql || "-- Sin schema definido"}
                </pre>
              </TabsContent>
                <div className="mt-3">
                  <p className="text-label mb-2 flex items-center gap-1">
                    <FileCode className="h-3 w-3" /> Consulta esperada (IA)
                  </p>
                  <pre className="text-xs font-mono bg-muted/40 rounded-lg p-3 overflow-x-auto max-h-48">
                    {challenge.expectedResult ?? '-- No hay consulta esperada'}
                  </pre>
                </div>
              <TabsContent value="seed" className="mt-2">
                <pre className="text-xs font-mono bg-muted/40 rounded-lg p-3 overflow-x-auto max-h-48">
                  {challenge.seedDataSql || "-- Sin seed data"}
                </pre>
              </TabsContent>
            </Tabs>
            <div>
              <p className="text-label mb-2 flex items-center gap-1">
                <History className="h-3 w-3" /> Historial
              </p>
              <SubmissionHistoryList
                submissions={challengeHistory}
                isLoading={loadingHistory}
                selectedId={lastSubmission?.id}
                onSelect={setLastSubmission}
              />
            </div>
          </CardContent>
        </Card>

        {/* Editor + bottom panel */}
        <div className="flex flex-col min-h-0 gap-2">
          {/* Editor tabs */}
          <div className="flex items-center gap-1 border-b border-border/50 pb-0 overflow-x-auto shrink-0">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 text-xs rounded-t-md border border-b-0 cursor-pointer transition-colors",
                  activeTabId === tab.id
                    ? "bg-muted/60 border-border/50 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.name}
                {tabs.length > 1 && (
                  <button
                    type="button"
                    className="ml-1 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab.id);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            ))}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addTab}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex-1 min-h-[200px] rounded-lg overflow-hidden border border-border/50 ring-1 ring-border/30">
            <SqlEditor
              value={activeTab.sql}
              onChange={updateSql}
              height="100%"
              className="h-full min-h-[220px] [&>div]:h-full [&>div>section]:min-h-[220px]"
            />
          </div>

          {selectedSubmission && (
            <SubmissionFeedbackPanel submission={selectedSubmission} />
          )}

          {/* Bottom: console / output / history */}
          <Card className="border-border/50 bg-card/50 shrink-0">
            <Tabs value={bottomTab} onValueChange={setBottomTab}>
              <div className="flex items-center border-b border-border/50 px-2">
                <TabsList className="h-9 bg-transparent p-0 gap-0">
                  <TabsTrigger
                    value="output"
                    className="text-xs rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Table2 className="h-3.5 w-3.5 mr-1.5" />
                    Resultados
                  </TabsTrigger>
                  <TabsTrigger
                    value="console"
                    className="text-xs rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Terminal className="h-3.5 w-3.5 mr-1.5" />
                    Consola
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value="output" className="p-3 m-0">
                {isPending ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                  </div>
                ) : (
                  <ResultsTable result={lastSubmission?.result} />
                )}
              </TabsContent>
              <TabsContent value="console" className="p-3 m-0">
                <div className="font-mono text-xs bg-[#0d1117] rounded-lg p-3 max-h-[200px] overflow-y-auto text-emerald-400/90">
                  {consoleLines.length === 0 ? (
                    <span className="text-muted-foreground">
                      La consola mostrará logs de ejecución…
                    </span>
                  ) : (
                    consoleLines.map((line, i) => (
                      <div key={i} className="py-0.5">
                        {line}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}

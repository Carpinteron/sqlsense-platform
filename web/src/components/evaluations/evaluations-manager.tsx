"use client";

import { useMemo, useState } from "react";
import { Plus, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  useEvaluations,
  useCreateEvaluation,
  useDeleteEvaluation,
} from "@/hooks/use-evaluations";
import { useCursos } from "@/hooks/use-cursos";
import { useRetos } from "@/hooks/use-retos";
import type { Evaluation, EvaluationVisibility } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { Award } from "lucide-react";

export function EvaluationsManager() {
  const { data: evaluations, isLoading } = useEvaluations();
  const { data: courses } = useCursos();
  const { data: retos } = useRetos();
  const create = useCreateEvaluation();
  const del = useDeleteEvaluation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    courseId: "",
    challengeIds: [] as string[],
    startDate: "",
    endDate: "",
    durationMinutes: 60,
    maxAttempts: 3,
    resultsVisibility: "after_deadline" as EvaluationVisibility,
  });

  const courseRetos = useMemo(
    () => retos?.filter((r) => r.courseId === form.courseId) ?? [],
    [retos, form.courseId],
  );

  const toggleChallenge = (id: string) => {
    setForm((f) => ({
      ...f,
      challengeIds: f.challengeIds.includes(id)
        ? f.challengeIds.filter((c) => c !== id)
        : [...f.challengeIds, id],
    }));
  };

  const handleCreate = async () => {
    await create.mutateAsync(form);
    setOpen(false);
    setForm({
      title: "",
      description: "",
      courseId: "",
      challengeIds: [],
      startDate: "",
      endDate: "",
      durationMinutes: 60,
      maxAttempts: 3,
      resultsVisibility: "after_deadline",
    });
  };

  const visibilityLabels: Record<EvaluationVisibility, string> = {
    immediate: "Inmediata",
    after_deadline: "Tras fecha límite",
    manual: "Manual",
  };

  if (isLoading) return null;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-muted-foreground">
        Las evaluaciones se guardan localmente hasta que el módulo REST esté disponible en el backend.
      </div>

      <div className="flex justify-end">
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva evaluación
        </Button>
      </div>

      {!evaluations?.length ? (
        <Card className="border-border/50">
          <EmptyState
            icon={Award}
            title="Sin evaluaciones"
            description="Crea una evaluación asignando retos, fechas y reglas de intentos."
            action={{ label: "Crear evaluación", onClick: () => setOpen(true) }}
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {evaluations.map((ev: Evaluation) => (
            <Card key={ev.id} className="border-border/50 bg-card/50 p-4">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="font-semibold">{ev.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {courses?.find((c) => c.id === ev.courseId)?.name ?? ev.courseId}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive h-8 w-8"
                  onClick={() => del.mutate(ev.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge variant="outline" className="text-xs">
                  <Calendar className="mr-1 h-3 w-3" />
                  {ev.startDate && format(new Date(ev.startDate), "dd MMM", { locale: es })}
                  {" → "}
                  {ev.endDate && format(new Date(ev.endDate), "dd MMM yyyy", { locale: es })}
                </Badge>
                <Badge variant="secondary" className="text-xs">{ev.durationMinutes} min</Badge>
                <Badge variant="secondary" className="text-xs">{ev.maxAttempts} intentos</Badge>
                <Badge variant="outline" className="text-xs">
                  {visibilityLabels[ev.resultsVisibility]}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {ev.challengeIds.length} retos asignados
              </p>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva evaluación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Curso</Label>
              <Select value={form.courseId} onValueChange={(v) => setForm({ ...form, courseId: v, challengeIds: [] })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar curso" /></SelectTrigger>
                <SelectContent>
                  {courses?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {form.courseId && (
              <div className="space-y-2">
                <Label>Retos asignados</Label>
                <div className="flex flex-wrap gap-2">
                  {courseRetos.map((r) => (
                    <Badge
                      key={r.id}
                      variant={form.challengeIds.includes(r.id) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleChallenge(r.id)}
                    >
                      {r.title}
                    </Badge>
                  ))}
                  {!courseRetos.length && (
                    <p className="text-xs text-muted-foreground">No hay retos en este curso.</p>
                  )}
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Inicio</Label>
                <Input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Fin</Label>
                <Input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duración (min)</Label>
                <Input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Intentos máx.</Label>
                <Input type="number" value={form.maxAttempts} onChange={(e) => setForm({ ...form, maxAttempts: Number(e.target.value) })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Visibilidad resultados</Label>
              <Select
                value={form.resultsVisibility}
                onValueChange={(v) => setForm({ ...form, resultsVisibility: v as EvaluationVisibility })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Inmediata</SelectItem>
                  <SelectItem value="after_deadline">Tras fecha límite</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleCreate} disabled={!form.title || !form.courseId || create.isPending}>
              Crear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

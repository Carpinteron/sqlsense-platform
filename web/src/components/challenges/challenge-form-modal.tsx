"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateReto, useUpdateReto } from "@/hooks/use-retos";
import { useCursos } from "@/hooks/use-cursos";
import { SqlEditor } from "@/components/shared/sql-editor";
import type { Reto } from "@/types/domain";

const schema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  databaseEngine: z.string().optional(),
  timeLimit: z.number().optional(),
  courseId: z.string().optional(),
  tags: z.string().optional(),
  schemaSql: z.string().optional(),
  seedDataSql: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ChallengeFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reto?: Reto | null;
}

export function ChallengeFormModal({ open, onOpenChange, reto }: ChallengeFormModalProps) {
  const isEdit = !!reto;
  const create = useCreateReto();
  const update = useUpdateReto();
  const { data: courses } = useCursos();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "Easy",
      status: "draft",
      databaseEngine: "PostgreSQL",
      timeLimit: 60,
      tags: "",
      schemaSql: "",
      seedDataSql: "",
    },
  });

  const schemaSql = useWatch({ control: form.control, name: "schemaSql" }) ?? "";
  const difficulty = useWatch({ control: form.control, name: "difficulty" });
  const status = useWatch({ control: form.control, name: "status" });
  const courseId = useWatch({ control: form.control, name: "courseId" });
  const seedDataSql = useWatch({ control: form.control, name: "seedDataSql" }) ?? "";

  useEffect(() => {
    if (reto) {
      form.reset({
        title: reto.title,
        description: reto.description,
        difficulty: reto.difficulty ?? "Easy",
        status: reto.status ?? "draft",
        databaseEngine: reto.databaseEngine ?? "PostgreSQL",
        timeLimit: reto.timeLimit ?? 60,
        courseId: reto.courseId ?? "",
        tags: reto.tags?.join(", ") ?? "",
        schemaSql: reto.schemaSql ?? "",
        seedDataSql: reto.seedDataSql ?? "",
      });
    } else {
      form.reset({
        title: "",
        description: "",
        difficulty: "Easy",
        status: "draft",
        databaseEngine: "PostgreSQL",
        timeLimit: 60,
        tags: "",
        schemaSql: "",
        seedDataSql: "",
      });
    }
  }, [reto, form, open]);

  const onSubmit = form.handleSubmit(async (data) => {
    const payload = {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      status: data.status,
      databaseEngine: data.databaseEngine,
      timeLimit: data.timeLimit,
      courseId: data.courseId || undefined,
      tags: data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      schemaSql: data.schemaSql || undefined,
      seedDataSql: data.seedDataSql || undefined,
    };
    if (isEdit && reto) {
      await update.mutateAsync({ id: reto.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar reto SQL" : "Nuevo reto SQL"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="space-y-2 sm:col-span-2">
              <Label>Título</Label>
              <Input {...form.register("title")} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Descripción</Label>
              <Textarea {...form.register("description")} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Dificultad</Label>
              <Select
                value={difficulty}
                onValueChange={(v) => form.setValue("difficulty", v as FormData["difficulty"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={status}
                onValueChange={(v) => form.setValue("status", v as FormData["status"])}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                  <SelectItem value="archived">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Motor SQL</Label>
              <Input {...form.register("databaseEngine")} />
            </div>
            <div className="space-y-2">
              <Label>Tiempo límite (s)</Label>
              <Input type="number" {...form.register("timeLimit")} />
            </div>
            <div className="space-y-2">
              <Label>Curso</Label>
              <Select
                value={courseId || "none"}
                onValueChange={(v) => form.setValue("courseId", v === "none" ? "" : v)}
              >
                <SelectTrigger><SelectValue placeholder="Sin curso" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin curso</SelectItem>
                  {courses?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tags (separados por coma)</Label>
              <Input {...form.register("tags")} placeholder="joins, select" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Schema SQL</Label>
            <SqlEditor
              value={schemaSql}
              onChange={(v) => form.setValue("schemaSql", v)}
              height="180px"
            />
          </div>
          <div className="space-y-2">
            <Label>Seed data SQL</Label>
            <SqlEditor
              value={seedDataSql}
              onChange={(v) => form.setValue("seedDataSql", v)}
              height="120px"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={create.isPending || update.isPending}>
              {isEdit ? "Guardar" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

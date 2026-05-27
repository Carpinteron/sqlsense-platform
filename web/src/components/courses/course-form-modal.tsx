"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useCreateCurso, useUpdateCurso } from "@/hooks/use-cursos";
import type { Curso } from "@/types/domain";

const schema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  code: z.string().min(1, "Código requerido"),
  period: z.string().min(1, "Período requerido"),
  groupNumber: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CourseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Curso | null;
}

export function CourseFormModal({ open, onOpenChange, course }: CourseFormModalProps) {
  const create = useCreateCurso();
  const update = useUpdateCurso();
  const isEdit = !!course;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", code: "", period: "", groupNumber: "" },
  });

  useEffect(() => {
    if (course) {
      form.reset({
        name: course.name,
        code: course.code,
        period: course.period,
        groupNumber: course.groupNumber ?? "",
      });
    } else {
      form.reset({ name: "", code: "", period: "", groupNumber: "" });
    }
  }, [course, form, open]);

  const onSubmit = form.handleSubmit(async (data) => {
    const payload = {
      name: data.name,
      code: data.code,
      period: data.period,
      groupNumber: data.groupNumber || undefined,
    };
    if (isEdit && course) {
      await update.mutateAsync({ id: course.id, payload });
    } else {
      await create.mutateAsync(payload);
    }
    onOpenChange(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar curso" : "Nuevo curso"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input {...form.register("name")} placeholder="Bases de Datos" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Código</Label>
              <Input {...form.register("code")} placeholder="BD-301" />
            </div>
            <div className="space-y-2">
              <Label>Período</Label>
              <Input {...form.register("period")} placeholder="2026-1" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Grupo (opcional)</Label>
            <Input {...form.register("groupNumber")} placeholder="2" />
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

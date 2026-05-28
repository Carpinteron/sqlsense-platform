"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteCurso } from "@/hooks/use-cursos";
import type { Curso } from "@/types/domain";

interface DeleteCourseModalProps {
  course: Curso | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCourseModal({ course, open, onOpenChange }: DeleteCourseModalProps) {
  const del = useDeleteCurso();

  const handleDelete = async () => {
    if (!course) return;
    await del.mutateAsync(course.id);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar curso</DialogTitle>
          <DialogDescription>
            ¿Eliminar <strong>{course?.name}</strong> ({course?.code})? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button variant="destructive" onClick={handleDelete} disabled={del.isPending}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

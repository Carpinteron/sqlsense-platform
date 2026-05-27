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
import { useDeleteReto } from "@/hooks/use-retos";
import type { Reto } from "@/types/domain";

export function DeleteChallengeModal({
  reto,
  open,
  onOpenChange,
}: {
  reto: Reto | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const del = useDeleteReto();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar reto</DialogTitle>
          <DialogDescription>
            ¿Eliminar el reto <strong>{reto?.title}</strong>?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            variant="destructive"
            disabled={del.isPending}
            onClick={async () => {
              if (reto) await del.mutateAsync(reto.id);
              onOpenChange(false);
            }}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

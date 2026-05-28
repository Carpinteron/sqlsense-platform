"use client";

import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/use-users";
import { User } from "@/services/users.service";

interface Props {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserModal({ user, open, onOpenChange }: Props) {
  const deleteUser = useDeleteUser();

  async function handleDelete() {
    if (!user) return;
    await deleteUser.mutateAsync(user.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Eliminar Usuario</DialogTitle>
          </div>
          <DialogDescription>
            Esta acción es irreversible. El usuario{" "}
            <span className="font-semibold text-foreground">{user?.email}</span>{" "}
            será eliminado permanentemente del sistema.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={deleteUser.isPending}
            onClick={handleDelete}
          >
            {deleteUser.isPending ? "Eliminando..." : "Sí, eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUpdateUser, useChangeUserRole } from "@/hooks/use-users";
import { User, UserRole } from "@/services/users.service";

const schema = z.object({
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  password: z.string().min(6, "Mínimo 6 caracteres").optional().or(z.literal("")),
  role: z.enum(["ADMIN", "PROFESSOR", "STUDENT"]),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditUserModal({ user, open, onOpenChange }: Props) {
  const updateUser = useUpdateUser();
  const changeRole = useChangeUserRole();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", role: "STUDENT" },
  });

  useEffect(() => {
    if (user) {
      form.reset({ email: user.email, password: "", role: user.role });
    }
  }, [user, form]);

  async function onSubmit(data: FormValues) {
    if (!user) return;

    const promises: Promise<any>[] = [];

    // Update email/password if changed
    const updatePayload: { email?: string; password?: string } = {};
    if (data.email && data.email !== user.email) updatePayload.email = data.email;
    if (data.password) updatePayload.password = data.password;
    if (Object.keys(updatePayload).length > 0) {
      promises.push(updateUser.mutateAsync({ id: user.id, payload: updatePayload }));
    }

    // Change role if changed
    if (data.role !== user.role) {
      promises.push(changeRole.mutateAsync({ id: user.id, role: data.role as UserRole }));
    }

    await Promise.all(promises);
    onOpenChange(false);
  }

  const isPending = updateUser.isPending || changeRole.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogDescription>
            Actualiza los datos del usuario. Deja la contraseña en blanco para no cambiarla.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl><Input placeholder={user?.email} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Nueva contraseña (opcional)</FormLabel>
                <FormControl><Input type="password" placeholder="Dejar en blanco para no cambiar" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Separator />
            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="PROFESSOR">Profesor</SelectItem>
                    <SelectItem value="STUDENT">Estudiante</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Guardando..." : "Guardar cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

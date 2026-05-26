"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth.store";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user?.email}</h1>
        <p className="text-muted-foreground mt-2">
          Selecciona una opción del menú lateral para comenzar.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
            <CardDescription>Información de tu cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Rol:</strong> {user?.role}</p>
          </CardContent>
        </Card>

        {/* Placeholders for future widgets based on roles */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-muted-foreground">Widget Pendiente</CardTitle>
            <CardDescription>Próximamente...</CardDescription>
          </CardHeader>
          <CardContent className="h-20 flex items-center justify-center text-muted-foreground/50">
            [ Espacio para métricas ]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

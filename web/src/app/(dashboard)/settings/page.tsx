import { Settings } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Administra tu perfil, preferencias de cuenta y configuración de la plataforma.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50">
        <EmptyState
          icon={Settings}
          title="Próximamente"
          description="La configuración de perfil y preferencias de cuenta estará disponible pronto. Podrás actualizar tu información personal, contraseña y ajustes de notificaciones."
        />
      </div>
    </div>
  );
}

import { Award } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function EvaluationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Evaluaciones</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Revisa tus evaluaciones, intentos y calificaciones obtenidas.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50">
        <EmptyState
          icon={Award}
          title="Próximamente"
          description="El módulo de evaluaciones llegará pronto. Aquí encontrarás el historial de intentos, notas y retroalimentación de la IA."
        />
      </div>
    </div>
  );
}

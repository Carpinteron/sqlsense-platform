import { FileText } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Analiza el rendimiento de estudiantes y el uso de la plataforma.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50">
        <EmptyState
          icon={FileText}
          title="Próximamente"
          description="El módulo de reportes y analíticas llegará pronto. Visualiza métricas de rendimiento, tasas de aprobación y tendencias de uso."
        />
      </div>
    </div>
  );
}

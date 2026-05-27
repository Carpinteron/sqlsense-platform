import { Database } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function SchemasPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Esquemas y Datos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Genera esquemas SQL y datos mock con inteligencia artificial.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50">
        <EmptyState
          icon={Database}
          title="Próximamente"
          description="Genera esquemas de base de datos completos y datos de prueba realistas usando nuestra IA. Disponible pronto para profesores."
        />
      </div>
    </div>
  );
}

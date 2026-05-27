import { Code2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";

export default function WorkspacePage() {
  return (
    <ProtectedRoute allowedRoles={["STUDENT"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="SQL Workspace"
          description="Entorno de práctica para estudiantes — en construcción."
        />
        <Card className="border-border/50 bg-card/50 border-dashed">
          <EmptyState
            icon={Code2}
            title="Próximamente"
            description="El workspace completo con editor, ejecución y submissions visuales estará disponible en una fase posterior. El routing y la arquitectura ya están preparados."
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
}

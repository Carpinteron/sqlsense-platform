import { Sparkles } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card } from "@/components/ui/card";

export default function AiRecommendationsPage() {
  return (
    <ProtectedRoute allowedRoles={["STUDENT", "PROFESSOR"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Recomendaciones IA"
          description="Sugerencias personalizadas de retos — en construcción."
        />
        <Card className="border-border/50 bg-card/50 border-dashed">
          <EmptyState
            icon={Sparkles}
            title="Próximamente"
            description="Las recomendaciones completas con IA se integrarán cuando el módulo esté disponible en el backend."
          />
        </Card>
      </div>
    </ProtectedRoute>
  );
}

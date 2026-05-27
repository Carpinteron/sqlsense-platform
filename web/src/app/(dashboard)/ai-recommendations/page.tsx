"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { AiRecommendationsPanel } from "@/components/ai/ai-recommendations-panel";

export default function AiRecommendationsPage() {
  return (
    <ProtectedRoute allowedRoles={["STUDENT", "PROFESSOR"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Recomendaciones IA"
          description="Análisis y optimización SQL basados en el feedback de tus entregas."
        />
        <AiRecommendationsPanel />
      </div>
    </ProtectedRoute>
  );
}

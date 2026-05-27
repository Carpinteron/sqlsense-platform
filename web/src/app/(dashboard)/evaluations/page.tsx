"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { EvaluationsManager } from "@/components/evaluations/evaluations-manager";

export default function EvaluationsPage() {
  return (
    <ProtectedRoute allowedRoles={["PROFESSOR", "STUDENT", "ADMIN"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Evaluaciones"
          description="Configura evaluaciones con retos, fechas, duración e intentos máximos."
        />
        <EvaluationsManager />
      </div>
    </ProtectedRoute>
  );
}

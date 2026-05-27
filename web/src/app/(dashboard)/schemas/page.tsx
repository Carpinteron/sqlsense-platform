"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { SchemasWorkspace } from "@/components/schemas/schemas-workspace";

export default function SchemasPage() {
  return (
    <ProtectedRoute allowedRoles={["PROFESSOR", "ADMIN"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Esquemas y Datos"
          description="Editor SQL, generación IA, mock data y vista previa de datasets."
        />
        <SchemasWorkspace />
      </div>
    </ProtectedRoute>
  );
}

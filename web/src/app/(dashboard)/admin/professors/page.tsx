"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { ProfessorsTable } from "@/components/admin/professors-table";

export default function AdminProfessorsPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Gestión de Profesores"
          description="Visualiza y asigna profesores. Los profesores son usuarios con rol PROFESSOR."
        />
        <ProfessorsTable />
      </div>
    </ProtectedRoute>
  );
}

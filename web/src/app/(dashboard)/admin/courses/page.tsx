"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { CoursesManager } from "@/components/courses/courses-manager";

export default function AdminCoursesPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Gestión de Cursos"
          description="Administra cursos, estudiantes inscritos y retos asociados."
        />
        <CoursesManager isAdmin />
      </div>
    </ProtectedRoute>
  );
}

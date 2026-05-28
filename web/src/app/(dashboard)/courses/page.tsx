"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { CoursesManager } from "@/components/courses/courses-manager";
import { StudentCoursesView } from "@/components/courses/student-courses-view";
import { useAuthStore } from "@/store/auth.store";

export default function CoursesPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isStudent = role === "STUDENT";

  return (
    <ProtectedRoute allowedRoles={["PROFESSOR", "STUDENT"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Mis Cursos"
          description={
            isStudent
              ? "Cursos en los que estás inscrito."
              : "Crea cursos, edítalos e inscribe estudiantes."
          }
        />
        {isStudent ? <StudentCoursesView /> : <CoursesManager />}
      </div>
    </ProtectedRoute>
  );
}

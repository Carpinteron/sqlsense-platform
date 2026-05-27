"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { ReportsDashboard } from "@/components/reports/reports-dashboard";
import { StudentReportsDashboard } from "@/components/reports/student-reports-dashboard";
import { useAuthStore } from "@/store/auth.store";

export default function ReportsPage() {
  const role = useAuthStore((s) => s.user?.role);
  const isStudent = role === "STUDENT";

  return (
    <ProtectedRoute allowedRoles={["PROFESSOR", "ADMIN", "STUDENT"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Reportes y Analytics"
          description={
            isStudent
              ? "Tu rendimiento, historial y leaderboards de cursos."
              : "Scores, rendimiento y métricas de la plataforma."
          }
        />
        {isStudent ? <StudentReportsDashboard /> : <ReportsDashboard />}
      </div>
    </ProtectedRoute>
  );
}

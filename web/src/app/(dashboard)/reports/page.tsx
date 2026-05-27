"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { ReportsDashboard } from "@/components/reports/reports-dashboard";

export default function ReportsPage() {
  return (
    <ProtectedRoute allowedRoles={["PROFESSOR", "ADMIN"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Reportes y Analytics"
          description="Scores, rendimiento por estudiante/reto, leaderboards y overview de submissions."
        />
        <ReportsDashboard />
      </div>
    </ProtectedRoute>
  );
}

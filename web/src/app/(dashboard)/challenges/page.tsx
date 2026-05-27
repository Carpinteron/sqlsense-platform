"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { PageHeader } from "@/components/shared/page-header";
import { ChallengesManager } from "@/components/challenges/challenges-manager";
import { useAuthStore } from "@/store/auth.store";

export default function ChallengesPage() {
  const role = useAuthStore((s) => s.user?.role);
  const readOnly = role === "STUDENT";

  return (
    <ProtectedRoute allowedRoles={["PROFESSOR", "STUDENT", "ADMIN"]}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Retos SQL"
          description={
            readOnly
              ? "Retos publicados disponibles para practicar."
              : "Crea, edita y publica retos con dificultad, tags y límites de tiempo."
          }
        />
        <ChallengesManager readOnly={readOnly} />
      </div>
    </ProtectedRoute>
  );
}

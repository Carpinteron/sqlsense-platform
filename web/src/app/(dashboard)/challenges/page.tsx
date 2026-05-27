import { Code2 } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function ChallengesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Retos SQL</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Practica con retos SQL diseñados para fortalecer tus habilidades.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50">
        <EmptyState
          icon={Code2}
          title="Próximamente"
          description="El módulo de retos SQL estará disponible pronto. Podrás resolver desafíos en entornos aislados con feedback en tiempo real."
        />
      </div>
    </div>
  );
}

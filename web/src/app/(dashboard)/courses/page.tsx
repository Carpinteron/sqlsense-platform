import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mis Cursos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestiona los cursos en los que participas como estudiante o profesor.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50">
        <EmptyState
          icon={BookOpen}
          title="Próximamente"
          description="La gestión de cursos estará disponible pronto. Aquí podrás ver, inscribirte y administrar tus cursos SQL."
        />
      </div>
    </div>
  );
}

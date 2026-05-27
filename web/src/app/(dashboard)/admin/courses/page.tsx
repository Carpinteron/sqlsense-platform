import { BookOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminCoursesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Cursos</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Administra todos los cursos de la plataforma.
        </p>
      </div>
      <div className="rounded-2xl border border-border/50 bg-card/50">
        <EmptyState
          icon={BookOpen}
          title="Próximamente"
          description="La administración centralizada de cursos estará disponible pronto. Aquí podrás crear, asignar y gestionar todos los cursos de la plataforma."
        />
      </div>
    </div>
  );
}

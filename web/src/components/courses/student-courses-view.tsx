"use client";

import { BookOpen } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useStudentCursos } from "@/hooks/use-cursos";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export function StudentCoursesView() {
  const user = useAuthStore((s) => s.user);
  const { data: courses, isLoading } = useStudentCursos(user?.id ?? 0, !!user?.id);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <Card className="border-border/50">
        <EmptyState
          icon={BookOpen}
          title="Sin cursos inscritos"
          description="Aún no estás inscrito en ningún curso. Contacta a tu profesor."
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {courses.map((c) => (
        <Card key={c.id} className="border-border/50 bg-card/50 p-5">
          <p className="font-mono text-xs text-muted-foreground">{c.code}</p>
          <h3 className="font-semibold mt-1">{c.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {c.period}
            {c.groupNumber ? ` · Grupo ${c.groupNumber}` : ""}
          </p>
        </Card>
      ))}
    </div>
  );
}

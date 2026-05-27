"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourseStudents, useEnrollStudent } from "@/hooks/use-cursos";
import { RoleBadge } from "@/components/users/role-badge";
import type { Curso } from "@/types/domain";

interface CourseDetailSheetProps {
  course: Curso | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canEnroll?: boolean;
}

export function CourseDetailSheet({
  course,
  open,
  onOpenChange,
  canEnroll,
}: CourseDetailSheetProps) {
  const [studentId, setStudentId] = useState("");
  const { data: students, isLoading } = useCourseStudents(course?.id ?? "", open && !!course);
  const enroll = useEnrollStudent();

  const handleEnroll = async () => {
    if (!course || !studentId) return;
    await enroll.mutateAsync({ courseId: course.id, studentId: Number(studentId) });
    setStudentId("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{course?.name}</SheetTitle>
          <SheetDescription>
            {course?.code} · {course?.period}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {canEnroll && (
            <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
              <p className="text-sm font-medium">Inscribir estudiante</p>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label className="text-xs">ID del estudiante</Label>
                  <Input
                    type="number"
                    placeholder="ej. 3"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                  />
                </div>
                <Button
                  className="mt-5"
                  size="sm"
                  onClick={handleEnroll}
                  disabled={!studentId || enroll.isPending}
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-3">
              Estudiantes inscritos ({students?.length ?? 0})
            </p>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : !students?.length ? (
              <p className="text-sm text-muted-foreground">Sin estudiantes inscritos.</p>
            ) : (
              <ul className="space-y-2">
                {students.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2 text-sm"
                  >
                    <span>{s.email}</span>
                    <RoleBadge role={s.role} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

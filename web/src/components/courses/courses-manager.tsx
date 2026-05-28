"use client";

import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Users, RefreshCw } from "lucide-react";
import { useCursos, useCreateCurso, useUpdateCurso, useDeleteCurso } from "@/hooks/use-cursos";
import { useUsers } from "@/hooks/use-users";
import { useRetos } from "@/hooks/use-retos";
import { useEvaluations } from "@/hooks/use-evaluations";
import { usePagination } from "@/hooks/use-pagination";
import { useAuthStore } from "@/store/auth.store";
import type { Curso } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { CourseFormModal } from "@/components/courses/course-form-modal";
import { CourseDetailSheet } from "@/components/courses/course-detail-sheet";
import { DeleteCourseModal } from "@/components/courses/delete-course-modal";

export function CoursesManager({ isAdmin = false }: { isAdmin?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { data: courses, isLoading, isError, refetch } = useCursos();
  const { data: users } = useUsers(isAdmin);
  const { data: retos } = useRetos();
  const { data: evaluations } = useEvaluations(isAuthenticated);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<Curso | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Curso | null>(null);
  const [detailCourse, setDetailCourse] = useState<Curso | null>(null);

  const professors = useMemo(
    () => users?.filter((u) => u.role === "PROFESSOR") ?? [],
    [users],
  );

  const filtered = useMemo(() => {
    if (!courses) return [];
    return courses.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase()) ||
        c.period.toLowerCase().includes(search.toLowerCase()),
    );
  }, [courses, search]);

  const { page, totalPages, paginated, goToPage, resetPage, pageSize, total } =
    usePagination(filtered, 8);

  const getProfessorEmail = (id?: number) =>
    professors.find((p) => p.id === id)?.email ?? (id ? `Profesor #${id}` : "—");

  const getCourseStats = (courseId: string) => ({
    retos: retos?.filter((r) => r.courseId === courseId).length ?? 0,
    evals: evaluations?.filter((e) => e.courseId === courseId).length ?? 0,
  });

  if (isError) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Error al cargar cursos.</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, código o período..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <Button onClick={() => setFormOpen(true)} className="ml-auto shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Curso
        </Button>
      </div>

      {isAdmin && (
        <p className="text-xs text-muted-foreground rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
          Los cursos se listan según el profesor autenticado. Un endpoint global de administración aún no está disponible en el API.
        </p>
      )}

      <Card className="overflow-hidden border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Período</TableHead>
              {isAdmin && <TableHead className="hidden lg:table-cell">Profesor</TableHead>}
              <TableHead className="hidden md:table-cell">Retos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: isAdmin ? 6 : 5 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} className="h-32 text-center text-muted-foreground">
                  {search ? "Sin resultados para la búsqueda." : "No hay cursos. Crea el primero."}
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((course) => {
                const stats = getCourseStats(course.id);
                return (
                  <TableRow key={course.id} className="hover:bg-muted/30">
                    <TableCell className="font-mono text-xs">{course.code}</TableCell>
                    <TableCell className="font-medium">{course.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {course.period}
                      {course.groupNumber ? ` · G${course.groupNumber}` : ""}
                    </TableCell>
                    {isAdmin && (
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {getProfessorEmail(course.professorId)}
                      </TableCell>
                    )}
                    <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                      {stats.retos} retos · {stats.evals} eval.
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setDetailCourse(course)}>
                            <Users className="mr-2 h-4 w-4" /> Estudiantes
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setEditCourse(course)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteCourse(course)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <DataTablePagination
        page={page}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={goToPage}
      />

      <CourseFormModal open={formOpen} onOpenChange={setFormOpen} />
      <CourseFormModal
        course={editCourse}
        open={!!editCourse}
        onOpenChange={(o) => !o && setEditCourse(null)}
      />
      <DeleteCourseModal
        course={deleteCourse}
        open={!!deleteCourse}
        onOpenChange={(o) => !o && setDeleteCourse(null)}
      />
      <CourseDetailSheet
        course={detailCourse}
        open={!!detailCourse}
        onOpenChange={(o) => !o && setDetailCourse(null)}
        canEnroll={user?.role === "PROFESSOR" || user?.role === "ADMIN"}
      />
    </div>
  );
}

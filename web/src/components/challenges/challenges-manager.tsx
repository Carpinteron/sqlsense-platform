"use client";

import { useMemo, useState } from "react";
import { Plus, Search, MoreHorizontal, Pencil, Trash2, RefreshCw, Globe } from "lucide-react";
import { useRetos, useUpdateReto } from "@/hooks/use-retos";
import { useCursos } from "@/hooks/use-cursos";
import { usePagination } from "@/hooks/use-pagination";
import { useAuthStore } from "@/store/auth.store";
import type { Reto, ChallengeStatus } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { DifficultyBadge, ChallengeStatusBadge } from "@/components/shared/challenge-badges";
import { ChallengeFormModal } from "@/components/challenges/challenge-form-modal";
import { DeleteChallengeModal } from "@/components/challenges/delete-challenge-modal";

type StatusFilter = ChallengeStatus | "ALL";

export function ChallengesManager({ readOnly = false }: { readOnly?: boolean }) {
  const user = useAuthStore((s) => s.user);
  const isProfessor = user?.role === "PROFESSOR" || user?.role === "ADMIN";
  const { data: retos, isLoading, isError, refetch } = useRetos();
  const { data: courses } = useCursos();
  const updateReto = useUpdateReto();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [formOpen, setFormOpen] = useState(false);
  const [editReto, setEditReto] = useState<Reto | null>(null);
  const [deleteReto, setDeleteReto] = useState<Reto | null>(null);

  const filtered = useMemo(() => {
    if (!retos) return [];
    return retos.filter((r) => {
      const matchSearch =
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [retos, search, statusFilter]);

  const { page, totalPages, paginated, goToPage, resetPage, pageSize, total } =
    usePagination(filtered, 8);

  const getCourseName = (id?: string) =>
    courses?.find((c) => c.id === id)?.name ?? "—";

  const publish = async (reto: Reto) => {
    await updateReto.mutateAsync({ id: reto.id, payload: { status: "published" } });
  };

  if (isError) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">Error al cargar retos.</p>
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
            placeholder="Buscar retos..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              resetPage();
            }}
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v as StatusFilter);
            resetPage();
          }}
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos</SelectItem>
            <SelectItem value="draft">Borrador</SelectItem>
            <SelectItem value="published">Publicado</SelectItem>
            <SelectItem value="archived">Archivado</SelectItem>
          </SelectContent>
        </Select>
        {isProfessor && !readOnly && (
          <Button onClick={() => setFormOpen(true)} className="ml-auto shrink-0">
            <Plus className="mr-2 h-4 w-4" /> Nuevo Reto
          </Button>
        )}
      </div>

      <Card className="overflow-hidden border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>Título</TableHead>
              <TableHead>Dificultad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="hidden md:table-cell">Motor</TableHead>
              <TableHead className="hidden lg:table-cell">Curso</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Sin retos encontrados.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((reto) => (
                <TableRow key={reto.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{reto.title}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {reto.tags?.slice(0, 3).map((t) => (
                          <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {t}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><DifficultyBadge difficulty={reto.difficulty} /></TableCell>
                  <TableCell><ChallengeStatusBadge status={reto.status} /></TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {reto.databaseEngine ?? "—"}
                    {reto.timeLimit ? ` · ${reto.timeLimit}s` : ""}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {getCourseName(reto.courseId)}
                  </TableCell>
                  <TableCell className="text-right">
                    {isProfessor && !readOnly ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {reto.status !== "published" && (
                            <DropdownMenuItem onClick={() => publish(reto)}>
                              <Globe className="mr-2 h-4 w-4" /> Publicar
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => setEditReto(reto)}>
                            <Pencil className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setDeleteReto(reto)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-muted-foreground">Solo lectura</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
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

      {isProfessor && !readOnly && (
        <>
          <ChallengeFormModal open={formOpen} onOpenChange={setFormOpen} />
          <ChallengeFormModal
            reto={editReto}
            open={!!editReto}
            onOpenChange={(o) => !o && setEditReto(null)}
          />
          <DeleteChallengeModal
            reto={deleteReto}
            open={!!deleteReto}
            onOpenChange={(o) => !o && setDeleteReto(null)}
          />
        </>
      )}
    </div>
  );
}

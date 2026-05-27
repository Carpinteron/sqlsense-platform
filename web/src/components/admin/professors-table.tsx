"use client";

import { useMemo, useState } from "react";
import { Search, Mail, BookOpen } from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { usePagination } from "@/hooks/use-pagination";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { RoleBadge } from "@/components/users/role-badge";
import { DataTablePagination } from "@/components/shared/data-table-pagination";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function ProfessorsTable() {
  const { data: users, isLoading } = useUsers(true);
  const [search, setSearch] = useState("");

  const professors = useMemo(() => {
    if (!users) return [];
    return users.filter((u) => u.role === "PROFESSOR");
  }, [users]);

  const filtered = useMemo(
    () =>
      professors.filter(
        (p) =>
          p.email.toLowerCase().includes(search.toLowerCase()) ||
          String(p.id).includes(search),
      ),
    [professors, search],
  );

  const { page, totalPages, paginated, goToPage, resetPage, pageSize, total } =
    usePagination(filtered, 10);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar profesor..."
          className="pl-9"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetPage();
          }}
        />
      </div>

      <Card className="overflow-hidden border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>ID</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Cursos</TableHead>
              <TableHead className="hidden md:table-cell">Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>
                  ))}
                </TableRow>
              ))
            ) : paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No hay profesores registrados.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">#{p.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {p.email}
                    </div>
                  </TableCell>
                  <TableCell><RoleBadge role={p.role} /></TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      <BookOpen className="mr-1 h-3 w-3" />
                      Asignación vía rol
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {p.createdAt
                      ? format(new Date(p.createdAt), "dd MMM yyyy", { locale: es })
                      : "—"}
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
    </div>
  );
}

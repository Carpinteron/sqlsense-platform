"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Users, BookOpen, Code2, Send, ArrowRight } from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { useCursos } from "@/hooks/use-cursos";
import { useRetos } from "@/hooks/use-retos";
import { useAuthStore } from "@/store/auth.store";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function AdminAnalytics() {
  const { data: users, isLoading: loadingUsers } = useUsers(true);
  const { data: courses, isLoading: loadingCourses } = useCursos();
  const { data: retos, isLoading: loadingRetos } = useRetos();
  const user = useAuthStore((s) => s.user);

  const stats = useMemo(() => {
    const total = users?.length ?? 0;
    const students = users?.filter((u) => u.role === "STUDENT").length ?? 0;
    const professors = users?.filter((u) => u.role === "PROFESSOR").length ?? 0;
    const published = retos?.filter((r) => r.status === "published").length ?? 0;
    const draft = retos?.filter((r) => r.status === "draft").length ?? 0;
    return { total, students, professors, published, draft };
  }, [users, retos]);

  const roleChart = [
    { name: "Estudiantes", value: stats.students, fill: "var(--color-chart-3)" },
    { name: "Profesores", value: stats.professors, fill: "var(--color-chart-1)" },
    { name: "Admins", value: users?.filter((u) => u.role === "ADMIN").length ?? 0, fill: "var(--color-chart-5)" },
  ].filter((d) => d.value > 0);

  const retoChart = [
    { name: "published", value: stats.published },
    { name: "draft", value: stats.draft },
    { name: "archived", value: retos?.filter((r) => r.status === "archived").length ?? 0 },
  ].filter((d) => d.value > 0);

  const recentUsers = [...(users ?? [])]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Usuarios" value={stats.total} icon={Users} iconClass="text-primary" isLoading={loadingUsers} />
        <StatCard title="Cursos" value={courses?.length ?? 0} icon={BookOpen} iconClass="text-blue-500" isLoading={loadingCourses} />
        <StatCard title="Retos SQL" value={retos?.length ?? 0} icon={Code2} isLoading={loadingRetos} />
        <StatCard title="Publicados" value={stats.published} description={`${stats.draft} en borrador`} icon={Send} iconClass="text-emerald-500" isLoading={loadingRetos} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Usuarios por rol</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUsers ? (
              <Skeleton className="h-[180px] rounded-full mx-auto w-32" />
            ) : (
              <ChartContainer config={{}} className="h-[180px]">
                <PieChart>
                  <Pie data={roleChart} dataKey="value" nameKey="name" innerRadius={50} outerRadius={75}>
                    {roleChart.map((e, i) => (
                      <Cell key={i} fill={e.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Estado de retos</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingRetos ? (
              <Skeleton className="h-[180px]" />
            ) : retoChart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sin retos</p>
            ) : (
              <ChartContainer config={{ published: { color: "var(--color-chart-3)" } }} className="h-[180px]">
                <BarChart data={retoChart}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Bar dataKey="value" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Actividad reciente</CardTitle>
            <CardDescription>Últimos registros</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loadingUsers ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-8" />)
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className="flex justify-between text-sm">
                  <span className="truncate max-w-[160px]">{u.email}</span>
                  <span className="text-xs text-muted-foreground">
                    {u.createdAt
                      ? format(new Date(u.createdAt), "dd MMM", { locale: es })
                      : "—"}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Accesos rápidos</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { href: "/admin/users", label: "Usuarios", icon: Users },
            { href: "/admin/professors", label: "Profesores", icon: Users },
            { href: "/admin/courses", label: "Cursos", icon: BookOpen },
            { href: "/reports", label: "Reportes", icon: Send },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 rounded-lg border border-border/50 p-3 text-sm hover:bg-primary/5 transition-colors"
            >
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
              <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground" />
            </Link>
          ))}
        </CardContent>
      </Card>

      {user?.role === "ADMIN" && (
        <p className="text-xs text-muted-foreground">
          Métricas de submissions globales requieren un endpoint de analytics dedicado en el API.
        </p>
      )}
    </div>
  );
}

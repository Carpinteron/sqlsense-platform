"use client";

import Link from "next/link";
import { Users, BookOpen, Code2, Send, ArrowRight } from "lucide-react";
import { useAdminAnalytics } from "@/hooks/use-analytics";
import { useAuthStore } from "@/store/auth.store";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, Pie, PieChart, Cell, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function AdminAnalytics() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const canLoadAnalytics = Boolean(accessToken && isAuthenticated && user?.role === "ADMIN");

  const { data: analytics, isLoading, isError, error } = useAdminAnalytics(canLoadAnalytics);

  if (!canLoadAnalytics) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Resumen de administración</CardTitle>
          <CardDescription>
            Esperando sesión de administrador para cargar las métricas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Inicia sesión con una cuenta ADMIN para ver analytics globales.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardHeader>
          <CardTitle className="text-base">Resumen de administración</CardTitle>
          <CardDescription>No se pudo cargar el panel de analytics.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {(error as { message?: string } | null)?.message ||
              "Revisa la sesión y que el backend esté respondiendo en /analytics/admin-summary."}
          </p>
        </CardContent>
      </Card>
    );
  }

  const roleChart = (analytics?.usersByRole ?? []).map((item, index) => ({
    name: item.label,
    value: item.count,
    fill: ["var(--color-chart-3)", "var(--color-chart-1)", "var(--color-chart-5)"][index % 3],
  })).filter((d) => d.value > 0);

  const retoChart = (analytics?.challengesByStatus ?? [])
    .map((item, index) => ({
      name: item.label,
      value: item.count,
      fill: ["var(--color-chart-1)", "var(--color-chart-3)", "var(--color-chart-5)"][index % 3],
    }))
    .filter((d) => d.value > 0);

  const recentUsers = analytics?.recentUsers ?? [];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Usuarios" value={analytics?.totalUsers ?? 0} icon={Users} iconClass="text-primary" isLoading={isLoading} />
        <StatCard title="Cursos" value={analytics?.totalCourses ?? 0} icon={BookOpen} iconClass="text-blue-500" isLoading={isLoading} />
        <StatCard title="Retos SQL" value={analytics?.totalChallenges ?? 0} icon={Code2} isLoading={isLoading} />
        <StatCard title="Submissions" value={analytics?.totalSubmissions ?? 0} description={`${analytics?.totalEvaluations ?? 0} evaluaciones`} icon={Send} iconClass="text-emerald-500" isLoading={isLoading} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Usuarios por rol</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
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
            {isLoading ? (
              <Skeleton className="h-[180px]" />
            ) : retoChart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Sin retos</p>
            ) : (
              <ChartContainer config={{}} className="h-[180px]">
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
            {isLoading ? (
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

      <p className="text-xs text-muted-foreground">
        Resumen global servido por GET /analytics/admin-summary.
      </p>
    </div>
  );
}

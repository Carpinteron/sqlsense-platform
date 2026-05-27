"use client";

import Link from "next/link";
import {
  Users,
  BookOpen,
  Code2,
  Award,
  Database,
  ArrowRight,
  TrendingUp,
  Shield,
  GraduationCap,
} from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";

import { useAuthStore } from "@/store/auth.store";
import { useUsers } from "@/hooks/use-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// ─── Role config ─────────────────────────────────────────────────────────────

const roleConfig: Record<string, { label: string; icon: React.ElementType; color: string; badgeClass: string }> = {
  ADMIN: {
    label: "Administrador",
    icon: Shield,
    color: "text-rose-500",
    badgeClass: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  PROFESSOR: {
    label: "Profesor",
    icon: Users,
    color: "text-blue-500",
    badgeClass: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  STUDENT: {
    label: "Estudiante",
    icon: GraduationCap,
    color: "text-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  isLoading,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ElementType;
  iconClass?: string;
  isLoading?: boolean;
}) {
  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-muted/60 ${iconClass}`}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-16 mb-1" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Admin dashboard ─────────────────────────────────────────────────────────

function AdminDashboard() {
  const { data: users, isLoading } = useUsers();

  const total = users?.length ?? 0;
  const admins = users?.filter((u) => u.role === "ADMIN").length ?? 0;
  const professors = users?.filter((u) => u.role === "PROFESSOR").length ?? 0;
  const students = users?.filter((u) => u.role === "STUDENT").length ?? 0;

  const chartData = [
    { name: "Estudiantes", value: students, fill: "var(--color-chart-3)" },
    { name: "Profesores", value: professors, fill: "var(--color-chart-1)" },
    { name: "Admins", value: admins, fill: "var(--color-chart-5)" },
  ].filter((d) => d.value > 0);

  const chartConfig = {
    Estudiantes: { label: "Estudiantes", color: "var(--color-chart-3)" },
    Profesores: { label: "Profesores", color: "var(--color-chart-1)" },
    Admins: { label: "Admins", color: "var(--color-chart-5)" },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Usuarios"
          value={total}
          description="Usuarios registrados"
          icon={Users}
          iconClass="text-primary"
          isLoading={isLoading}
        />
        <StatCard
          title="Estudiantes"
          value={students}
          description={`${total ? Math.round((students / total) * 100) : 0}% del total`}
          icon={GraduationCap}
          iconClass="text-emerald-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Profesores"
          value={professors}
          description={`${total ? Math.round((professors / total) * 100) : 0}% del total`}
          icon={BookOpen}
          iconClass="text-blue-500"
          isLoading={isLoading}
        />
        <StatCard
          title="Administradores"
          value={admins}
          description="Con acceso completo"
          icon={Shield}
          iconClass="text-rose-500"
          isLoading={isLoading}
        />
      </div>

      {/* Charts + Quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pie chart */}
        <Card className="border-border/50 bg-card/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Distribución de Roles</CardTitle>
            <CardDescription>Usuarios por tipo de cuenta</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-[180px]">
                <Skeleton className="h-32 w-32 rounded-full" />
              </div>
            ) : total === 0 ? (
              <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
                Sin datos
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            )}

            {/* Legend */}
            {!isLoading && total > 0 && (
              <div className="mt-3 space-y-1.5">
                {chartData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ background: d.fill }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card className="border-border/50 bg-card/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Acciones Rápidas</CardTitle>
            <CardDescription>Gestiona la plataforma desde aquí</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {[
              {
                href: "/admin/users",
                icon: Users,
                title: "Gestionar Usuarios",
                desc: "Ver y administrar todos los usuarios",
                color: "text-primary",
              },
              {
                href: "/admin/courses",
                icon: BookOpen,
                title: "Gestionar Cursos",
                desc: "Administrar cursos de la plataforma",
                color: "text-blue-500",
              },
              {
                href: "/reports",
                icon: TrendingUp,
                title: "Ver Reportes",
                desc: "Analíticas y métricas globales",
                color: "text-emerald-500",
              },
              {
                href: "/schemas",
                icon: Database,
                title: "Esquemas SQL",
                desc: "Generar esquemas con IA",
                color: "text-violet-500",
              },
            ].map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="group flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 p-4 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <div className={`mt-0.5 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.desc}
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Professor dashboard ─────────────────────────────────────────────────────

function ProfessorDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Cursos Activos"
          value="—"
          description="Disponible próximamente"
          icon={BookOpen}
          iconClass="text-blue-500"
        />
        <StatCard
          title="Retos Creados"
          value="—"
          description="Disponible próximamente"
          icon={Code2}
          iconClass="text-primary"
        />
        <StatCard
          title="Estudiantes"
          value="—"
          description="En tus cursos"
          icon={GraduationCap}
          iconClass="text-emerald-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { href: "/courses", icon: BookOpen, title: "Mis Cursos", desc: "Ver y gestionar tus cursos", color: "text-blue-500" },
              { href: "/challenges", icon: Code2, title: "Retos SQL", desc: "Crear y revisar retos", color: "text-primary" },
              { href: "/schemas", icon: Database, title: "Esquemas y Datos", desc: "Generar con IA", color: "text-violet-500" },
              { href: "/evaluations", icon: Award, title: "Evaluaciones", desc: "Revisar resultados", color: "text-amber-500" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <a.icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 border-dashed">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">
              Actividad Reciente
            </CardTitle>
            <CardDescription>Próximamente</CardDescription>
          </CardHeader>
          <CardContent className="flex h-32 items-center justify-center text-muted-foreground/50 text-sm">
            [ Disponible con el módulo de evaluaciones ]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Student dashboard ────────────────────────────────────────────────────────

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Cursos Inscritos"
          value="—"
          description="Disponible próximamente"
          icon={BookOpen}
          iconClass="text-blue-500"
        />
        <StatCard
          title="Retos Completados"
          value="—"
          description="Disponible próximamente"
          icon={Code2}
          iconClass="text-primary"
        />
        <StatCard
          title="Evaluaciones"
          value="—"
          description="Realizadas hasta ahora"
          icon={Award}
          iconClass="text-amber-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Explora la Plataforma</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { href: "/courses", icon: BookOpen, title: "Mis Cursos", desc: "Ver cursos disponibles", color: "text-blue-500" },
              { href: "/challenges", icon: Code2, title: "Retos SQL", desc: "Practica con ejercicios", color: "text-primary" },
              { href: "/evaluations", icon: Award, title: "Evaluaciones", desc: "Revisa tus resultados", color: "text-amber-500" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-start gap-3 rounded-xl border border-border/50 bg-muted/30 p-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                <a.icon className={`mt-0.5 h-4 w-4 shrink-0 ${a.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0 mt-0.5" />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/50 border-dashed">
          <CardHeader>
            <CardTitle className="text-base text-muted-foreground">
              Mi Progreso
            </CardTitle>
            <CardDescription>Próximamente</CardDescription>
          </CardHeader>
          <CardContent className="flex h-32 items-center justify-center text-muted-foreground/50 text-sm">
            [ Disponible con el módulo de retos ]
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const config = user ? roleConfig[user.role] : null;
  const RoleIcon = config?.icon ?? Users;

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Bienvenido de vuelta
            </h1>
            {config && (
              <Badge
                variant="outline"
                className={`text-xs uppercase tracking-wider ${config.badgeClass}`}
              >
                <RoleIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-sm">
            {user?.email} &middot; Panel de control de SQLSense
          </p>
        </div>
        {user?.role !== "STUDENT" && (
          <Button asChild size="sm" variant="outline">
            <Link href={user?.role === "ADMIN" ? "/admin/users" : "/courses"}>
              {user?.role === "ADMIN" ? "Gestionar usuarios" : "Ver cursos"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      {/* Role-specific content */}
      {user?.role === "ADMIN" && <AdminDashboard />}
      {user?.role === "PROFESSOR" && <ProfessorDashboard />}
      {user?.role === "STUDENT" && <StudentDashboard />}
    </div>
  );
}

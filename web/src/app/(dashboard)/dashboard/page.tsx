"use client";

import Link from "next/link";
import {
  Users,
  BookOpen,
  Code2,
  Award,
  Database,
  ArrowRight,
  Shield,
  GraduationCap,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { useCursos } from "@/hooks/use-cursos";
import { useRetos } from "@/hooks/use-retos";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
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
  return <AdminAnalytics />;
}

// ─── Professor dashboard ─────────────────────────────────────────────────────

function ProfessorDashboard() {
  const { data: courses, isLoading: loadingCourses } = useCursos();
  const { data: retos, isLoading: loadingRetos } = useRetos();
  const published = retos?.filter((r) => r.status === "published").length ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Cursos Activos"
          value={courses?.length ?? 0}
          description="Tus cursos registrados"
          icon={BookOpen}
          iconClass="text-blue-500"
          isLoading={loadingCourses}
        />
        <StatCard
          title="Retos Creados"
          value={retos?.length ?? 0}
          description={`${published} publicados`}
          icon={Code2}
          iconClass="text-primary"
          isLoading={loadingRetos}
        />
        <StatCard
          title="Borradores"
          value={retos?.filter((r) => r.status === "draft").length ?? 0}
          description="Retos pendientes de publicar"
          icon={GraduationCap}
          iconClass="text-emerald-500"
          isLoading={loadingRetos}
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

        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Retos recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {loadingRetos ? (
              <Skeleton className="h-20" />
            ) : !retos?.length ? (
              <p className="text-sm text-muted-foreground">Sin retos aún.</p>
            ) : (
              retos.slice(0, 4).map((r) => (
                <div key={r.id} className="flex justify-between text-sm border-b border-border/30 pb-2 last:border-0">
                  <span className="font-medium truncate">{r.title}</span>
                  <span className="text-xs text-muted-foreground">{r.status}</span>
                </div>
              ))
            )}
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

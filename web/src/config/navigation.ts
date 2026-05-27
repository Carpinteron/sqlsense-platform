import {
  LayoutDashboard,
  Users,
  BookOpen,
  Database,
  Code,
  FileText,
  Settings,
  Award,
  GraduationCap,
  Sparkles,
  Terminal,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  roles: string[];
};

export const mainNavigation: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "PROFESSOR", "STUDENT"],
  },
  {
    title: "Mis Cursos",
    href: "/courses",
    icon: BookOpen,
    roles: ["PROFESSOR", "STUDENT"],
  },
  {
    title: "Gestión de Cursos",
    href: "/admin/courses",
    icon: BookOpen,
    roles: ["ADMIN"],
  },
  {
    title: "Profesores",
    href: "/admin/professors",
    icon: GraduationCap,
    roles: ["ADMIN"],
  },
  {
    title: "Retos SQL",
    href: "/challenges",
    icon: Code,
    roles: ["PROFESSOR", "STUDENT", "ADMIN"],
  },
  {
    title: "Evaluaciones",
    href: "/evaluations",
    icon: Award,
    roles: ["PROFESSOR", "STUDENT", "ADMIN"],
  },
  {
    title: "Esquemas y Datos",
    href: "/schemas",
    icon: Database,
    roles: ["PROFESSOR", "ADMIN"],
  },
  {
    title: "Reportes",
    href: "/reports",
    icon: FileText,
    roles: ["ADMIN", "PROFESSOR"],
  },
  {
    title: "Usuarios",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "SQL Workspace",
    href: "/workspace",
    icon: Terminal,
    roles: ["STUDENT"],
  },
  {
    title: "Recomendaciones IA",
    href: "/ai-recommendations",
    icon: Sparkles,
    roles: ["STUDENT", "PROFESSOR"],
  },
  {
    title: "Configuración",
    href: "/settings",
    icon: Settings,
    roles: ["ADMIN", "PROFESSOR", "STUDENT"],
  },
];

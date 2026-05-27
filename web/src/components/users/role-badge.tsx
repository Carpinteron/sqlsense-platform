import { UserRole } from "@/services/users.service";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const roleConfig: Record<UserRole, { label: string; className: string }> = {
  ADMIN: {
    label: "Admin",
    className: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  },
  PROFESSOR: {
    label: "Profesor",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
  STUDENT: {
    label: "Estudiante",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },
};

export function RoleBadge({ role }: { role: UserRole }) {
  const config = roleConfig[role];
  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs", config.className)}
    >
      {config.label}
    </Badge>
  );
}

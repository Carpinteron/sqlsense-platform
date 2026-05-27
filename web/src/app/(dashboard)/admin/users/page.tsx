import { ProtectedRoute } from "@/components/auth/protected-route";
import { UsersTable } from "@/components/users/users-table";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Administra los usuarios registrados en la plataforma.
          </p>
        </div>
        <UsersTable />
      </div>
    </ProtectedRoute>
  );
}

import { ProtectedRoute } from "@/components/auth/protected-route";

export default function WorkspaceRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute allowedRoles={["STUDENT", "ADMIN"]}>{children}</ProtectedRoute>;
}

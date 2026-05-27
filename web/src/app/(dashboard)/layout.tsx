"use client";

import { usePathname } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const fullWidth = pathname?.startsWith("/workspace");

  return (
    <ProtectedRoute>
      <DashboardLayout fullWidth={fullWidth}>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}

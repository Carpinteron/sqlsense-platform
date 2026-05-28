"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNavigation } from "@/config/navigation";
import { useAuthStore } from "@/store/auth.store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  PROFESSOR: "Profesor",
  STUDENT: "Estudiante",
};

const roleDotColors: Record<string, string> = {
  ADMIN: "bg-rose-500",
  PROFESSOR: "bg-blue-500",
  STUDENT: "bg-emerald-500",
};

export function AppSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const filteredNav = mainNavigation.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <Sidebar collapsible="icon" variant="inset">
      {/* Header / Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <Database className="h-4 w-4 text-primary" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">SQLSense</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Platform
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredNav.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer / User info */}
      <SidebarFooter>
        {user && (
          <div className="px-2 py-2">
            <div className="flex items-center gap-2.5 rounded-lg border border-border/50 bg-muted/40 px-2.5 py-2">
              {/* Avatar */}
              <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {user.email.substring(0, 2).toUpperCase()}
                <span
                  className={cn(
                    "absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-sidebar",
                    roleDotColors[user.role] ?? "bg-muted-foreground"
                  )}
                />
              </div>
              {/* Info (hidden when collapsed) */}
              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-xs font-medium">{user.email}</p>
                <p className="truncate text-[10px] text-muted-foreground">
                  {roleLabels[user.role] ?? user.role}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

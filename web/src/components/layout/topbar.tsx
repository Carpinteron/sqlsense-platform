"use client";

import { useTheme } from "next-themes";
import { LogOut, Menu, Moon, Sun, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuthStore } from "@/store/auth.store";
import { mainNavigation } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { setTheme, theme } = useTheme();
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const getInitials = (email?: string) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  const filteredNav = mainNavigation.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px]">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <SheetTitle className="text-left mb-4">Menú de Navegación</SheetTitle>
          <nav className="grid gap-2 text-lg font-medium">
            {filteredNav.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {/* Aquí se pueden añadir más niveles dinámicamente si es necesario */}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage src="" alt="Avatar" />
              <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            <span>Mi Cuenta</span>
            <span className="text-xs text-muted-foreground font-normal">
              {user?.email}
            </span>
            <span className="text-[10px] text-primary uppercase mt-1">
              {user?.role}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNavigation } from "@/config/navigation";
import { useAuthStore } from "@/store/auth.store";

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  // Filtrar links basado en el rol
  const filteredNav = mainNavigation.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <aside className="hidden w-64 flex-col border-r bg-card md:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="p-1.5 bg-primary/10 rounded-full">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg">SQLSense</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {filteredNav.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 my-1 transition-all hover:text-primary",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

"use client";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[16rem_1fr]">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto bg-muted/40 p-4 lg:p-6">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

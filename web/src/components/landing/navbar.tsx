import Link from "next/link";
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center px-4 md:px-6">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="p-1.5 bg-primary/10 rounded-xl">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <span className="hidden font-bold sm:inline-block text-xl tracking-tight">
              SQLSense
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Características
            </Link>
            <Link
              href="#preview"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Editor IA
            </Link>
            <Link
              href="#audience"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Para Quién
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile logo could go here */}
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-sm font-medium">
                Iniciar Sesión
              </Button>
            </Link>
            <Link href="/login">
              <Button className="text-sm font-medium shadow-sm">
                Comenzar Gratis
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

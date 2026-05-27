"use client";

import { useState } from "react";
import Link from "next/link";
import { Database, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "#features", label: "Características" },
  { href: "#preview", label: "Editor IA" },
  { href: "#audience", label: "Para quién" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl flex h-16 items-center px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 mr-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
            <Database className="h-4.5 w-4.5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">SQLSense</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/auth/login">Iniciar sesión</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/register">Crear cuenta</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              aria-expanded={menuOpen}
              aria-controls="landing-mobile-menu"
              onClick={() => setMenuOpen((value) => !value)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Abrir menú</span>
            </Button>

            {menuOpen && (
              <div
                id="landing-mobile-menu"
                className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-border/60 bg-background p-4 shadow-xl"
              >
                <div className="mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <span className="font-semibold">SQLSense</span>
                </div>
                <nav className="flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="mt-6 space-y-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/login" onClick={() => setMenuOpen(false)}>
                      Iniciar sesión
                    </Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/register" onClick={() => setMenuOpen(false)}>
                      Crear cuenta
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

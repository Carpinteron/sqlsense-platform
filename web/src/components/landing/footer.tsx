import Link from "next/link";
import { Database } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Producto: [
    { href: "#features", label: "Características" },
    { href: "#preview", label: "Editor SQL" },
    { href: "#audience", label: "Para la Academia" },
    { href: "/auth/register", label: "Crear cuenta" },
  ],
  Plataforma: [
    { href: "/auth/login", label: "Iniciar sesión" },
    { href: "/dashboard", label: "Panel de control" },
  ],
  Legal: [
    { href: "#", label: "Privacidad" },
    { href: "#", label: "Términos de Servicio" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-14">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <Database className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">SQLSense</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[220px]">
              La plataforma definitiva para evaluación y optimización inteligente
              de consultas SQL.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-label mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={`${title}-${link.label}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SQLSense Platform. Todos los derechos reservados.</p>
          <p>Hecho con ❤️ para la academia colombiana</p>
        </div>
      </div>
    </footer>
  );
}

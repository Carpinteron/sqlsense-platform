import Link from "next/link";
import { Database } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20 py-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <Database className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl tracking-tight">SQLSense</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              La plataforma definitiva para evaluación y optimización inteligente de consultas SQL.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Producto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#features" className="hover:text-primary transition-colors">Características</Link></li>
              <li><Link href="#preview" className="hover:text-primary transition-colors">Editor SQL</Link></li>
              <li><Link href="#audience" className="hover:text-primary transition-colors">Para la Academia</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">Privacidad</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center border-t pt-8 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} SQLSense Platform. Todos los derechos reservados.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {/* Social icons if needed */}
          </div>
        </div>
      </div>
    </footer>
  );
}

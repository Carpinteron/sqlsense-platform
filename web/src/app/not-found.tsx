import Link from "next/link";
import { Database, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Brand icon */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Database className="h-7 w-7 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">SQLSense</span>
        </div>

        {/* 404 */}
        <div className="space-y-2">
          <p className="text-label">Error 404</p>
          <h1 className="text-5xl font-extrabold tracking-tight text-foreground">
            Página no encontrada
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            La página que buscas no existe o ha sido movida. Vuelve al inicio para continuar.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Ir al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Panel de control
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

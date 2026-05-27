import Link from "next/link";
import { Database, ShieldOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
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

        {/* 403 */}
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
          <ShieldOff className="h-10 w-10 text-destructive" />
        </div>

        <div className="space-y-2">
          <p className="text-label">Error 403</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Acceso no autorizado
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            No tienes permisos para acceder a esta página. Si crees que es un
            error, contacta al administrador.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Button asChild size="lg">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al panel
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

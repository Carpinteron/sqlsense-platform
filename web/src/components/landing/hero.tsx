import Link from "next/link";
import { ArrowRight, Code2, Sparkles, Play, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const highlights = [
  "Feedback en tiempo real",
  "Sandbox Docker aislado",
  "Recomendaciones IA",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-36 md:pb-48">
      {/* Radial gradient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 h-[600px] w-[900px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-indigo-500/10 blur-[80px]" />
        <div className="absolute right-1/4 top-1/3 h-[250px] w-[250px] rounded-full bg-violet-500/10 blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.94 0.008 265 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.94 0.008 265 / 0.04) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-5xl px-4 md:px-6 text-center">
        {/* Pill badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm">
          <Sparkles className="h-4 w-4" />
          Evaluador SQL impulsado por Inteligencia Artificial
        </div>

        {/* Headline */}
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl mb-6 leading-[1.1]">
          Aprende, practica y
          <br className="hidden md:block" />
          <span className="bg-gradient-to-r from-primary via-indigo-400 to-violet-500 bg-clip-text text-transparent">
            {" "}domina el SQL
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl mb-10 leading-relaxed">
          Plataforma educativa que evalúa consultas SQL automáticamente, otorga
          feedback IA instantáneo y genera entornos de base de datos completos
          para profesores y estudiantes.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-14">
          <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25">
            <Link href="/auth/register">
              Empieza gratis
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
            <Link href="/auth/login">
              <Play className="mr-2 h-4 w-4" />
              Ver demo
            </Link>
          </Button>
        </div>

        {/* Highlights */}
        <div className="flex flex-wrap justify-center items-center gap-6">
          {highlights.map((h) => (
            <div key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-primary/70 shrink-0" />
              {h}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

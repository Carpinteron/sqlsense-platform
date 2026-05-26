import Link from "next/link";
import { ArrowRight, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background pt-24 pb-32 md:pt-32 md:pb-40">
      {/* Background Gradients inspired by modern SaaS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-indigo-500 to-purple-500 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <div className="container relative z-10 mx-auto max-w-5xl px-4 md:px-6 text-center">
        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 shadow-sm backdrop-blur-sm">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Evaluador SQL impulsado por Inteligencia Artificial</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight">
          Aprende y Optimiza <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
            tu código SQL
          </span>
        </h1>

        <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
          Plataforma educativa para evaluar consultas SQL automáticamente. Obtén feedback en tiempo real, recomendaciones de índices y optimización de rendimiento con nuestra IA.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
              Prueba el Editor
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50 backdrop-blur-sm">
              <Code2 className="mr-2 h-4 w-4" />
              Ver Características
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

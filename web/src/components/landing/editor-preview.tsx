import { CheckCircle2, Play, Terminal, Zap, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function EditorPreview() {
  return (
    <section id="preview" className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-16">
          <p className="text-label mb-3">Editor inteligente</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            Escribe. Ejecuta. Aprende.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Nuestro editor SQL integrado evalúa tus consultas en entornos
            aislados y entrega retroalimentación instantánea de nuestra IA.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Mock SQL Editor */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0d1117]">
            {/* Titlebar */}
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#161b22]">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto flex items-center gap-2 text-xs font-medium text-slate-500">
                <Terminal className="h-3 w-3" />
                query.sql
              </div>
              <Badge
                variant="outline"
                className="text-[10px] border-slate-700 text-slate-500"
              >
                PostgreSQL 16
              </Badge>
            </div>

            {/* Code */}
            <div className="p-6 font-mono text-sm leading-7 text-slate-300 select-none">
              {[
                <>
                  <span className="text-blue-400 font-bold">SELECT</span>{" "}
                  <span className="text-purple-400">c.name</span>,{" "}
                  <span className="text-blue-400 font-bold">COUNT</span>
                  (o.id){" "}
                  <span className="text-blue-400 font-bold">AS</span>{" "}
                  <span className="text-purple-400">total_orders</span>
                </>,
                <>
                  <span className="text-blue-400 font-bold">FROM</span>{" "}
                  <span className="text-emerald-400">customers</span>{" "}
                  <span className="text-purple-400">c</span>
                </>,
                <>
                  <span className="text-blue-400 font-bold">JOIN</span>{" "}
                  <span className="text-emerald-400">orders</span>{" "}
                  <span className="text-purple-400">o</span>{" "}
                  <span className="text-blue-400 font-bold">ON</span>{" "}
                  c.id = o.customer_id
                </>,
                <>
                  <span className="text-blue-400 font-bold">WHERE</span>{" "}
                  c.city ={" "}
                  <span className="text-amber-300">&apos;Bogotá&apos;</span>
                </>,
                <>
                  <span className="text-blue-400 font-bold">GROUP BY</span>{" "}
                  c.name
                </>,
                <>
                  <span className="text-blue-400 font-bold">ORDER BY</span>{" "}
                  total_orders{" "}
                  <span className="text-blue-400 font-bold">DESC</span>;
                </>,
              ].map((line, i) => (
                <div key={i} className="flex">
                  <span className="text-slate-600 mr-4 w-4 shrink-0 text-right">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 bg-[#161b22] px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                6 líneas &middot; Sin errores
              </span>
              <button className="flex items-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1.5 transition-colors">
                <Play className="h-3 w-3" />
                Ejecutar
              </button>
            </div>
          </div>

          {/* AI Feedback */}
          <div className="lg:col-span-2 space-y-4">
            {/* Correct result */}
            <div className="relative rounded-xl border border-border bg-card p-5 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500 rounded-l-xl" />
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Resultado correcto</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Retorna los datos esperados &middot; 120 ms
                  </p>
                  <div className="mt-3 rounded-lg bg-muted/60 border text-xs font-mono p-3 text-muted-foreground">
                    <div className="flex gap-4 font-semibold text-foreground border-b border-border pb-1 mb-1">
                      <span className="w-28">name</span>
                      <span>total_orders</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-28">Juan García</span>
                      <span>47</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="w-28">María López</span>
                      <span>38</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI suggestion */}
            <div className="relative rounded-xl border border-primary/20 bg-primary/5 p-5 shadow-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-xl" />
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Sugerencia de IA</h4>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    La consulta funciona, pero un{" "}
                    <strong className="text-foreground">índice</strong> en{" "}
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      customers.city
                    </code>{" "}
                    reduciría el tiempo de respuesta un ~80%.
                  </p>
                  <div className="mt-3 rounded-lg bg-[#0d1117] border border-white/10 p-3 text-xs font-mono text-slate-300">
                    <span className="text-blue-400 font-bold">CREATE INDEX</span>{" "}
                    idx_customers_city{" "}
                    <span className="text-blue-400 font-bold">ON</span>{" "}
                    <span className="text-emerald-400">customers</span>(city);
                  </div>
                </div>
              </div>
            </div>

            {/* DB Schema hint */}
            <div className="relative rounded-xl border border-border bg-card/50 p-5 shadow-sm overflow-hidden">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10">
                  <Database className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold">Contexto del Schema</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    3 tablas detectadas &middot; 2 relaciones &middot; PostgreSQL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

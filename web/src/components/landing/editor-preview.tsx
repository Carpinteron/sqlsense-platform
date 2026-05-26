import { CheckCircle2, Play, Terminal, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EditorPreview() {
  return (
    <section id="preview" className="py-24 bg-muted/30">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Editor SQL Inteligente
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Escribe tus consultas, ejecútalas en entornos aislados y recibe retroalimentación al instante.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Fake Editor */}
          <Card className="lg:col-span-3 border-border/50 shadow-2xl overflow-hidden bg-[#0d1117] text-slate-300">
            <div className="flex items-center px-4 py-3 border-b border-white/10 bg-[#161b22]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto flex items-center text-xs font-medium text-slate-500">
                <Terminal className="w-3 h-3 mr-2" />
                query.sql
              </div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="flex">
                <span className="text-slate-600 mr-4 select-none">1</span>
                <span>
                  <span className="text-blue-400 font-semibold">SELECT</span>{" "}
                  <span className="text-purple-400">c.name</span>,{" "}
                  <span className="text-blue-400 font-semibold">COUNT</span>(o.id){" "}
                  <span className="text-blue-400 font-semibold">AS</span> total
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-600 mr-4 select-none">2</span>
                <span>
                  <span className="text-blue-400 font-semibold">FROM</span>{" "}
                  <span className="text-emerald-400">customers</span> c
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-600 mr-4 select-none">3</span>
                <span>
                  <span className="text-blue-400 font-semibold">JOIN</span>{" "}
                  <span className="text-emerald-400">orders</span> o{" "}
                  <span className="text-blue-400 font-semibold">ON</span> c.id =
                  o.customer_id
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-600 mr-4 select-none">4</span>
                <span>
                  <span className="text-blue-400 font-semibold">WHERE</span>{" "}
                  c.city = <span className="text-amber-300">'Bogotá'</span>
                </span>
              </div>
              <div className="flex">
                <span className="text-slate-600 mr-4 select-none">5</span>
                <span>
                  <span className="text-blue-400 font-semibold">GROUP BY</span>{" "}
                  c.name;
                </span>
              </div>
            </div>
            <div className="border-t border-white/10 bg-[#161b22] px-4 py-3 flex justify-between items-center">
              <span className="text-xs text-slate-500">PostgreSQL 16.0</span>
              <button className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-md transition-colors">
                <Play className="w-3 h-3 mr-1.5" />
                Ejecutar Consulta
              </button>
            </div>
          </Card>

          {/* AI Feedback Preview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-xl border bg-card shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-green-500/10 p-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">Resultado Correcto</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    La consulta retorna los datos esperados. Tiempo: 120ms.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border bg-primary/5 border-primary/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex items-start gap-3">
                <div className="mt-0.5 bg-primary/20 p-1 rounded-full">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Sugerencia de IA</h4>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    La consulta funciona bien, pero usar un <strong>índice</strong> en{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">customers.city</code>{" "}
                    mejoraría el rendimiento del filtro `WHERE`.
                  </p>
                  <div className="mt-3 p-2 bg-muted/50 rounded text-xs font-mono text-muted-foreground border">
                    CREATE INDEX idx_city ON customers(city);
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  GraduationCap,
  Users,
  Lightbulb,
  Database,
  Code2,
  Zap,
  ShieldCheck,
  BarChart3,
  Award,
} from "lucide-react";

const audience = [
  {
    title: "Para Profesores",
    description:
      "Gestiona cursos, crea retos SQL con datos aleatorios automatizados y evalúa a tus estudiantes con calificación automática.",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-500/10 ring-blue-500/20",
    benefits: [
      { icon: Database, text: "Generador de Datos Mock con IA" },
      { icon: Code2, text: "Gestión de Esquemas SQL" },
      { icon: Award, text: "Calificación Automática" },
    ],
  },
  {
    title: "Para Estudiantes",
    description:
      "Practica con entornos de bases de datos aislados y recibe retroalimentación en tiempo real para mejorar tu SQL.",
    icon: GraduationCap,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 ring-emerald-500/20",
    benefits: [
      { icon: ShieldCheck, text: "Sandbox Seguro (Docker)" },
      { icon: BarChart3, text: "Métricas de Rendimiento" },
      { icon: Zap, text: "Feedback Instantáneo" },
    ],
  },
  {
    title: "Asistente IA",
    description:
      "No solo te dice si está mal. Te explica el porqué, sugiere índices y propone mejores prácticas arquitectónicas.",
    icon: Lightbulb,
    color: "text-violet-500",
    bg: "bg-violet-500/10 ring-violet-500/20",
    benefits: [
      { icon: BarChart3, text: "Análisis de Rendimiento" },
      { icon: Database, text: "Sugerencia de Índices" },
      { icon: Code2, text: "Reescritura Optimizada" },
    ],
  },
];

export function Features() {
  return (
    <section id="audience" className="py-24 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-16">
          <p className="text-label mb-3">Diseñado para la academia</p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
            Una plataforma para cada rol
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            SQLSense automatiza el tedio de crear y evaluar pruebas de bases de
            datos, permitiendo enfocarse en la calidad de la enseñanza.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {audience.map((item) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-border/50 bg-card/50 p-6 shadow-sm hover:shadow-lg hover:border-border transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Icon */}
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${item.bg}`}
              >
                <item.icon className={`h-6 w-6 ${item.color}`} />
              </div>

              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {item.description}
              </p>

              <ul className="space-y-2.5">
                {item.benefits.map((b) => (
                  <li key={b.text} className="flex items-center gap-2.5 text-sm">
                    <b.icon className={`h-4 w-4 shrink-0 ${item.color}`} />
                    <span className="text-muted-foreground">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

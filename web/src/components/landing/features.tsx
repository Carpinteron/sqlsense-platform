import { GraduationCap, Users, Lightbulb, Activity, Database, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
  const features = [
    {
      title: "Para Profesores",
      description: "Gestiona cursos, crea retos SQL con datos aleatorios automatizados y evalúa a tus estudiantes sin esfuerzo.",
      icon: Users,
      benefits: ["Generador de Datos Mock", "Gestión de Esquemas", "Calificación Automática"]
    },
    {
      title: "Para Estudiantes",
      description: "Practica con entornos de bases de datos aislados y recibe retroalimentación en tiempo real para mejorar tu SQL.",
      icon: GraduationCap,
      benefits: ["Sandbox Seguro (Docker)", "Métricas de Rendimiento", "Historial de Intentos"]
    },
    {
      title: "Asistente IA",
      description: "No solo te dice si está mal. Te explica el por qué, te sugiere índices y mejores prácticas arquitectónicas.",
      icon: Lightbulb,
      benefits: ["Análisis de Rendimiento", "Sugerencia de Índices", "Reescritura Optimizada"]
    }
  ];

  return (
    <section id="audience" className="py-24 bg-background">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Diseñado para la academia moderna
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            SQLSense automatiza el tedio de crear y evaluar pruebas de bases de datos, permitiendo enfocarse en la calidad de la enseñanza.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm mt-2 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center text-sm font-medium text-muted-foreground">
                      <CheckCircle className="w-4 h-4 mr-2 text-primary/70" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, Eye, EyeOff, ArrowRight, GraduationCap, Users } from "lucide-react";
import { toast } from "sonner";

import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z
    .string()
    .min(6, { message: "Mínimo 6 caracteres" })
    .max(64, { message: "Máximo 64 caracteres" }),
  role: z.enum(["PROFESSOR", "STUDENT"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const roleOptions = [
  {
    value: "STUDENT" as const,
    label: "Estudiante",
    description: "Practica SQL y completa retos",
    icon: GraduationCap,
  },
  {
    value: "PROFESSOR" as const,
    label: "Profesor",
    description: "Crea cursos y evalúa estudiantes",
    icon: Users,
  },
];

export function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", role: "STUDENT" },
  });

  async function onSubmit(data: RegisterFormValues) {
    try {
      setIsLoading(true);
      await authService.register(data);
      toast.success("Cuenta creada. ¡Inicia sesión para continuar!");
      router.push("/auth/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Error al crear la cuenta. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  }

  const selectedRole = form.watch("role");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel */}
      <div className="relative hidden lg:flex flex-col items-start justify-between bg-card border-r border-border p-10 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-1/3 left-0 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[80px]" />
        </div>

        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">SQLSense</span>
        </Link>

        <div className="relative space-y-6 max-w-xs">
          <h2 className="text-xl font-semibold">
            Únete a miles de estudiantes y profesores que ya usan SQLSense
          </h2>
          <div className="space-y-3">
            {[
              "Entornos SQL aislados con Docker",
              "Feedback inmediato con IA",
              "Generación automática de datos mock",
              "Análisis de rendimiento de consultas",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <Link href="/" className="flex lg:hidden items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Database className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">SQLSense</span>
          </Link>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight">Crear cuenta</h1>
            <p className="text-sm text-muted-foreground">
              Completa tus datos para empezar a usar la plataforma
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Role selector */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de cuenta</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      {roleOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => field.onChange(option.value)}
                          className={cn(
                            "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all",
                            selectedRole === option.value
                              ? "border-primary bg-primary/10 ring-1 ring-primary/20"
                              : "border-border hover:border-primary/30 hover:bg-muted/50"
                          )}
                        >
                          <option.icon
                            className={cn(
                              "h-5 w-5 mb-1",
                              selectedRole === option.value
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          />
                          <span className="text-sm font-semibold">
                            {option.label}
                          </span>
                          <span className="text-xs text-muted-foreground leading-tight">
                            {option.description}
                          </span>
                        </button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="tu@universidad.edu"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          autoComplete="new-password"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Mínimo 6 caracteres
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? (
                  "Creando cuenta..."
                ) : (
                  <>
                    Crear cuenta
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">o</span>
              <Separator className="flex-1" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Database, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email({ message: "Correo electrónico inválido" }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  redirectPath?: string;
};

export function LoginForm({ redirectPath }: LoginFormProps) {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      await login(data);
      toast.success("¡Bienvenido de vuelta!");
      router.push(redirectPath || "/dashboard");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Credenciales incorrectas. Inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left panel – brand */}
      <div className="relative hidden lg:flex flex-col items-start justify-between bg-card border-r border-border p-10 overflow-hidden">
        {/* Background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute top-1/3 right-0 h-[300px] w-[300px] rounded-full bg-violet-500/10 blur-[80px]" />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Database className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-xl tracking-tight">SQLSense</span>
        </Link>

        {/* Quote */}
        <div className="relative space-y-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <blockquote className="text-xl font-medium leading-relaxed text-foreground max-w-xs">
            &ldquo;Evalúa, aprende y optimiza tus consultas SQL con el poder de
            la inteligencia artificial.&rdquo;
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Plataforma educativa de SQL
          </p>
        </div>
      </div>

      {/* Right panel – form */}
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
            <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@sqlsense.com"
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
                          placeholder="••••••"
                          autoComplete="current-password"
                          className="pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
                  "Ingresando..."
                ) : (
                  <>
                    Ingresar
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
              ¿No tienes cuenta?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Credenciales de demo</p>
            <p>Email: <span className="font-mono">admin@sqlsense.com</span></p>
            <p>Contraseña: <span className="font-mono">123456</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}

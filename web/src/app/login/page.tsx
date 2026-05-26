import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";

type LoginPageProps = {
  searchParams?: Promise<{ redirect?: string } | undefined>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectPath = resolvedSearchParams?.redirect;

  return (
    <Suspense fallback={null}>
      <LoginForm redirectPath={redirectPath} />
    </Suspense>
  );
}

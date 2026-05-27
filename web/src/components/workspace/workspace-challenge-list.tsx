"use client";

import Link from "next/link";
import { Code2, ArrowRight, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { useRetos } from "@/hooks/use-retos";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DifficultyBadge } from "@/components/shared/challenge-badges";
import { EmptyState } from "@/components/ui/empty-state";

export function WorkspaceChallengeList() {
  const { data: retos, isLoading } = useRetos();
  const [search, setSearch] = useState("");

  const published = useMemo(() => {
    if (!retos) return [];
    return retos
      .filter((r) => r.status === "published")
      .filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.description.toLowerCase().includes(search.toLowerCase()),
      );
  }, [retos, search]);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar retos…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!published.length ? (
        <Card className="border-border/50">
          <EmptyState
            icon={Code2}
            title="No hay retos publicados"
            description="Cuando tu profesor publique retos, aparecerán aquí."
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {published.map((reto) => (
            <Card
              key={reto.id}
              className="border-border/50 bg-card/50 p-5 flex flex-col hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {reto.title}
                </h3>
                <DifficultyBadge difficulty={reto.difficulty} />
              </div>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2 flex-1">
                {reto.description}
              </p>
              <Button asChild size="sm" className="mt-4 w-full sm:w-auto">
                <Link href={`/workspace/${reto.id}`}>
                  Abrir workspace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

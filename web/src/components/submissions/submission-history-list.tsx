"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Submission } from "@/types/domain";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SubmissionHistoryList({
  submissions,
  isLoading,
  selectedId,
  onSelect,
  challengeId,
}: {
  submissions?: Submission[];
  isLoading?: boolean;
  selectedId?: string;
  onSelect?: (s: Submission) => void;
  challengeId?: string;
}) {
  const filtered = challengeId
    ? submissions?.filter((s) => s.challengeId === challengeId)
    : submissions;

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!filtered?.length) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        Sin envíos previos.
      </p>
    );
  }

  return (
    <ul className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
      {[...filtered]
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
        )
        .map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect?.(s)}
              className={cn(
                "w-full text-left rounded-lg border border-border/50 p-3 transition-all hover:bg-muted/40",
                selectedId === s.id && "ring-1 ring-primary/40 bg-primary/5",
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <SubmissionStatusBadge status={s.status} />
                {s.score != null && (
                  <span className="text-xs font-medium">{s.score}/5</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground font-mono truncate">
                {s.query.slice(0, 60)}…
              </p>
              {s.createdAt && (
                <p className="text-[10px] text-muted-foreground/70 mt-1">
                  {format(new Date(s.createdAt), "dd MMM yyyy HH:mm", { locale: es })}
                </p>
              )}
            </button>
          </li>
        ))}
    </ul>
  );
}

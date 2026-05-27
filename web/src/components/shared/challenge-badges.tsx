import { Badge } from "@/components/ui/badge";
import type { ChallengeDifficulty, ChallengeStatus } from "@/types/domain";
import { cn } from "@/lib/utils";

const difficultyStyles: Record<ChallengeDifficulty, string> = {
  Easy: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Hard: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const statusStyles: Record<ChallengeStatus, string> = {
  draft: "bg-muted text-muted-foreground border-border",
  published: "bg-primary/10 text-primary border-primary/20",
  archived: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

const statusLabels: Record<ChallengeStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
};

export function DifficultyBadge({ difficulty }: { difficulty?: ChallengeDifficulty }) {
  if (!difficulty) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <Badge variant="outline" className={cn("text-xs", difficultyStyles[difficulty])}>
      {difficulty}
    </Badge>
  );
}

export function ChallengeStatusBadge({ status }: { status?: ChallengeStatus }) {
  if (!status) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <Badge variant="outline" className={cn("text-xs", statusStyles[status])}>
      {statusLabels[status]}
    </Badge>
  );
}

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SUBMISSION_STATUS_CONFIG } from "@/lib/submission-utils";
import type { SubmissionStatus } from "@/types/domain";
import { cn } from "@/lib/utils";
import { isSubmissionPending } from "@/hooks/use-submissions";

export function SubmissionStatusBadge({
  status,
  className,
}: {
  status: SubmissionStatus;
  className?: string;
}) {
  const cfg = SUBMISSION_STATUS_CONFIG[status];
  const pending = isSubmissionPending(status);

  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium gap-1.5",
        cfg.bg,
        cfg.color,
        cfg.border,
        className,
      )}
    >
      {pending && <Loader2 className="h-3 w-3 animate-spin" />}
      {cfg.label}
    </Badge>
  );
}

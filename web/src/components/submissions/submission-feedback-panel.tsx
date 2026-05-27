"use client";

import { Clock, Star, MessageSquare } from "lucide-react";
import type { Submission } from "@/types/domain";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function SubmissionFeedbackPanel({
  submission,
  className,
}: {
  submission: Submission | null;
  className?: string;
}) {
  if (!submission) return null;

  const scorePercent = submission.score != null ? Math.min(100, submission.score * 20) : 0;

  return (
    <Card
      className={cn(
        "border-border/50 bg-card/80 animate-in fade-in slide-in-from-bottom-2 duration-300",
        className,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-sm font-medium">Resultado de evaluación</CardTitle>
          <SubmissionStatusBadge status={submission.status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {submission.score != null && (
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Star className="h-3.5 w-3.5" /> Score
              </div>
              <p className="text-lg font-bold">{submission.score}/5</p>
              <Progress value={scorePercent} className="h-1 mt-2" />
            </div>
          )}
          {submission.executionTimeMs != null && (
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Clock className="h-3.5 w-3.5" /> Tiempo
              </div>
              <p className="text-lg font-bold">{submission.executionTimeMs}ms</p>
            </div>
          )}
        </div>

        {submission.feedback && (
          <div className="rounded-lg border border-border/50 bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <MessageSquare className="h-3.5 w-3.5" />
              Feedback
            </div>
            <pre className="text-sm whitespace-pre-wrap font-sans text-foreground/90 leading-relaxed">
              {submission.feedback}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

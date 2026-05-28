"use client";

import { use } from "react";
import { SqlChallengeWorkspace } from "@/components/workspace/sql-challenge-workspace";

export default function WorkspaceChallengePage({
  params,
}: {
  params: Promise<{ challengeId: string }>;
}) {
  const { challengeId } = use(params);
  return <SqlChallengeWorkspace challengeId={challengeId} />;
}

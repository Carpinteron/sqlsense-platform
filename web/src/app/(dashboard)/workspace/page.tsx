import { PageHeader } from "@/components/shared/page-header";
import { WorkspaceChallengeList } from "@/components/workspace/workspace-challenge-list";

export default function WorkspacePage() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <PageHeader
        title="SQL Workspace"
        description="Selecciona un reto y practica con el editor tipo LeetCode / DataGrip."
      />
      <WorkspaceChallengeList />
    </div>
  );
}

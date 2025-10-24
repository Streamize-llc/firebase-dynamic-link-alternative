import { notFound } from "next/navigation";
import { getWorkspace, getWorkspaceDeeplinks, getWorkspaceStats } from "@/utils/action/server";
import WorkspaceDashboardClient from "./WorkspaceDashboardClient";

interface WorkspaceDashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function WorkspaceDashboardPage({ params }: WorkspaceDashboardPageProps) {
  const { id } = await params;

  try {
    const [workspace, manualLinks, apiLinks, stats] = await Promise.all([
      getWorkspace(id),
      getWorkspaceDeeplinks(id, 'UI'),      // Manual - 전체 조회
      getWorkspaceDeeplinks(id, 'API', 10), // API - 최근 10개만
      getWorkspaceStats(id),
    ]);

    return (
      <WorkspaceDashboardClient
        workspace={workspace}
        manualLinks={manualLinks}
        apiLinks={apiLinks}
        stats={stats}
      />
    );
  } catch (error) {
    console.error("Error loading workspace:", error);
    notFound();
  }
}

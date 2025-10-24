import { getWorkspaces } from "@/utils/action/server";
import WorkspaceListClient from "./WorkspaceListClient";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const workspaces = await getWorkspaces();

  // 워크스페이스가 없으면 생성 페이지로 리디렉션
  if (!workspaces || workspaces.length === 0) {
    // TODO: 워크스페이스 생성 페이지로 리디렉션
    return <div>워크스페이스가 없습니다</div>;
  }

  return <WorkspaceListClient workspaces={workspaces} />;
}

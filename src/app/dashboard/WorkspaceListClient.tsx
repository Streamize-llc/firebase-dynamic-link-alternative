"use client"

import { Button } from "@/components/ui/button";
import { Link2, Plus, LogOut, Globe, ExternalLink, Link as LinkIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase/provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CreateWorkspaceModal from "@/components/modal/CreateWorkspaceModal";

interface WorkspaceListClientProps {
  workspaces: any[];
}

export default function WorkspaceListClient({ workspaces }: WorkspaceListClientProps) {
  const [mounted, setMounted] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.push('/test');
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white tracking-tight font-space-grotesk">
              DEPL
            </Link>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-white text-black hover:bg-gray-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Workspace
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
          {/* Page Header */}
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-medium tracking-tight text-white mb-6">
              Workspaces
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              Select a workspace to manage your deep links
            </p>
          </div>

          {/* Workspaces Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Create New Workspace Card */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="group relative bg-white/5 border-2 border-dashed border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all backdrop-blur-sm"
            >
              <div className="flex flex-col items-center justify-center min-h-[240px]">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-4 group-hover:bg-white/10 transition-all">
                  <Plus className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-300 group-hover:text-white transition-colors">
                  Create Workspace
                </h3>
                <p className="text-sm text-gray-500 mt-2">Add a new workspace</p>
              </div>
            </button>

            {workspaces.map((workspace) => (
              <Link
                key={workspace.id}
                href={`/dashboard/${workspace.id}`}
                className="group relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.07] hover:border-white/20 transition-all backdrop-blur-sm"
              >
                <div className="flex flex-col h-full min-h-[240px]">
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>

                  {/* Workspace Info */}
                  <div className="mb-auto">
                    <h3 className="text-xl font-medium text-white mb-2">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{workspace.description}</p>
                    )}

                    {/* Domain */}
                    <div className="inline-block px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                      <span className="text-sm text-gray-400 font-mono">{workspace.sub_domain}.depl.link</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm pt-4 border-t border-white/10 mt-4">
                    <div>
                      <span className="text-gray-500">Links </span>
                      <span className="text-white font-medium">
                        {workspace.current_monthly_create_count || 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Clicks </span>
                      <span className="text-white font-medium">
                        {workspace.current_monthly_click_count?.toLocaleString() || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Create Workspace Modal */}
      <CreateWorkspaceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}

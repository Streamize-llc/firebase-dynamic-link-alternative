"use client"

import { Button } from "@/components/ui/button";
import { Link2, Plus, BarChart3, MousePointerClick, ExternalLink, ChevronDown, LogOut, Copy, TrendingUp, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase/provider";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface AllDeepLinksClientProps {
  workspaces: any[];
  deeplinks: any[];
  stats: {
    totalLinks: number;
    totalClicks: number;
    avgPerLink: number;
  };
}

export default function AllDeepLinksClient({ workspaces, deeplinks, stats }: AllDeepLinksClientProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.push('/test');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 선택된 워크스페이스에 따라 딥링크 필터링
  const filteredDeeplinks = selectedWorkspace
    ? deeplinks.filter(link => link.workspace_id === selectedWorkspace)
    : deeplinks;

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02]"
             style={{
               backgroundImage: `linear-gradient(rgba(156,163,175,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(156,163,175,0.1) 1px, transparent 1px)`,
               backgroundSize: '60px 60px'
             }}>
        </div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-gray-800/30 bg-gray-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Workspace Selector */}
            <div className="flex items-center space-x-4 sm:space-x-6">
              {/* Logo */}
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-lg blur-md"></div>
                  <div className="relative w-8 h-8 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center border border-gray-700/50">
                    <Link2 className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
                <span className="text-xl font-semibold text-gray-100 hidden sm:block">DEPL</span>
              </Link>

              {/* Workspace Selector */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-gray-100 border border-gray-800 hover:border-gray-700 px-3 sm:px-4"
                  onClick={() => setShowWorkspaceDropdown(!showWorkspaceDropdown)}
                >
                  <span className="text-sm">
                    {selectedWorkspace
                      ? workspaces.find(w => w.id === selectedWorkspace)?.name
                      : 'All Workspaces'}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>

                {/* Dropdown */}
                {showWorkspaceDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                    <div className="p-2">
                      <button
                        className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedWorkspace(null);
                          setShowWorkspaceDropdown(false);
                        }}
                      >
                        All Workspaces
                      </button>
                      {workspaces.map((workspace) => (
                        <button
                          key={workspace.id}
                          className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-between"
                          onClick={() => {
                            router.push(`/dashboard/${workspace.id}`);
                          }}
                        >
                          <span>{workspace.name}</span>
                          <span className="text-xs text-gray-500">{workspace.sub_domain}.depl.link</span>
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-gray-800 p-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-purple-400 hover:bg-gray-800 rounded-lg transition-colors flex items-center">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Workspace
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                className="text-gray-400 hover:text-gray-200"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 sm:px-6 py-8 md:py-12 max-w-7xl">
        {/* Page Header */}
        <div className={`mb-8 md:mb-12 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h1 className="text-3xl md:text-4xl font-light text-gray-100 mb-2">All Deep Links</h1>
          <p className="text-gray-400 font-light">Monitor all your deep links across workspaces</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {/* Total Workspaces */}
          <div className={`group relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 p-6 hover:border-gray-700/60 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl flex items-center justify-center">
                  <Globe className="w-6 h-6 text-purple-400" />
                </div>
              </div>
              <div className="text-4xl font-light text-gray-100 mb-2">{workspaces.length}</div>
              <div className="text-sm text-gray-400">Workspaces</div>
            </div>
          </div>

          {/* Total Links */}
          <div className={`group relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 p-6 hover:border-gray-700/60 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-indigo-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div className="text-4xl font-light text-gray-100 mb-2">{stats.totalLinks}</div>
              <div className="text-sm text-gray-400">Deep Links</div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className={`group relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 p-6 hover:border-gray-700/60 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl flex items-center justify-center">
                  <MousePointerClick className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="text-4xl font-light text-gray-100 mb-2">{stats.totalClicks.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Total Clicks</div>
            </div>
          </div>

          {/* Avg Click Rate */}
          <div className={`group relative bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 p-6 hover:border-gray-700/60 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 to-amber-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-orange-400" />
                </div>
              </div>
              <div className="text-4xl font-light text-gray-100 mb-2">{stats.avgPerLink.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Avg per Link</div>
            </div>
          </div>
        </div>

        {/* Deep Links Table */}
        <div className={`bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/40 overflow-hidden transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="p-6 md:p-8 border-b border-gray-800/40 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-light text-gray-100">All Deep Links</h2>
              <p className="text-sm text-gray-400 mt-1">Manage and track your deep links</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/20">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Workspace</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Deep Link</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">URL</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Clicks</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/40">
                {filteredDeeplinks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      딥링크가 없습니다
                    </td>
                  </tr>
                ) : (
                  filteredDeeplinks.map((link) => {
                    const workspace = link.workspaces;
                    const url = `${workspace?.sub_domain}.depl.link/${link.slug}`;

                    return (
                      <tr key={link.slug} className="hover:bg-gray-800/20 transition-all group">
                        <td className="px-6 py-5">
                          <Link
                            href={`/dashboard/${link.workspace_id}`}
                            className="text-sm text-gray-400 hover:text-purple-400 transition-colors"
                          >
                            {workspace?.name}
                          </Link>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all">
                              <Link2 className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <code className="text-sm font-mono text-gray-100 group-hover:text-purple-400 transition-colors">/{link.slug}</code>
                              <div className="text-xs text-gray-500 mt-0.5 md:hidden">{url}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden md:table-cell">
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-400 font-mono">{url}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => copyToClipboard(url)}
                            >
                              <Copy className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                            </Button>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              <MousePointerClick className="w-4 h-4 text-blue-400" />
                              <span className="text-sm font-medium text-blue-400">{link.click_count.toLocaleString()}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 hidden lg:table-cell">
                          <span className="text-sm text-gray-500">{formatDate(link.created_at)}</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                              onClick={() => window.open(`https://${url}`, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

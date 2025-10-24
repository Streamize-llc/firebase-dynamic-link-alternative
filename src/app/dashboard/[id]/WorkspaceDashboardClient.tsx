"use client"

import { Button } from "@/components/ui/button";
import { Link2, Plus, BarChart3, MousePointerClick, ExternalLink, LogOut, Copy, TrendingUp, Globe, Settings, Smartphone, Code, Hand, Check, BookOpen, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useSupabase } from "@/utils/supabase/provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ConnectIOSAppModal from "@/components/modal/ConnectIOSAppModal";
import ConnectAndroidAppModal from "@/components/modal/ConnectAndroidAppModal";
import CreateDeeplinkModal from "@/components/modal/CreateDeeplinkModal";
import { Space_Grotesk } from "next/font/google";
import { toast } from "sonner";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['600', '700']
});

interface WorkspaceDashboardClientProps {
  workspace: any;
  manualLinks: any[];
  apiLinks: any[];
  stats: {
    totalLinks: number;
    totalClicks: number;
    clicksToday: number;
    avgPerLink: number;
  };
}

export default function WorkspaceDashboardClient({ workspace, manualLinks, apiLinks, stats }: WorkspaceDashboardClientProps) {
  const [mounted, setMounted] = useState(false);
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("ui");
  const [copiedClientKey, setCopiedClientKey] = useState(false);
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const { supabase } = useSupabase();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    // Get user email for contact link
    const getUserEmail = async () => {
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
      }
    };
    getUserEmail();
  }, [supabase]);

  // Display deeplinks based on active tab
  const displayedDeeplinks = activeTab === "ui" ? manualLinks : apiLinks;

  const handleSignOut = async () => {
    await supabase?.auth.signOut();
    router.push('/');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleCopyClientKey = () => {
    if (workspace.client_key) {
      copyToClipboard(workspace.client_key);
      setCopiedClientKey(true);
      toast.success('Client key copied to clipboard');
      setTimeout(() => setCopiedClientKey(false), 2000);
    }
  };

  const handleCopyApiKey = () => {
    if (workspace.api_key) {
      copyToClipboard(workspace.api_key);
      setCopiedApiKey(true);
      toast.success('API key copied to clipboard');
      setTimeout(() => setCopiedApiKey(false), 2000);
    }
  };

  // 연결된 앱 확인
  const hasIOSApp = workspace.apps?.some((app: any) => app.platform === 'IOS');
  const hasAndroidApp = workspace.apps?.some((app: any) => app.platform === 'ANDROID');
  const hasAnyApp = hasIOSApp || hasAndroidApp;

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

  // Contact mailto link
  const contactMailto = `mailto:admin@streamize.net?subject=${encodeURIComponent(`[DEPL] Support Request from ${userEmail || 'User'}`)}&body=${encodeURIComponent(`Hi DEPL Team,\n\nWorkspace: ${workspace.name} (${workspace.sub_domain}.depl.link)\nUser: ${userEmail}\n\n[Please describe your issue or question here]\n\n`)}`;

  return (
    <div className="min-h-screen bg-black relative">
      {/* Subtle grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Header */}
      <header className="relative z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/dashboard" className="text-xl font-bold text-white tracking-tight font-space-grotesk">
                DEPL
              </Link>

              {/* Workspace Info */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                <Globe className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">{workspace.name}</span>
                <span className="text-xs text-gray-500">({workspace.sub_domain}.depl.link)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/docs">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-black"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Docs</span>
                </Button>
              </Link>

              <Link href={contactMailto}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-black"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  <span className="hidden md:inline">Contact</span>
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-black"
              >
                <Settings className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Settings</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-black"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-white mb-4">
              {workspace.name}
            </h1>
            <p className="text-xl text-gray-400 mb-6">
              Monitor your workspace deep links performance
            </p>
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← All Workspaces
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Total Links */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
                  <Link2 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-medium text-white mb-2">{stats.totalLinks}</div>
              <div className="text-sm text-gray-400">Deep Links</div>
            </div>

            {/* Total Clicks */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
                  <MousePointerClick className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-medium text-white mb-2">
                {stats.totalClicks.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Clicks</div>
            </div>

            {/* Clicks Today */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-medium text-white mb-2">{stats.clicksToday.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Clicks Today</div>
            </div>

            {/* Avg Click Rate */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-4xl font-medium text-white mb-2">
                {stats.avgPerLink.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Avg per Link</div>
            </div>
          </div>

          {/* App Connection Status */}
          {!hasAnyApp && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm mb-16">
              <div className="flex items-start gap-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 flex-shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2">Connect Your Apps</h3>
                  <p className="text-sm text-gray-400 mb-6">
                    To create deep links, you need to connect at least one app (iOS or Android). This allows us to generate the proper configuration files for universal links and app links.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => setIsIOSModalOpen(true)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 384 512" fill="currentColor">
                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                      </svg>
                      Connect iOS App
                    </Button>
                    <Button
                      onClick={() => setIsAndroidModalOpen(true)}
                      className="bg-white text-black hover:bg-gray-200"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6,18c0,0.55,0.45,1,1,1h1v3.5c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5V19h2v3.5c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5V19h1c0.55,0,1-0.45,1-1V8H6V18z M3.5,8C2.67,8,2,8.67,2,9.5v7c0,0.83,0.67,1.5,1.5,1.5S5,17.33,5,16.5v-7C5,8.67,4.33,8,3.5,8z M20.5,8C19.67,8,19,8.67,19,9.5v7c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5v-7C22,8.67,21.33,8,20.5,8z M15.53,2.16l1.3-1.3c0.2-0.2,0.2-0.51,0-0.71c-0.2-0.2-0.51-0.2-0.71,0l-1.48,1.48C13.85,1.23,12.95,1,12,1c-0.96,0-1.86,0.23-2.66,0.63L7.85,0.15c-0.2-0.2-0.51-0.2-0.71,0c-0.2,0.2-0.2,0.51,0,0.71l1.31,1.31C6.97,3.26,6,5.01,6,7h12C18,5.01,17.03,3.25,15.53,2.16z M10,5H9V4h1V5z M15,5h-1V4h1V5z"/>
                      </svg>
                      Connect Android App
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Keys Section */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-white mb-6">API Keys</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Client Key */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">Client Key</h4>
                    <p className="text-xs text-gray-400">Read-only access</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-300 font-mono break-all">
                    {workspace.client_key || 'Not generated'}
                  </p>
                </div>
                <Button
                  onClick={handleCopyClientKey}
                  className={`w-full border border-white/10 hover:border-white/20 bg-transparent transition-all ${
                    copiedClientKey
                      ? 'text-green-400 hover:text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  disabled={!workspace.client_key}
                >
                  {copiedClientKey ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Client Key
                    </>
                  )}
                </Button>
              </div>

              {/* API Key */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10">
                    <Code className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-white">API Key</h4>
                    <p className="text-xs text-gray-400">Full access (create links)</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <p className="text-xs text-gray-300 font-mono break-all">
                    {workspace.api_key || 'Not generated'}
                  </p>
                </div>
                <Button
                  onClick={handleCopyApiKey}
                  className={`w-full border border-white/10 hover:border-white/20 bg-transparent transition-all ${
                    copiedApiKey
                      ? 'text-green-400 hover:text-green-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  disabled={!workspace.api_key}
                >
                  {copiedApiKey ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy API Key
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Connected Apps - Always Show Both */}
          <div className="mb-16">
            <h3 className="text-lg font-medium text-white mb-6">Connected Apps</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* iOS App */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${
                    hasIOSApp
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border-2 border-dashed border-white/10'
                  }`}>
                    <svg className={`w-5 h-5 ${hasIOSApp ? 'text-white' : 'text-gray-600'}`} viewBox="0 0 384 512" fill="currentColor">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white">iOS App</h4>
                    <p className="text-xs text-gray-400">
                      {hasIOSApp ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  {hasIOSApp ? (
                    <>
                      {workspace.apps?.find((app: any) => app.platform === 'IOS')?.platform_data && (
                        <div className="bg-white/5 rounded-lg p-3 mb-4 flex-1">
                          <p className="text-xs text-gray-500 mb-1">Bundle ID</p>
                          <p className="text-xs text-gray-300 font-mono break-all">
                            {workspace.apps.find((app: any) => app.platform === 'IOS').platform_data.bundle_id}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 mb-4 flex-1">
                      Connect your iOS app to enable Universal Links and deep linking
                    </p>
                  )}

                  <Button
                    onClick={() => setIsIOSModalOpen(true)}
                    className={hasIOSApp
                      ? "w-full text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-transparent"
                      : "w-full bg-white hover:bg-gray-200 text-black border-0 font-medium"
                    }
                  >
                    {hasIOSApp ? "Update Configuration" : "Connect iOS App"}
                  </Button>
                </div>
              </div>

              {/* Android App */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full flex-shrink-0 ${
                    hasAndroidApp
                      ? 'bg-white/10 border border-white/20'
                      : 'bg-white/5 border-2 border-dashed border-white/10'
                  }`}>
                    <svg className={`w-6 h-6 ${hasAndroidApp ? 'text-white' : 'text-gray-600'}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6,18c0,0.55,0.45,1,1,1h1v3.5c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5V19h2v3.5c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5V19h1c0.55,0,1-0.45,1-1V8H6V18z M3.5,8C2.67,8,2,8.67,2,9.5v7c0,0.83,0.67,1.5,1.5,1.5S5,17.33,5,16.5v-7C5,8.67,4.33,8,3.5,8z M20.5,8C19.67,8,19,8.67,19,9.5v7c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5v-7C22,8.67,21.33,8,20.5,8z M15.53,2.16l1.3-1.3c0.2-0.2,0.2-0.51,0-0.71c-0.2-0.2-0.51-0.2-0.71,0l-1.48,1.48C13.85,1.23,12.95,1,12,1c-0.96,0-1.86,0.23-2.66,0.63L7.85,0.15c-0.2-0.2-0.51-0.2-0.71,0c-0.2,0.2-0.2,0.51,0,0.71l1.31,1.31C6.97,3.26,6,5.01,6,7h12C18,5.01,17.03,3.25,15.53,2.16z M10,5H9V4h1V5z M15,5h-1V4h1V5z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-white">Android App</h4>
                    <p className="text-xs text-gray-400">
                      {hasAndroidApp ? 'Connected' : 'Not connected'}
                    </p>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  {hasAndroidApp ? (
                    <>
                      {workspace.apps?.find((app: any) => app.platform === 'ANDROID')?.platform_data && (
                        <div className="bg-white/5 rounded-lg p-3 mb-4 flex-1">
                          <p className="text-xs text-gray-500 mb-1">Package Name</p>
                          <p className="text-xs text-gray-300 font-mono break-all">
                            {workspace.apps.find((app: any) => app.platform === 'ANDROID').platform_data.package_name}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs text-gray-400 mb-4 flex-1">
                      Connect your Android app to enable App Links and deep linking
                    </p>
                  )}

                  <Button
                    onClick={() => setIsAndroidModalOpen(true)}
                    className={hasAndroidApp
                      ? "w-full text-gray-400 hover:text-white border border-white/10 hover:border-white/20 bg-transparent"
                      : "w-full bg-white hover:bg-gray-200 text-black border-0 font-medium"
                    }
                  >
                    {hasAndroidApp ? "Update Configuration" : "Connect Android App"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Links Table */}
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
            <div className="p-8 border-b border-white/10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-medium text-white">Deep Links</h2>
                  <p className="text-sm text-gray-400 mt-1">Manage and track your deep links</p>
                </div>
                <Button
                  onClick={() => setIsCreateLinkModalOpen(true)}
                  className="bg-white text-black hover:bg-gray-200 hidden md:flex"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Link
                </Button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("ui")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "ui"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hand className="w-4 h-4" />
                    <span>Manual</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab("api")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "api"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    <span>API</span>
                  </div>
                </button>
              </div>
            </div>

            {activeTab === "api" && (
              <div className="px-6 py-3 bg-white/5 border-t border-white/10">
                <p className="text-xs text-gray-400">Showing the latest 10 deeplinks created via API</p>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Deep Link</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider hidden md:table-cell">URL</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Clicks</th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider hidden lg:table-cell">Created</th>
                    <th className="text-right px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {displayedDeeplinks.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Link2 className="w-12 h-12 text-gray-600 mb-4" />
                          <p className="text-gray-500">
                            {activeTab === "ui" && "No manually created deeplinks"}
                            {activeTab === "api" && "No API created deeplinks"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    displayedDeeplinks.map((link) => {
                      const url = `${workspace.sub_domain}.depl.link/${link.slug}`;

                      return (
                        <tr key={link.slug} className="hover:bg-white/5 transition-all group">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10">
                                <Link2 className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                <code className="text-sm font-mono text-white">/{link.slug}</code>
                                <div className="text-xs text-gray-500 mt-0.5 md:hidden">{url}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-400 font-mono">{url}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyToClipboard(`https://${url}`)}
                              >
                                <Copy className="w-3 h-3 text-gray-500 hover:text-gray-300" />
                              </Button>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
                              <MousePointerClick className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-white">{link.click_count.toLocaleString()}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 hidden lg:table-cell">
                            <span className="text-sm text-gray-500">{formatDate(link.created_at)}</span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white hover:bg-white/5"
                              >
                                <BarChart3 className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white hover:bg-white/5"
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
        </div>
      </main>

      {/* Modals */}
      <ConnectIOSAppModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
        workspaceId={workspace.id}
        existingApp={workspace.apps?.find((app: any) => app.platform === 'IOS')}
      />
      <ConnectAndroidAppModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        workspaceId={workspace.id}
        existingApp={workspace.apps?.find((app: any) => app.platform === 'ANDROID')}
      />
      <CreateDeeplinkModal
        isOpen={isCreateLinkModalOpen}
        onClose={() => setIsCreateLinkModalOpen(false)}
        workspaceId={workspace.id}
      />
    </div>
  );
}

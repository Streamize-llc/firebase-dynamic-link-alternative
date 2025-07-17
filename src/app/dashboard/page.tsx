"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Globe,
  Smartphone,
  Link2,
  Clock
} from "lucide-react"
import { getCurrentLanguage } from "@/utils/action/client"

export default function DashboardPage() {
  const router = useRouter()
  const lang = getCurrentLanguage()

  const translations = {
    ko: {
      title: "대시보드 개요",
      subtitle: "딥링크 성과를 한눈에 확인하세요",
      totalLinks: "총 딥링크",
      totalClicks: "총 클릭수",
      activeProjects: "활성 프로젝트",
      conversionRate: "전환율",
      increase: "증가",
      decrease: "감소",
      recentActivity: "최근 활동",
      viewAll: "모두 보기",
      topPerforming: "인기 딥링크",
      platformStats: "플랫폼별 통계",
      ios: "iOS",
      android: "Android",
      web: "웹",
      linkCreated: "딥링크 생성됨",
      linkClicked: "딥링크 클릭됨",
      projectUpdated: "프로젝트 업데이트됨",
      minutesAgo: "분 전",
      hoursAgo: "시간 전",
      clicks: "클릭"
    },
    en: {
      title: "Dashboard Overview",
      subtitle: "Monitor your deep link performance at a glance",
      totalLinks: "Total Links",
      totalClicks: "Total Clicks",
      activeProjects: "Active Projects",
      conversionRate: "Conversion Rate",
      increase: "increase",
      decrease: "decrease",
      recentActivity: "Recent Activity",
      viewAll: "View All",
      topPerforming: "Top Performing Links",
      platformStats: "Platform Statistics",
      ios: "iOS",
      android: "Android",
      web: "Web",
      linkCreated: "Link created",
      linkClicked: "Link clicked",
      projectUpdated: "Project updated",
      minutesAgo: "minutes ago",
      hoursAgo: "hours ago",
      clicks: "clicks"
    },
    ja: {
      title: "ダッシュボード概要",
      subtitle: "ディープリンクのパフォーマンスを一目で確認",
      totalLinks: "総ディープリンク",
      totalClicks: "総クリック数",
      activeProjects: "アクティブプロジェクト",
      conversionRate: "コンバージョン率",
      increase: "増加",
      decrease: "減少",
      recentActivity: "最近のアクティビティ",
      viewAll: "すべて表示",
      topPerforming: "人気のディープリンク",
      platformStats: "プラットフォーム統計",
      ios: "iOS",
      android: "Android",
      web: "ウェブ",
      linkCreated: "リンクが作成されました",
      linkClicked: "リンクがクリックされました",
      projectUpdated: "プロジェクトが更新されました",
      minutesAgo: "分前",
      hoursAgo: "時間前",
      clicks: "クリック"
    }
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  // Redirect to projects page for now
  useEffect(() => {
    // router.push('/dashboard/project')
  }, [router])

  // Mock data
  const stats = [
    {
      label: t.totalLinks,
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Link2,
      color: "blue"
    },
    {
      label: t.totalClicks,
      value: "45.2K",
      change: "+8.2%",
      trend: "up",
      icon: Activity,
      color: "green"
    },
    {
      label: t.activeProjects,
      value: "3",
      change: "0%",
      trend: "neutral",
      icon: Users,
      color: "purple"
    },
    {
      label: t.conversionRate,
      value: "24.8%",
      change: "-2.1%",
      trend: "down",
      icon: TrendingUp,
      color: "orange"
    }
  ]

  const recentActivity = [
    {
      type: "link_created",
      message: t.linkCreated,
      project: "모바일 앱",
      time: "5",
      unit: t.minutesAgo
    },
    {
      type: "link_clicked",
      message: t.linkClicked,
      project: "이커머스 앱",
      time: "12",
      unit: t.minutesAgo
    },
    {
      type: "project_updated",
      message: t.projectUpdated,
      project: "게임 런처",
      time: "1",
      unit: t.hoursAgo
    }
  ]

  const topLinks = [
    { name: "summer-sale-2024", clicks: 3420, trend: "+15%" },
    { name: "app-download", clicks: 2810, trend: "+8%" },
    { name: "product-launch", clicks: 1923, trend: "+23%" },
    { name: "referral-program", clicks: 1502, trend: "-5%" }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <p className="text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.color === 'blue' ? 'bg-slate-800/50' : stat.color === 'green' ? 'bg-emerald-900/20' : stat.color === 'purple' ? 'bg-indigo-900/20' : 'bg-amber-900/20'} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color === 'blue' ? 'text-slate-400' : stat.color === 'green' ? 'text-emerald-400' : stat.color === 'purple' ? 'text-indigo-400' : 'text-amber-400'}`} />
                </div>
                <span className={`text-sm font-medium flex items-center ${
                  stat.trend === 'up' ? 'text-emerald-500' : 
                  stat.trend === 'down' ? 'text-rose-400' : 
                  'text-gray-400'
                }`}>
                  {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                  {stat.trend === 'down' && <ArrowDownRight className="w-4 h-4 mr-1" />}
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performing Links */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">{t.topPerforming}</h2>
            <button className="text-sm text-slate-400 hover:text-slate-300 transition-colors">
              {t.viewAll}
            </button>
          </div>
          <div className="space-y-4">
            {topLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{link.name}</p>
                    <p className="text-xs text-gray-400">{link.clicks} {t.clicks}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  link.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-400'
                }`}>
                  {link.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">{t.recentActivity}</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.project} • {activity.time} {activity.unit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Statistics */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">{t.platformStats}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">42%</h3>
            <p className="text-sm text-gray-400">{t.ios}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
              <Smartphone className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">38%</h3>
            <p className="text-sm text-gray-400">{t.android}</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-indigo-900/20 flex items-center justify-center mx-auto mb-3">
              <Globe className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">20%</h3>
            <p className="text-sm text-gray-400">{t.web}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCurrentLanguage } from "@/utils/action/client"
import { 
  LayoutDashboard, 
  Folder, 
  BarChart3, 
  Settings, 
  FileText,
  Key,
  Globe,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  Users
} from "lucide-react"

interface DashboardSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function DashboardSidebar({ isCollapsed, onToggle }: DashboardSidebarProps) {
  const pathname = usePathname()
  const lang = getCurrentLanguage()

  const translations = {
    ko: {
      overview: "개요",
      projects: "프로젝트",
      analytics: "분석",
      settings: "설정",
      documentation: "문서",
      apiKeys: "API 키",
      domains: "도메인",
      support: "지원",
      team: "팀 관리",
      security: "보안",
      upgrade: "업그레이드",
      collapse: "접기",
      expand: "펼치기"
    },
    en: {
      overview: "Overview",
      projects: "Projects",
      analytics: "Analytics",
      settings: "Settings",
      documentation: "Documentation",
      apiKeys: "API Keys",
      domains: "Domains",
      support: "Support",
      team: "Team",
      security: "Security",
      upgrade: "Upgrade",
      collapse: "Collapse",
      expand: "Expand"
    },
    ja: {
      overview: "概要",
      projects: "プロジェクト",
      analytics: "分析",
      settings: "設定",
      documentation: "ドキュメント",
      apiKeys: "APIキー",
      domains: "ドメイン",
      support: "サポート",
      team: "チーム管理",
      security: "セキュリティ",
      upgrade: "アップグレード",
      collapse: "折りたたむ",
      expand: "展開"
    }
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  const menuItems = [
    {
      label: t.overview,
      icon: LayoutDashboard,
      href: "/dashboard",
      exact: true
    },
    {
      label: t.projects,
      icon: Folder,
      href: "/dashboard/project",
      badge: "3"
    },
    {
      label: t.analytics,
      icon: BarChart3,
      href: "/dashboard/analytics",
      disabled: true
    },
    {
      type: "separator"
    },
    {
      label: t.apiKeys,
      icon: Key,
      href: "/dashboard/api-keys"
    },
    {
      label: t.domains,
      icon: Globe,
      href: "/dashboard/domains"
    },
    {
      type: "separator"
    },
    {
      label: t.team,
      icon: Users,
      href: "/dashboard/team"
    },
    {
      label: t.security,
      icon: Shield,
      href: "/dashboard/security"
    },
    {
      label: t.settings,
      icon: Settings,
      href: "/dashboard/settings"
    },
    {
      type: "separator"
    },
    {
      label: t.documentation,
      icon: FileText,
      href: "/dashboard/docs",
      external: true
    },
    {
      label: t.support,
      icon: HelpCircle,
      href: "/dashboard/support"
    }
  ]

  const isActive = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <aside className={`
      ${isCollapsed ? 'w-16' : 'w-64'} 
      h-screen bg-gray-950 border-r border-gray-800 
      flex flex-col transition-all duration-300 ease-in-out
      fixed left-0 top-0 z-50
    `}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">Depl</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          title={isCollapsed ? t.expand : t.collapse}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={index} className="my-3 border-t border-gray-800" />
          }

          const Icon = item.icon!
          const active = isActive(item.href!, item.exact)

          return (
            <Link
              key={index}
              href={item.disabled ? '#' : item.href!}
              className={`
                flex items-center justify-between px-3 py-2.5 rounded-lg
                transition-all duration-200 group relative
                ${active 
                  ? 'bg-gradient-to-r from-slate-700/30 to-slate-600/30 text-white border border-slate-500/30' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${active ? 'text-slate-300' : ''}`} />
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </div>
              
              {!isCollapsed && item.badge && (
                <span className="px-2 py-0.5 text-xs font-medium bg-slate-700/30 text-slate-300 rounded-full">
                  {item.badge}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded-md 
                  opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Upgrade Section */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gradient-to-r from-indigo-500/10 to-indigo-600/10 rounded-lg p-4 border border-indigo-500/20">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium text-white">{t.upgrade}</span>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              더 많은 기능과 무제한 딥링크를 사용하세요
            </p>
            <button className="w-full px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all">
              Pro로 업그레이드
            </button>
          </div>
        </div>
      )}

      {/* User Section - Collapsed */}
      {isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <button className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
            <span className="text-sm font-medium text-white">U</span>
          </button>
        </div>
      )}
    </aside>
  )
}
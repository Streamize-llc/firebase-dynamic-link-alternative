"use client"

import React, { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCurrentLanguage } from "@/utils/action/client"
import { 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  HelpCircle,
  ChevronDown,
  Plus,
  Command,
  Moon,
  Sun,
  Globe,
  CreditCard,
  Shield
} from "lucide-react"

interface DashboardHeaderNewProps {
  onSidebarToggle?: () => void
}

export function DashboardHeaderNew({ onSidebarToggle }: DashboardHeaderNewProps) {
  const pathname = usePathname()
  const lang = getCurrentLanguage()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [theme, setTheme] = useState('dark')
  const profileRef = useRef<HTMLDivElement>(null)

  const translations = {
    ko: {
      search: "검색",
      searchPlaceholder: "프로젝트, 딥링크, 문서 검색...",
      newProject: "새 프로젝트",
      notifications: "알림",
      profile: "프로필",
      settings: "설정",
      billing: "결제 및 구독",
      security: "보안 설정",
      language: "언어",
      theme: "테마",
      help: "도움말",
      logout: "로그아웃",
      noNotifications: "새로운 알림이 없습니다",
      recentActivity: "최근 활동"
    },
    en: {
      search: "Search",
      searchPlaceholder: "Search projects, deeplinks, docs...",
      newProject: "New Project",
      notifications: "Notifications",
      profile: "Profile",
      settings: "Settings",
      billing: "Billing & Subscription",
      security: "Security Settings",
      language: "Language",
      theme: "Theme",
      help: "Help",
      logout: "Logout",
      noNotifications: "No new notifications",
      recentActivity: "Recent Activity"
    },
    ja: {
      search: "検索",
      searchPlaceholder: "プロジェクト、ディープリンク、ドキュメントを検索...",
      newProject: "新規プロジェクト",
      notifications: "通知",
      profile: "プロフィール",
      settings: "設定",
      billing: "請求と購読",
      security: "セキュリティ設定",
      language: "言語",
      theme: "テーマ",
      help: "ヘルプ",
      logout: "ログアウト",
      noNotifications: "新しい通知はありません",
      recentActivity: "最近のアクティビティ"
    }
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get breadcrumb
  const getBreadcrumb = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumb = []
    
    for (let i = 0; i < paths.length; i++) {
      const path = '/' + paths.slice(0, i + 1).join('/')
      let label = paths[i]
      
      // Translate common paths
      if (label === 'dashboard') label = '대시보드'
      else if (label === 'project') label = '프로젝트'
      else if (label === 'settings') label = '설정'
      else if (label === 'docs') label = '문서'
      
      breadcrumb.push({ path, label })
    }
    
    return breadcrumb
  }

  const breadcrumb = getBreadcrumb()

  return (
    <header className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-40">
      {/* Left Section - Breadcrumb & Search */}
      <div className="flex items-center space-x-6 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumb.map((item, index) => (
            <React.Fragment key={item.path}>
              {index > 0 && <span className="text-gray-600">/</span>}
              {index === breadcrumb.length - 1 ? (
                <span className="text-white font-medium">{item.label}</span>
              ) : (
                <Link href={item.path} className="text-gray-400 hover:text-white transition-colors">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-gray-400 hover:text-white hover:border-gray-700 transition-all group"
          >
            <Search className="w-4 h-4 mr-2" />
            <span className="flex-1 text-left text-sm">{t.searchPlaceholder}</span>
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-medium bg-gray-800 text-gray-400 rounded">
              <Command className="w-3 h-3 mr-1" />K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-4">
        {/* New Project Button */}
        <button className="flex items-center px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-500/10">
          <Plus className="w-4 h-4 mr-2" />
          {t.newProject}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
              <span className="text-sm font-medium text-white">U</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-xl py-2">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-800">
                <p className="text-sm font-medium text-white">사용자 이름</p>
                <p className="text-xs text-gray-400">user@example.com</p>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <Link href="/dashboard/profile" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                  <User className="w-4 h-4 mr-3" />
                  {t.profile}
                </Link>
                <Link href="/dashboard/billing" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                  <CreditCard className="w-4 h-4 mr-3" />
                  {t.billing}
                </Link>
                <Link href="/dashboard/security" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                  <Shield className="w-4 h-4 mr-3" />
                  {t.security}
                </Link>
                <Link href="/dashboard/settings" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                  <Settings className="w-4 h-4 mr-3" />
                  {t.settings}
                </Link>
              </div>

              {/* Theme & Language */}
              <div className="py-2 border-t border-gray-800">
                <button className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-3" />
                    {t.language}
                  </div>
                  <span className="text-xs text-gray-500">한국어</span>
                </button>
                <button 
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center justify-between w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center">
                    {theme === 'dark' ? <Moon className="w-4 h-4 mr-3" /> : <Sun className="w-4 h-4 mr-3" />}
                    {t.theme}
                  </div>
                  <span className="text-xs text-gray-500">{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </button>
              </div>

              {/* Help & Logout */}
              <div className="py-2 border-t border-gray-800">
                <Link href="/help" className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 transition-colors">
                  <HelpCircle className="w-4 h-4 mr-3" />
                  {t.help}
                </Link>
                <button className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors">
                  <LogOut className="w-4 h-4 mr-3" />
                  {t.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-32">
          <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-lg shadow-2xl">
            <div className="flex items-center px-4 py-3 border-b border-gray-800">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <kbd className="px-2 py-1 text-xs font-medium bg-gray-800 text-gray-400 rounded">ESC</kbd>
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-400">{t.recentActivity}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
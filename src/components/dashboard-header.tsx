"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getCurrentLanguage } from "@/utils/action/client"

export function DashboardHeader() {
  const currentPath = usePathname() || ""
  const lang = getCurrentLanguage()
  
  // 프로젝트 페이지 케이스 구분
  const isProjectPage = currentPath.includes('/dashboard/project')
  const isProjectListPage = currentPath === '/dashboard/project'
  const isProjectDetailPage = isProjectPage && !isProjectListPage
  const isRestapiDocs = currentPath.includes('/docs/restapi')
  const isClientDocs = currentPath.includes('/docs/client')
  
  const translations = {
    ko: {
      projects: "Projects",
      apiDocs: "API Documentation",
      clientIntegration: "Client Integration"
    },
    en: {
      projects: "Projects",
      apiDocs: "API Documentation",
      clientIntegration: "Client Integration"
    },
    ja: {
      projects: "Projects",
      apiDocs: "API Documentation",
      clientIntegration: "Client Integration"
    }
  };
  
  const t = translations[lang as keyof typeof translations] || translations.en;
  
  return (
    <header className="fixed top-0 left-0 w-full h-[5rem] bg-black flex items-center justify-between px-6 z-10">
      {isProjectPage ? (
        <div className="flex space-x-4">
          <Link 
            href={`/dashboard/project/${currentPath.split('/dashboard/project/')[1]?.split('/')[0] || ''}`} 
            className={`px-5 py-2 rounded-full ${!isRestapiDocs && !isClientDocs ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' : 'text-gray-400 bg-transparent border border-[#333]'} transition-all duration-200 flex items-center`}
          >
            <span className="text-sm font-medium">{t.projects}</span>
          </Link>
          {!isProjectListPage && (
            <>
              <Link 
                href={`/dashboard/project/${currentPath.split('/dashboard/project/')[1]?.split('/')[0] || ''}/docs/restapi`}
                className={`px-5 py-2 rounded-full ${isRestapiDocs ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' : 'text-gray-400 bg-transparent border border-[#333]'} transition-all duration-200 flex items-center`}
              >
                <span className="text-sm font-medium">{t.apiDocs}</span>
              </Link>
              <Link 
                href={`/dashboard/project/${currentPath.split('/dashboard/project/')[1]?.split('/')[0] || ''}/docs/client`}
                className={`px-5 py-2 rounded-full ${isClientDocs ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' : 'text-gray-400 bg-transparent border border-[#333]'} transition-all duration-200 flex items-center`}
              >
                <span className="text-sm font-medium">{t.clientIntegration}</span>
              </Link>
            </>
          )}
        </div>
      ) : (
        <div className="flex space-x-4">
          <Link href="#" className="px-5 py-2 rounded-full text-gray-400 bg-transparent border border-[#333] transition-all duration-200 flex items-center">
            <span className="text-sm font-medium"></span>
          </Link>
          <Link href="#" className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg flex items-center">
            <span className="text-sm font-medium"></span>
          </Link>
        </div>
      )}
      <div className="flex items-center space-x-4">
        {/* 사용자 프로필 및 기타 헤더 요소는 필요에 따라 추가 */}
      </div>
    </header>
  )
}

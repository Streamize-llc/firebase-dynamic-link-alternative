"use client"

import { useState, useEffect } from "react"
import { CreateProjectModal } from "@/components/modal/create-project"
import { getProjects } from "@/utils/action/server"
import { useRouter } from "next/navigation"
import { getCurrentLanguage } from "@/utils/action/client";

export default function ProjectPage() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const lang = getCurrentLanguage();

  const translations = {
    ko: {
      title: "프로젝트",
      subtitle: "딥링크 프로젝트를 관리하고 새로운 프로젝트를 생성하세요",
      loadingError: "프로젝트 로드 중 오류:",
      newProjectTitle: "새 프로젝트 생성",
      newProjectDesc: "새로운 딥링크 프로젝트를 시작하세요",
      clickToStart: "클릭하여 시작하기",
      noDescription: "설명 없음",
      active: "활성",
      linkCount: "링크 수:"
    },
    en: {
      title: "Projects",
      subtitle: "Manage your deeplink projects and create new ones",
      loadingError: "Error loading projects:",
      newProjectTitle: "Create New Project",
      newProjectDesc: "Start a new deeplink project",
      clickToStart: "Click to start",
      noDescription: "No description",
      active: "Active",
      linkCount: "Links:"
    },
    ja: {
      title: "プロジェクト",
      subtitle: "ディープリンクプロジェクトを管理し、新しいプロジェクトを作成します",
      loadingError: "プロジェクト読み込み中のエラー:",
      newProjectTitle: "新規プロジェクト作成",
      newProjectDesc: "新しいディープリンクプロジェクトを始めましょう",
      clickToStart: "クリックして開始",
      noDescription: "説明なし",
      active: "アクティブ",
      linkCount: "リンク数:"
    }
  };
  
  const t = translations[lang as keyof typeof translations] || translations.en;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects()
        setProjects(projects)
        setIsLoading(false)
      } catch (error) {
        console.error(t.loadingError, error)
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [t.loadingError])

  const handleCreateProject = (data: { name: string; description?: string, projectId: string }) => {
    console.log("새 프로젝트 생성:", data)
    router.push(`/dashboard/project/${data.projectId}`)
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/project/${projectId}`)
  }

  return (
    <div className="flex w-full h-full px-6 max-w-[125rem] gap-[1.5rem] pt-[6rem] pb-[5rem] justify-center">
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
      <div className="w-full max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{t.title}</h1>
          <p className="text-gray-400 text-lg">{t.subtitle}</p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] shadow-lg animate-pulse">
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-full bg-gray-700/30"></div>
                  <div className="w-16 h-6 rounded-full bg-gray-700/30"></div>
                </div>
                <div className="h-7 w-40 bg-gray-700/30 rounded mb-2"></div>
                <div className="h-5 w-32 bg-gray-700/30 rounded mb-6"></div>
                
                <div className="flex gap-3 mb-6">
                  <div className="h-6 w-20 bg-gray-700/30 rounded-full"></div>
                  <div className="h-6 w-16 bg-gray-700/30 rounded-full"></div>
                </div>
                
                <div className="h-12 bg-gray-700/20 rounded-xl"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 새 프로젝트 카드 */}
            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-between bg-[#111] hover:bg-[#161616] transition-all cursor-pointer hover:border-purple-500/50 group shadow-lg hover:shadow-xl" onClick={() => setIsCreateProjectModalOpen(true)}>
              <div className="flex flex-col items-center justify-center flex-1 py-8">
                <div className="w-14 h-14 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">{t.newProjectTitle}</h3>
                <p className="text-gray-400 text-center text-base">{t.newProjectDesc}</p>
              </div>
              
              <div className="flex justify-center items-center bg-black/20 p-3 rounded-xl w-full">
                <span className="text-sm font-medium text-gray-400">{t.clickToStart}</span>
              </div>
            </div>
            
            {/* 실제 프로젝트 목록 */}
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] hover:from-[#131313] hover:to-[#1a1a1a] transition-all cursor-pointer shadow-lg hover:shadow-xl"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-full bg-blue-500/15 flex items-center justify-center shadow-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full shadow-sm">{t.active}</span>
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 text-base mb-6">{project.description || t.noDescription}</p>
                
                {/* 앱 플랫폼 표시 */}
                <div className="flex gap-3 mb-6">
                  {project.apps && project.apps.some((app: any) => app.platform === 'ANDROID') ? (
                    <span className="text-xs font-medium text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-full">Android</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-gray-500/15 px-3 py-1.5 rounded-full">Android</span>
                  )}
                  {project.apps && project.apps.some((app: any) => app.platform === 'IOS') ? (
                    <span className="text-xs font-medium text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-full">iOS</span>
                  ) : (
                    <span className="text-xs font-medium text-gray-400 bg-gray-500/15 px-3 py-1.5 rounded-full">iOS</span>
                  )}
                </div>
                
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">{t.linkCount}</span>
                    <span className="text-sm font-medium text-white ml-2">0</span>
                  </div>
                </div>
              </div>
            ))}
          
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { CreateProjectModal } from "@/components/modal/create-project"
import { getProjects } from "@/utils/action/server"
import { useRouter } from "next/navigation"
import { getCurrentLanguage } from "@/utils/action/client"
import { Plus, Rocket, Activity, ChevronRight, Grid3X3, List, Search, Filter, MoreVertical } from "lucide-react"

export default function ProjectPage() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const router = useRouter()
  const lang = getCurrentLanguage()

  const translations = {
    ko: {
      title: "Your Projects",
      subtitle: "Build powerful deep link solutions for your mobile apps",
      loadingError: "프로젝트 로드 중 오류:",
      newProjectTitle: "Create New Project",
      newProjectDesc: "Start building your deep link infrastructure",
      clickToStart: "Get Started",
      noDescription: "Configure your deep links and analytics",
      active: "Active",
      linkCount: "Links",
      viewProject: "View Project",
      searchPlaceholder: "프로젝트 검색...",
      filter: "필터"
    },
    en: {
      title: "Your Projects",
      subtitle: "Build powerful deep link solutions for your mobile apps",
      loadingError: "Error loading projects:",
      newProjectTitle: "Create New Project",
      newProjectDesc: "Start building your deep link infrastructure",
      clickToStart: "Get Started",
      noDescription: "Configure your deep links and analytics",
      active: "Active",
      linkCount: "Links",
      viewProject: "View Project",
      searchPlaceholder: "Search projects...",
      filter: "Filter"
    },
    ja: {
      title: "Your Projects",
      subtitle: "Build powerful deep link solutions for your mobile apps",
      loadingError: "プロジェクト読み込み中のエラー:",
      newProjectTitle: "Create New Project",
      newProjectDesc: "Start building your deep link infrastructure",
      clickToStart: "Get Started",
      noDescription: "Configure your deep links and analytics",
      active: "Active",
      linkCount: "Links",
      viewProject: "View Project",
      searchPlaceholder: "プロジェクトを検索...",
      filter: "フィルター"
    }
  }
  
  const t = translations[lang as keyof typeof translations] || translations.en

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{t.title}</h1>
          <p className="text-gray-400 mt-2">{t.subtitle}</p>
        </div>
        <button
          onClick={() => setIsCreateProjectModalOpen(true)}
          className="flex items-center px-4 py-2.5 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-lg shadow-slate-500/10"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.newProjectTitle}
        </button>
      </div>

      {/* Filters and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-gray-700 w-64"
            />
          </div>
          
          {/* Filter */}
          <button className="flex items-center px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-gray-300 hover:text-white hover:border-gray-700 transition-all">
            <Filter className="w-4 h-4 mr-2" />
            {t.filter}
          </button>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center bg-gray-900/50 border border-gray-800 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-all ${
              viewMode === 'grid' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-all ${
              viewMode === 'list' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Content */}
      <div>
        {isLoading ? (
          <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={viewMode === 'grid' ? "" : "flex items-center space-x-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg"}>
                {viewMode === 'grid' ? (
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-800"></div>
                      <div className="w-16 h-5 rounded-full bg-gray-800"></div>
                    </div>
                    <div className="h-5 w-3/4 bg-gray-800 rounded mb-2"></div>
                    <div className="h-4 w-full bg-gray-800 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-5 w-12 bg-gray-800 rounded-full"></div>
                      <div className="h-5 w-12 bg-gray-800 rounded-full"></div>
                    </div>
                    <div className="h-9 bg-gray-800 rounded-lg"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-lg bg-gray-800"></div>
                    <div className="flex-1">
                      <div className="h-5 w-48 bg-gray-800 rounded mb-2"></div>
                      <div className="h-4 w-64 bg-gray-800 rounded"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-5 w-16 bg-gray-800 rounded-full"></div>
                      <div className="h-5 w-16 bg-gray-800 rounded-full"></div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {/* Create New Project Card - Grid View */}
            {viewMode === 'grid' && (
              <div 
                className="group cursor-pointer"
                onClick={() => setIsCreateProjectModalOpen(true)}
              >
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-700 p-6 hover:border-slate-600/40 transition-all h-full flex flex-col justify-center items-center text-center min-h-[240px]">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-700/30 flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-slate-400" />
                  </div>
                  <h3 className="text-base font-medium text-white mb-2">{t.newProjectTitle}</h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {t.newProjectDesc}
                  </p>
                  <button className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-all text-sm">
                    {t.clickToStart}
                  </button>
                </div>
              </div>
            )}
            
            {/* Existing Projects */}
            {projects.map((project) => (
              viewMode === 'grid' ? (
                <div 
                  key={project.id} 
                  className="group cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6 hover:border-gray-700 transition-all h-full flex flex-col min-h-[240px]">
                    <div className="flex justify-between items-start mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-lg flex items-center justify-center">
                          <Rocket className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation() }}
                        className="p-1.5 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    
                    <h3 className="text-lg font-medium text-white mb-2">{project.name}</h3>
                    <p className="text-sm text-gray-400 mb-4 flex-1 line-clamp-2">
                      {project.description || t.noDescription}
                    </p>
                    
                    {/* Platform indicators */}
                    <div className="flex gap-2 mb-4">
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.apps?.some((app: any) => app.platform === 'IOS') 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        iOS
                      </div>
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.apps?.some((app: any) => app.platform === 'ANDROID') 
                          ? 'bg-emerald-900/20 text-emerald-400' 
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        Android
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Activity className="w-4 h-4" />
                          <span>0 {t.linkCount}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-slate-300 transition-colors" />
                    </div>
                  </div>
                </div>
              ) : (
                <div 
                  key={project.id}
                  className="flex items-center space-x-4 p-4 bg-gray-900/50 border border-gray-800 rounded-lg hover:border-gray-700 transition-all cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-lg flex items-center justify-center">
                      <Rocket className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-white">{project.name}</h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {project.description || t.noDescription}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex gap-2">
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.apps?.some((app: any) => app.platform === 'IOS') 
                          ? 'bg-gray-700 text-gray-300' 
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        iOS
                      </div>
                      <div className={`px-3 py-1 text-xs font-medium rounded-full ${
                        project.apps?.some((app: any) => app.platform === 'ANDROID') 
                          ? 'bg-emerald-900/20 text-emerald-400' 
                          : 'bg-gray-800 text-gray-500'
                      }`}>
                        Android
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Activity className="w-4 h-4" />
                      <span>0</span>
                    </div>
                    
                    <button 
                      onClick={(e) => { e.stopPropagation() }}
                      className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}
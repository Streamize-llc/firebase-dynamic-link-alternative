"use client"

import { useState, useEffect } from "react"
import { CreateProjectModal } from "@/components/modal/create-project"
import { getProjects } from "@/utils/action/server"
import { useRouter } from "next/navigation"

export default function ProjectPage() {
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projects = await getProjects()
        console.log(projects)
        setProjects(projects)
        setIsLoading(false)
      } catch (error) {
        console.error("프로젝트 로드 중 오류:", error)
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const handleCreateProject = (data: { name: string; description?: string }) => {
    console.log("새 프로젝트 생성:", data)
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
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">프로젝트</h1>
          <p className="text-gray-400 text-lg">딥링크 프로젝트를 관리하고 새로운 프로젝트를 생성하세요</p>
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
                <h3 className="text-2xl font-medium text-white mb-2">새 프로젝트 생성</h3>
                <p className="text-gray-400 text-center text-base">새로운 딥링크 프로젝트를 시작하세요</p>
              </div>
              
              <div className="flex justify-center items-center bg-black/20 p-3 rounded-xl w-full">
                <span className="text-sm font-medium text-gray-400">클릭하여 시작하기</span>
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
                  <span className="text-xs font-medium text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full shadow-sm">활성</span>
                </div>
                <h3 className="text-2xl font-medium text-white mb-2">{project.name}</h3>
                <p className="text-gray-400 text-base mb-6">{project.description || '설명 없음'}</p>
                
                {/* 앱 플랫폼 표시 */}
                <div className="flex gap-3 mb-6">
                  <span className="text-xs font-medium text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-full">Android</span>
                  <span className="text-xs font-medium text-gray-400 bg-gray-500/15 px-3 py-1.5 rounded-full">iOS</span>
                </div>
                
                <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">링크 수:</span>
                    <span className="text-sm font-medium text-white ml-2">0</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">클릭:</span>
                    <span className="text-sm font-medium text-white ml-2">0</span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* 기존 프로젝트 카드 예시 */}
            <div 
              className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] hover:from-[#131313] hover:to-[#1a1a1a] transition-all cursor-pointer shadow-lg hover:shadow-xl"
              onClick={() => handleProjectClick("example-project-1")}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-full bg-blue-500/15 flex items-center justify-center shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full shadow-sm">활성</span>
              </div>
              <h3 className="text-2xl font-medium text-white mb-2">쇼핑몰 앱</h3>
              <p className="text-gray-400 text-base mb-6">shop.example.com</p>
              
              {/* 앱 플랫폼 표시 */}
              <div className="flex gap-3 mb-6">
                <span className="text-xs font-medium text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-full">Android</span>
                <span className="text-xs font-medium text-gray-400 bg-gray-500/15 px-3 py-1.5 rounded-full">iOS</span>
              </div>
              
              <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">링크 수:</span>
                  <span className="text-sm font-medium text-white ml-2">128</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">클릭:</span>
                  <span className="text-sm font-medium text-white ml-2">3.2K</span>
                </div>
              </div>
            </div>
            
            <div 
              className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] hover:from-[#131313] hover:to-[#1a1a1a] transition-all cursor-pointer shadow-lg hover:shadow-xl"
              onClick={() => handleProjectClick("example-project-2")}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 rounded-full bg-green-500/15 flex items-center justify-center shadow-inner">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-emerald-400 bg-emerald-500/15 px-3 py-1.5 rounded-full shadow-sm">활성</span>
              </div>
              <h3 className="text-2xl font-medium text-white mb-2">음악 스트리밍</h3>
              <p className="text-gray-400 text-base mb-6">music.example.com</p>
              
              {/* 앱 플랫폼 표시 - 안드로이드만 있는 경우 */}
              <div className="flex gap-3 mb-6">
                <span className="text-xs font-medium text-blue-400 bg-blue-500/15 px-3 py-1.5 rounded-full">Android</span>
              </div>
              
              <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">링크 수:</span>
                  <span className="text-sm font-medium text-white ml-2">64</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-500">클릭:</span>
                  <span className="text-sm font-medium text-white ml-2">1.8K</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

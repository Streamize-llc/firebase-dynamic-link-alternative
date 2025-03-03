"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import RegisterAndroidModal from "@/components/modal/register-android"
import RegisterIOSModal from "@/components/modal/register-ios"
import { getProject } from "@/utils/action/server"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const [project, setProject] = useState<any>(null)
  const [isAndroidAppRegistered, setIsAndroidAppRegistered] = useState(false)
  const [isIOSAppRegistered, setIsIOSAppRegistered] = useState(true)
  const [isCustomDomainModalOpen, setIsCustomDomainModalOpen] = useState(false)
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false)
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false)
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        
        // server.ts에서 getProject 함수 호출
        const projectData = await getProject(projectId);
        
        // 프로젝트 데이터 설정
        setProject(projectData);
        
        // 앱 등록 상태 확인 로직 추가 필요
        // TODO: 앱 등록 상태 확인 로직 구현
        
        setIsLoading(false);
      } catch (error) {
        console.error("프로젝트 정보 로딩 중 오류 발생:", error);
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  const handleAndroidRegister = (data: { packageName: string; sha256: string }) => {
    console.log('안드로이드 앱 등록 완료:', data)
    setIsAndroidAppRegistered(true)
  }

  const handleIOSRegister = (data: { bundleId: string; teamId: string }) => {
    console.log('iOS 앱 등록 완료:', data)
    setIsIOSAppRegistered(true)
  }

  if (isLoading) {
    return (
      <div className="flex w-full h-full px-6 max-w-[125rem] gap-[1.5rem] pt-[6rem] pb-[5rem] justify-center">
        <div className="w-full max-w-7xl animate-pulse">
          <div className="h-10 w-64 bg-gray-700/30 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-700/30 rounded mb-10"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-[#111] to-[#151515]">
                <div className="h-8 w-32 bg-gray-700/30 rounded mb-4"></div>
                <div className="h-10 w-20 bg-gray-700/30 rounded"></div>
              </div>
            ))}
          </div>
          
          <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] mb-8">
            <div className="h-8 w-48 bg-gray-700/30 rounded mb-6"></div>
            <div className="h-64 bg-gray-700/20 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full h-full px-6 max-w-[125rem] gap-[1.5rem] pt-[6rem] pb-[5rem] justify-center">
      <RegisterAndroidModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        onRegister={handleAndroidRegister}
        project={project}
      />

      <RegisterIOSModal
        isOpen={isIOSModalOpen}
        onClose={() => setIsIOSModalOpen(false)}
        onRegister={handleIOSRegister}
        project={project}
      />

      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{project.name}</h1>
            <p className="text-gray-400 text-lg">{project.domain}</p>
          </div>
          <div className="flex gap-3">
            {isAndroidAppRegistered || project.platforms?.includes('ANDROID') ? (
              <button 
                onClick={() => setIsAndroidModalOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-green-600/15 hover:bg-green-600/25 text-green-400 font-medium transition-all flex items-center border border-green-500/20 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.87 11.87 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.98 10.98 0 0 0 1 18h22a10.98 10.98 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                </svg>
                Android 앱 수정
              </button>
            ) : (
              <button 
                onClick={() => setIsAndroidModalOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-medium transition-all flex items-center border border-emerald-500/20 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.87 11.87 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.98 10.98 0 0 0 1 18h22a10.98 10.98 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                </svg>
                Android 앱 등록
                <span className="ml-2 text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full">필요</span>
              </button>
            )}
            
            {isIOSAppRegistered || project.platforms?.includes('IOS') ? (
              <button 
                onClick={() => setIsIOSModalOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 font-medium transition-all flex items-center border border-blue-500/20 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.74 3.51 7.1 8.42 6.82c1.74-.08 2.9.83 3.84.83.93 0 2.65-1.03 4.5-.88 1.65.14 2.95.81 3.79 2.01-3.34 2.23-2.77 6.76.5 8.5z"/>
                  <path d="M12.77 4.05c.83-1.07 1.41-2.55 1.2-4.05-1.4.07-3.08.96-4.05 2.13-.85 1.04-1.56 2.56-1.28 4.02 1.49.12 3.03-.74 4.13-2.1z"/>
                </svg>
                iOS 앱 수정
              </button>
            ) : (
              <button 
                onClick={() => setIsIOSModalOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-gray-600/15 hover:bg-gray-600/25 text-gray-300 font-medium transition-all flex items-center border border-gray-500/20 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.74 3.51 7.1 8.42 6.82c1.74-.08 2.9.83 3.84.83.93 0 2.65-1.03 4.5-.88 1.65.14 2.95.81 3.79 2.01-3.34 2.23-2.77 6.76.5 8.5z"/>
                  <path d="M12.77 4.05c.83-1.07 1.41-2.55 1.2-4.05-1.4.07-3.08.96-4.05 2.13-.85 1.04-1.56 2.56-1.28 4.02 1.49.12 3.03-.74 4.13-2.1z"/>
                </svg>
                iOS 앱 등록
                <span className="ml-2 text-xs bg-gray-500/20 px-2 py-0.5 rounded-full">필요</span>
              </button>
            )}
          </div>
        </div>

        {/* 앱 설정 온보딩 */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#0D1117] to-[#161B22] mb-10 relative overflow-hidden shadow-xl">
          {/* 배경 장식 요소 */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"></div>
          <div className="absolute top-20 left-40 w-24 h-24 bg-green-500/10 rounded-full blur-xl"></div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-5 shadow-lg shadow-blue-500/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">프로젝트 설정 가이드</h2>
                  <p className="text-blue-300/80 text-sm mt-1.5">딥링크 활성화를 위한 3단계 설정</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium shadow-lg shadow-blue-500/20 animate-pulse">
                필수 설정
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 스텝 1: 프로젝트 생성 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all shadow-lg relative group hover:transform hover:scale-[1.02] duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-3 shadow-inner">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-white font-semibold text-lg">프로젝트 생성</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    프로젝트가 성공적으로 생성되었습니다. 이제 앱과 도메인을 설정해 보세요.
                  </p>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    완료됨
                  </span>
                </div>
              </div>
              
              {/* 스텝 2: 앱 등록 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all shadow-lg relative group hover:transform hover:scale-[1.02] duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-3 shadow-inner">
                      <span className="text-blue-400 font-bold text-lg">2</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">앱 등록</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    딥링크를 사용하려면 모바일 앱을 등록하세요. Android와 iOS 모두 지원합니다.
                  </p>
                  <div className="flex gap-3">
                    {isAndroidAppRegistered ? (
                      <button 
                        onClick={() => setIsAndroidModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-green-600 text-white text-xs font-medium flex items-center shadow-lg shadow-green-500/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Android 완료
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsAndroidModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 text-xs font-medium flex items-center hover:from-green-500/30 hover:to-green-600/30 transition-all shadow-md hover:shadow-green-500/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.523 15.34c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m-11.046 0c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m11.816-6.5l1.571-2.718a.325.325 0 00-.12-.445.325.325 0 00-.445.12l-1.59 2.754a10.384 10.384 0 00-4.709-1.12c-1.7 0-3.304.414-4.73 1.146L6.69 5.792a.33.33 0 00-.445-.12.33.33 0 00-.12.445l1.572 2.718c-2.438 1.665-4.047 4.345-4.047 7.394h15.703c0-3.049-1.61-5.73-4.047-7.394M7.168 13.434a.906.906 0 110-1.813.906.906 0 010 1.813m9.665 0a.906.906 0 110-1.813.906.906 0 010 1.813"/>
                        </svg>
                        Android 등록
                      </button>
                    )}
                    
                    {isIOSAppRegistered ? (
                      <button 
                        onClick={() => setIsIOSModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-medium flex items-center shadow-lg shadow-blue-500/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        iOS 완료
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsIOSModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-400 text-xs font-medium flex items-center hover:from-blue-500/30 hover:to-blue-600/30 transition-all shadow-md hover:shadow-blue-500/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.74 3.51 7.1 8.42 6.82c1.74-.08 2.9.83 3.84.83.93 0 2.65-1.03 4.5-.88 1.65.14 2.95.81 3.79 2.01-3.34 2.23-2.77 6.76.5 8.5z"/>
                          <path d="M12.77 4.05c.83-1.07 1.41-2.55 1.2-4.05-1.4.07-3.08.96-4.05 2.13-.85 1.04-1.56 2.56-1.28 4.02 1.49.12 3.03-.74 4.13-2.1z"/>
                        </svg>
                        iOS 등록
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* 스텝 3: 도메인 설정 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all shadow-lg relative group hover:transform hover:scale-[1.02] duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-3 shadow-inner">
                      <span className="text-purple-400 font-bold text-lg">3</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">도메인 설정</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    딥링크에 사용할 도메인을 설정하세요. 사용자 경험을 위해 짧은 도메인을 권장합니다.
                  </p>
                  <button 
                    onClick={() => setIsCustomDomainModalOpen(true)}
                    className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 text-xs font-medium flex items-center hover:from-purple-500/30 hover:to-purple-600/30 transition-all shadow-md hover:shadow-purple-500/10"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                    도메인 추가하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-[#111] to-[#151515]">
            <h3 className="text-gray-400 font-medium mb-2">총 링크</h3>
            <p className="text-4xl font-bold text-white">1234</p>
          </div>
          <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-[#111] to-[#151515]">
            <h3 className="text-gray-400 font-medium mb-2">총 클릭</h3>
            <p className="text-4xl font-bold text-white">1234</p>
          </div>
          <div className="border border-gray-800 rounded-2xl p-6 bg-gradient-to-br from-[#111] to-[#151515]">
            <h3 className="text-gray-400 font-medium mb-2">전환율</h3>
            <p className="text-4xl font-bold text-white">1234</p>
          </div>
        </div>
        
        {/* 딥링크 생성 메뉴 */}
        {/* 딥링크 생성 메뉴 - 디자인 개선 버전 */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">딥링크 생성</h2>
              <p className="text-gray-400 text-sm mt-1">프로젝트의 딥링크를 쉽게 생성하고 관리하세요</p>
            </div>
            <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 딥링크 만들기
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-800 rounded-xl p-6 bg-gradient-to-br from-black/40 to-blue-900/10 hover:from-black/50 hover:to-blue-900/20 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-blue-500/5">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 shadow-inner group-hover:bg-blue-500/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-white font-medium text-lg">REST API 문서</h3>
              </div>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                프로그래밍 방식으로 딥링크를 생성하는 방법에 대한 API 문서를 확인하세요. 모든 엔드포인트와 파라미터가 자세히 설명되어 있습니다.
              </p>
              <button 
                onClick={() => window.location.href = window.location.pathname + '/docs/restapi'} 
                className="text-blue-400 text-sm font-medium flex items-center group-hover:text-blue-300 transition-colors">
                문서 보기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="border border-gray-800 rounded-xl p-6 bg-gradient-to-br from-black/40 to-purple-900/10 hover:from-black/50 hover:to-purple-900/20 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-purple-500/5">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 shadow-inner group-hover:bg-purple-500/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-white font-medium text-lg">API 키 관리</h3>
              </div>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                API 키를 생성하고 관리하여 안전하게 딥링크 API에 접근하세요. 키 권한 설정 및 사용량 모니터링이 가능합니다.
              </p>
              <button className="text-purple-400 text-sm font-medium flex items-center group-hover:text-purple-300 transition-colors">
                API 키 확인하기
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        
        {/* 링크 목록 */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">딥링크 목록</h2>
          <div className="overflow-hidden rounded-xl border border-gray-800">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-900">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    링크 이름
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    URL
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    클릭
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    생성일
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-black divide-y divide-gray-800">
                {[...Array(5)].map((_, index) => (
                  <tr key={index} className="hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {project.name} 링크 {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {project.customDomain ? 
                        `https://${project.customDomain}/${index + 1}` : 
                        `https://${project.id}.depl.link/${index + 1}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {Math.floor(Math.random() * 1000)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      2023-{Math.floor(Math.random() * 3) + 10}-{Math.floor(Math.random() * 28) + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        활성
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 플랫폼 정보 */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">플랫폼 설정</h2>
            <button 
              onClick={() => setIsPlatformModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 font-medium transition-all text-sm flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              플랫폼 추가
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.platforms.includes("Android") && (
              <div className="border border-gray-800 rounded-xl p-6 bg-black/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/15 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v18m0 0l-5.5-5.5M9 21l5.5-5.5" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-white">Android</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">패키지 이름</p>
                  <p className="text-sm font-medium text-white bg-gray-800 p-2 rounded">com.example.{project.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">SHA-256 인증서 지문</p>
                  <p className="text-sm font-medium text-white bg-gray-800 p-2 rounded">FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C</p>
                </div>
              </div>
            )}
            
            {project.platforms.includes("iOS") && (
              <div className="border border-gray-800 rounded-xl p-6 bg-black/30">
                <div className="flex justify-between items-start">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-500/15 flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-white">iOS</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-white transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">번들 ID</p>
                  <p className="text-sm font-medium text-white bg-gray-800 p-2 rounded">com.example.{project.id}</p>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-400 mb-2">Team ID</p>
                  <p className="text-sm font-medium text-white bg-gray-800 p-2 rounded">A1BC2DE345</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2">앱 접두사</p>
                  <p className="text-sm font-medium text-white bg-gray-800 p-2 rounded">applinks</p>
                </div>
              </div>
            )}
            
            {!project.platforms.includes("Android") && (
              <div className="border border-dashed border-gray-700 rounded-xl p-6 bg-black/20 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v18m0 0l-5.5-5.5M9 21l5.5-5.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">Android 앱 등록</h3>
                <p className="text-gray-400 mb-6">Android 앱을 등록하여 딥링크를 활성화하세요.</p>
                <button className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all">
                  Android 앱 등록
                </button>
              </div>
            )}
            
            {!project.platforms.includes("iOS") && (
              <div className="border border-dashed border-gray-700 rounded-xl p-6 bg-black/20 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-gray-500/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">iOS 앱 등록</h3>
                <p className="text-gray-400 mb-6">iOS 앱을 등록하여 딥링크를 활성화하세요.</p>
                <button className="px-5 py-2.5 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-medium transition-all">
                  iOS 앱 등록
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

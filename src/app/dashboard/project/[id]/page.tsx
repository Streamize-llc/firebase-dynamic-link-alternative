"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import RegisterAndroidModal from "@/components/modal/register-android"
import RegisterIOSModal from "@/components/modal/register-ios"
import RegisterDomainModal from "@/components/modal/register-domain"
import { getProject, getDeepLinkAdmin } from "@/utils/action/server"
import { getCurrentLanguage } from "@/utils/action/client";

// 번역 객체 정의
const translations = {
  ko: {
    projectSettingsGuide: "프로젝트 설정 가이드",
    deepLinkActivation: "딥링크 활성화를 위한 3단계 설정",
    requiredSettings: "필수 설정",
    projectCreation: "프로젝트 생성",
    projectCreationSuccess: "프로젝트가 성공적으로 생성되었습니다. 이제 앱과 도메인을 설정해 보세요.",
    completed: "완료됨",
    appRegistration: "앱 등록",
    appRegistrationDesc: "딥링크를 사용하려면 모바일 앱을 등록하세요. Android와 iOS 모두 지원합니다.",
    androidCompleted: "Android 완료",
    androidRegister: "Android 등록",
    iosCompleted: "iOS 완료",
    iosRegister: "iOS 등록",
    domainSetting: "도메인 설정",
    domainSettingDesc: "딥링크에 사용할 도메인을 설정하세요. 사용자 경험을 위해 짧은 도메인을 권장합니다.",
    domainSettingCompleted: "도메인 설정 완료",
    addDomain: "도메인 추가하기",
    deepLinkCreation: "딥링크 생성",
    deepLinkCreationDesc: "프로젝트의 딥링크를 쉽게 생성하고 관리하세요",
    restApiDocs: "REST API 문서",
    restApiDocsDesc: "프로그래밍 방식으로 딥링크를 생성하는 방법에 대한 API 문서를 확인하세요. 모든 엔드포인트와 파라미터가 자세히 설명되어 있습니다.",
    viewDocs: "문서 보기",
    keyManagement: "키 관리",
    keyManagementDesc: "API 키와 클라이언트 키를 생성하고 관리하여 안전하게 딥링크 서비스에 접근하세요. 키 권한 설정 및 사용량 모니터링이 가능합니다.",
    checkApiKey: "API 키 확인하기",
    checkClientKey: "클라이언트 키 확인하기",
    deepLinkList: "딥링크 목록",
    deepLinkListDesc: "디버깅 용으로 제공되는 최근 생성된 10개의 딥링크를 출력합니다.",
    slug: "슬러그",
    url: "URL",
    clicks: "클릭수",
    creationDate: "생성일",
    noDeepLinks: "아직 생성된 딥링크가 없습니다.",
    createFirstDeepLink: "첫 딥링크 생성하기",
    androidAppEdit: "Android 앱 수정",
    iosAppEdit: "iOS 앱 수정",
    required: "필요"
  },
  en: {
    projectSettingsGuide: "Project Settings Guide",
    deepLinkActivation: "3-step setup for deep link activation",
    requiredSettings: "Required Settings",
    projectCreation: "Project Creation",
    projectCreationSuccess: "Project has been successfully created. Now set up your apps and domain.",
    completed: "Completed",
    appRegistration: "App Registration",
    appRegistrationDesc: "Register your mobile apps to use deep links. Both Android and iOS are supported.",
    androidCompleted: "Android Completed",
    androidRegister: "Register Android",
    iosCompleted: "iOS Completed",
    iosRegister: "Register iOS",
    domainSetting: "Domain Setting",
    domainSettingDesc: "Set up a domain for your deep links. Short domains are recommended for better user experience.",
    domainSettingCompleted: "Domain Setting Completed",
    addDomain: "Add Domain",
    deepLinkCreation: "Deep Link Creation",
    deepLinkCreationDesc: "Easily create and manage deep links for your project",
    restApiDocs: "REST API Docs",
    restApiDocsDesc: "Check the API documentation on how to create deep links programmatically. All endpoints and parameters are explained in detail.",
    viewDocs: "View Docs",
    keyManagement: "Key Management",
    keyManagementDesc: "Create and manage API keys and client keys to securely access the deep link service. Key permission settings and usage monitoring are available.",
    checkApiKey: "Check API Key",
    checkClientKey: "Check Client Key",
    deepLinkList: "Deep Link List",
    deepLinkListDesc: "Displays the 10 most recently created deep links for debugging purposes.",
    slug: "Slug",
    url: "URL",
    clicks: "Clicks",
    creationDate: "Creation Date",
    noDeepLinks: "No deep links have been created yet.",
    createFirstDeepLink: "Create Your First Deep Link",
    androidAppEdit: "Edit Android App",
    iosAppEdit: "Edit iOS App",
    required: "Required"
  },
  ja: {
    projectSettingsGuide: "プロジェクト設定ガイド",
    deepLinkActivation: "ディープリンク有効化のための3ステップ設定",
    requiredSettings: "必須設定",
    projectCreation: "プロジェクト作成",
    projectCreationSuccess: "プロジェクトが正常に作成されました。アプリとドメインを設定してください。",
    completed: "完了",
    appRegistration: "アプリ登録",
    appRegistrationDesc: "ディープリンクを使用するにはモバイルアプリを登録してください。AndroidとiOSの両方をサポートしています。",
    androidCompleted: "Android完了",
    androidRegister: "Android登録",
    iosCompleted: "iOS完了",
    iosRegister: "iOS登録",
    domainSetting: "ドメイン設定",
    domainSettingDesc: "ディープリンクに使用するドメインを設定してください。ユーザー体験のために短いドメインをお勧めします。",
    domainSettingCompleted: "ドメイン設定完了",
    addDomain: "ドメイン追加",
    deepLinkCreation: "ディープリンク作成",
    deepLinkCreationDesc: "プロジェクトのディープリンクを簡単に作成・管理できます",
    restApiDocs: "REST APIドキュメント",
    restApiDocsDesc: "プログラムでディープリンクを作成する方法についてのAPIドキュメントを確認してください。すべてのエンドポイントとパラメータが詳細に説明されています。",
    viewDocs: "ドキュメントを見る",
    keyManagement: "キー管理",
    keyManagementDesc: "APIキーとクライアントキーを作成・管理して、ディープリンクサービスに安全にアクセスしてください。キー権限設定と使用量モニタリングが可能です。",
    checkApiKey: "APIキーを確認",
    checkClientKey: "クライアントキーを確認",
    deepLinkList: "ディープリンク一覧",
    deepLinkListDesc: "デバッグ用に最近作成された10個のディープリンクを表示します。",
    slug: "スラッグ",
    url: "URL",
    clicks: "クリック数",
    creationDate: "作成日",
    noDeepLinks: "まだディープリンクが作成されていません。",
    createFirstDeepLink: "最初のディープリンクを作成",
    androidAppEdit: "Androidアプリ編集",
    iosAppEdit: "iOSアプリ編集",
    required: "必須"
  }
};

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
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false)
  const [deeplinks, setDeeplinks] = useState<any[]>([])
  const lang = getCurrentLanguage();
  const t = translations[lang as keyof typeof translations] || translations.en;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setIsLoading(true);
        
        // server.ts에서 getProject 함수 호출
        const projectData = await getProject(projectId);
        const deeplinks = await getDeepLinkAdmin(projectId);

        // 프로젝트 데이터 설정
        setProject(projectData);
        setDeeplinks(deeplinks);
        
        // 앱 등록 상태 확인
        checkAppRegistrationStatus(projectData);
        
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  // 앱 등록 상태 확인 함수
  const checkAppRegistrationStatus = (projectData: any) => {
    if (!projectData || !projectData.apps) return;
    
    // 안드로이드 앱 등록 상태 확인
    const androidApp = projectData.apps.find((app: any) => app.platform === 'ANDROID');
    setIsAndroidAppRegistered(!!androidApp);
    
    // iOS 앱 등록 상태 확인
    const iosApp = projectData.apps.find((app: any) => app.platform === 'IOS');
    setIsIOSAppRegistered(!!iosApp);
  };

  // 앱 정보 업데이트 함수
  const updateAppInfo = (platform: 'ANDROID' | 'IOS', platformData: any) => {
    if (!project) return;
    
    // 현재 프로젝트 데이터에서 앱 목록 업데이트
    const updatedApps = [...(project.apps || [])];
    
    // 해당 플랫폼 앱 인덱스 찾기
    const appIndex = updatedApps.findIndex((app: any) => app.platform === platform);
    
    if (appIndex >= 0) {
      // 기존 앱 정보 업데이트
      updatedApps[appIndex].platform_data = platformData;
    } else {
      // 새 앱 정보 추가
      updatedApps.push({
        platform,
        platform_data: platformData
      });
    }
    
    // 프로젝트 데이터 업데이트
    setProject({
      ...project,
      apps: updatedApps
    });
  };

  const handleAndroidRegister = (data: { packageName: string; sha256_list: string[] }) => {
    // 안드로이드 앱 정보 업데이트
    updateAppInfo('ANDROID', {
      package_name: data.packageName,
      sha256_list: data.sha256_list
    });
    
    setIsAndroidAppRegistered(true);
  };

  const handleIOSRegister = (data: { bundleId: string; teamId: string; appId: string }) => {
    // iOS 앱 정보 업데이트
    updateAppInfo('IOS', {
      bundle_id: data.bundleId,
      team_id: data.teamId,
      app_id: data.appId
    });
    
    setIsIOSAppRegistered(true);
  };

  const handleDomainRegister = (data: { subDomain: string }) => {
    if (project) {
      setProject({
        ...project,
        sub_domain: data.subDomain
      });
    }
    setIsDomainModalOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard.');
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

      <RegisterDomainModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
        onRegister={handleDomainRegister}
        project={project}
      />

      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">{project.name}</h1>
            {/* <p className="text-gray-400 text-lg">fgdfgdf</p> */}
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
                {t.androidAppEdit}
              </button>
            ) : (
              <button 
                onClick={() => setIsAndroidModalOpen(true)}
                className="px-4 py-2.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-medium transition-all flex items-center border border-emerald-500/20 shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24a11.87 11.87 0 0 0-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48A10.98 10.98 0 0 0 1 18h22a10.98 10.98 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
                </svg>
                {t.androidRegister}
                <span className="ml-2 text-xs bg-emerald-500/20 px-2 py-0.5 rounded-full">{t.required}</span>
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
                {t.iosAppEdit}
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
                {t.iosRegister}
                <span className="ml-2 text-xs bg-gray-500/20 px-2 py-0.5 rounded-full">{t.required}</span>
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
                  <h2 className="text-2xl font-bold text-white tracking-tight">{t.projectSettingsGuide}</h2>
                  <p className="text-blue-300/80 text-sm mt-1.5">{t.deepLinkActivation}</p>
                </div>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium shadow-lg shadow-blue-500/20 animate-pulse">
                {t.requiredSettings}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 스텝 1: 프로젝트 생성 */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all shadow-lg relative group hover:transform hover:scale-[1.02] duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mr-3 shadow-inner">
                      <span className="text-green-400 font-bold text-lg">1</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">{t.projectCreation}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    {t.projectCreationSuccess}
                  </p>
                  <span className="inline-flex items-center px-4 py-2.5 rounded-lg bg-green-600 text-white text-xs font-medium shadow-lg shadow-green-500/20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t.completed}
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
                    <h3 className="text-white font-semibold text-lg">{t.appRegistration}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    {t.appRegistrationDesc}
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
                        {t.androidCompleted}
                      </button>
                    ) : (
                      <button 
                        onClick={() => setIsAndroidModalOpen(true)}
                        className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 text-xs font-medium flex items-center hover:from-green-500/30 hover:to-green-600/30 transition-all shadow-md hover:shadow-green-500/10"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.523 15.34c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m-11.046 0c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m11.816-6.5l1.571-2.718a.325.325 0 00-.12-.445.325.325 0 00-.445.12l-1.59 2.754a10.384 10.384 0 00-4.709-1.12c-1.7 0-3.304.414-4.73 1.146L6.69 5.792a.33.33 0 00-.445-.12.33.33 0 00-.12.445l1.572 2.718c-2.438 1.665-4.047 4.345-4.047 7.394h15.703c0-3.049-1.61-5.73-4.047-7.394M7.168 13.434a.906.906 0 110-1.813.906.906 0 010 1.813m9.665 0a.906.906 0 110-1.813.906.906 0 010 1.813"/>
                        </svg>
                        {t.androidRegister}
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
                        {t.iosCompleted}
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
                        {t.iosRegister}
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
                    <h3 className="text-white font-semibold text-lg">{t.domainSetting}</h3>
                  </div>
                  <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    {t.domainSettingDesc}
                  </p>
                  {project.sub_domain ? (
                    <button 
                      onClick={() => setIsDomainModalOpen(true)}
                      className="px-4 py-2.5 rounded-lg bg-purple-600 text-white text-xs font-medium flex items-center shadow-lg shadow-purple-500/20"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {t.domainSettingCompleted}
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsDomainModalOpen(true)}
                      className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-400 text-xs font-medium flex items-center hover:from-purple-500/30 hover:to-purple-600/30 transition-all shadow-md hover:shadow-purple-500/10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      {t.addDomain}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 통계 카드 */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
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
        </div> */}
        
        {/* 딥링크 생성 메뉴 */}
        {/* 딥링크 생성 메뉴 - 디자인 개선 버전 */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] mb-8 shadow-xl hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">{t.deepLinkCreation}</h2>
              <p className="text-gray-400 text-sm mt-1">{t.deepLinkCreationDesc}</p>
            </div>
            {/* <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 딥링크 만들기
            </button> */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-800 rounded-xl p-6 bg-gradient-to-br from-black/40 to-blue-900/10 hover:from-black/50 hover:to-blue-900/20 transition-all duration-300 cursor-pointer group shadow-md hover:shadow-blue-500/5">
              <div className="flex items-center mb-5">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 shadow-inner group-hover:bg-blue-500/30 transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-white font-medium text-lg">{t.restApiDocs}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                {t.restApiDocsDesc}
              </p>
              <button 
                onClick={() => window.location.href = window.location.pathname + '/docs/restapi'} 
                className="text-blue-400 text-sm font-medium flex items-center group-hover:text-blue-300 transition-colors">
                {t.viewDocs}
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
                <h3 className="text-white font-medium text-lg">{t.keyManagement}</h3>
              </div>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">
                {t.keyManagementDesc}
              </p>
              <div className="flex space-x-4">
                <button onClick={() => copyToClipboard(project.api_key)} className="text-purple-400 text-sm font-medium flex items-center group-hover:text-purple-300 transition-colors">
                  {t.checkApiKey}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button onClick={() => copyToClipboard(project.client_key)} className="text-green-400 text-sm font-medium flex items-center group-hover:text-green-300 transition-colors">
                  {t.checkClientKey}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 할당량 섹션 (현재 월간 이용량, 구독 여부부) */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] mb-8 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                할당량 및 사용량
              </h2>
              <p className="text-gray-400">현재 월간 이용량 및 구독 상태를 확인하세요</p>
            </div>
            <button className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              요금제 업그레이드
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">딥링크 생성</h3>
                <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">무제한</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{project.current_monthly_create_count}</span>
                <span className="text-gray-400 text-sm mb-1">개</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full w-full"></div>
              </div>
              <p className="text-gray-500 text-xs">무제한 생성 가능</p>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">월간 클릭 수</h3>
                <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full">기본</span>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{project.current_monthly_click_count}</span>
                <span className="text-gray-400 text-sm mb-1">/ 10,000</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(project.current_monthly_click_count / 100000) * 100}%` }}></div>
              </div>
              <p className="text-gray-500 text-xs">{100000 - project.current_monthly_click_count}개 클릭 남음</p>
            </div>
            
            <div className={`backdrop-blur-sm rounded-xl p-5 border ${project.subscription_tier === 'free' 
              ? 'bg-black/40 border-gray-800' 
              : 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-700'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">현재 구독</h3>
                {project.subscription_tier === 'free' ? (
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">기본</span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-indigo-500/30 text-indigo-300 rounded-full shadow-sm shadow-indigo-500/30">프리미엄</span>
                )}
              </div>
              <div className="flex items-end gap-2 mb-2">
                {project.subscription_tier === 'free' ? (
                  <>
                    <span className="text-3xl font-bold text-white">무료</span>
                    <span className="text-gray-400 text-sm mb-1">요금제</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">프리미엄</span>
                    <span className="text-indigo-200 text-sm mb-1">요금제</span>
                  </>
                )}
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
                {project.subscription_tier === 'free' ? (
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                ) : (
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full shadow-sm shadow-indigo-500/50" style={{ width: '100%' }}></div>
                )}
              </div>
              <p className={`text-xs ${project.subscription_tier === 'free' ? 'text-gray-500' : 'text-indigo-300'}`}>
                다음 갱신일: 2024년 12월 1일
              </p>
            </div>
          </div>
        </div>


        {/* 딥링크 목록 섹션 */}
        <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] mb-8 shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                {t.deepLinkList}
              </h2>
              <p className="text-gray-400">{t.deepLinkListDesc}</p>
            </div>
            {/* <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              새 딥링크 만들기
            </button> */}
          </div>
          
          <div className="overflow-hidden rounded-xl border border-gray-800 bg-black/40 backdrop-blur-sm shadow-inner">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gradient-to-r from-gray-900 to-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t.slug}
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t.url}
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t.clicks}
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {t.creationDate}
                  </th>
                  {/* <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    관리
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {deeplinks && deeplinks.length > 0 ? (
                  deeplinks.map((link, index) => (
                    <tr key={link.short_code} className={`hover:bg-indigo-900/10 transition-colors ${index % 2 === 0 ? 'bg-black/60' : 'bg-black/80'}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        <div className="flex items-center">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></span>
                          {link.slug}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <div className="flex items-center group">
                          <span className="truncate max-w-xs">
                            {link.sub_domain ? 
                              `https://${link.sub_domain}.depl.link/${link.short_code}` : 
                              `https://${project.sub_domain || project.id}.depl.link/${link.short_code}`}
                          </span>
                          <button className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(link.sub_domain ? 
                              `https://${link.sub_domain}.depl.link/${link.short_code}` : 
                              `https://${project.sub_domain || project.id}.depl.link/${link.short_code}`)}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400 hover:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-400">{link.click_count}</span>
                          <span className="ml-2 px-2 py-1 text-xs rounded-full bg-indigo-900/30 text-indigo-400">
                            {t.clicks}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {new Date(link.created_at).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => window.location.href = window.location.pathname + `/deeplink/${link.short_code}`}
                            className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            상세보기
                          </button>
                          <button 
                            className="px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            수정
                          </button>
                        </div>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        <p className="text-gray-400 mb-4">{t.noDeepLinks}</p>
                        <button 
                          onClick={() => window.location.href = window.location.pathname + '/deeplink/create'} 
                          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 text-sm shadow-md hover:shadow-indigo-500/20">
                          {t.createFirstDeepLink}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* {deeplinks && deeplinks.length > 0 && (
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">총 {deeplinks.length}개의 딥링크</p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors text-sm">
                  이전
                </button>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors text-sm">
                  다음
                </button>
              </div>
            </div>
          )} */}
        </div>

        
        {/* 링크 목록 */}
        {/* <div className="border border-gray-800 rounded-2xl p-8 bg-gradient-to-br from-[#111] to-[#151515] mb-8">
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
        </div> */}
        

      </div>
    </div>
  )
}

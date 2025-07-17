"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import RegisterAndroidModal from "@/components/modal/register-android"
import RegisterIOSModal from "@/components/modal/register-ios"
import RegisterDomainModal from "@/components/modal/register-domain"
import { getProject, getDeepLinkAdmin } from "@/utils/action/server"
import { getCurrentLanguage } from "@/utils/action/client"
import { 
  Check, 
  Smartphone, 
  Globe, 
  Key, 
  FileText, 
  Activity, 
  ArrowRight,
  Plus,
  ExternalLink,
  Copy,
  MoreVertical,
  Calendar,
  Link2,
  ChevronRight,
  Code,
  Zap
} from "lucide-react"

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
    restApiDocsDesc: "프로그래밍 방식으로 딥링크를 생성하는 방법에 대한 API 문서를 확인하세요.",
    viewDocs: "문서 보기",
    keyManagement: "키 관리",
    keyManagementDesc: "API 키와 클라이언트 키를 생성하고 관리하여 안전하게 딥링크 서비스에 접근하세요.",
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
    restApiDocsDesc: "Check the API documentation on how to create deep links programmatically.",
    viewDocs: "View Docs",
    keyManagement: "Key Management",
    keyManagementDesc: "Create and manage API keys and client keys to securely access the deep link service.",
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
    restApiDocsDesc: "プログラムでディープリンクを作成する方法についてのAPIドキュメントを確認してください。",
    viewDocs: "ドキュメントを見る",
    keyManagement: "キー管理",
    keyManagementDesc: "APIキーとクライアントキーを作成・管理して、ディープリンクサービスに安全にアクセスしてください。",
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

  if (isLoading || !project) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-800 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-800 rounded mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                <div className="h-10 w-10 bg-gray-800 rounded-lg mb-2"></div>
                <div className="h-6 w-20 bg-gray-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{project.name}</h1>
          <p className="text-gray-400 mt-2">{project.description || '딥링크 관리 및 분석 플랫폼'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center">
              <Link2 className="w-5 h-5 text-slate-400" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{deeplinks.length}</p>
          <p className="text-xs text-gray-400 mt-1">딥링크</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-900/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-sm text-gray-500">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">0</p>
          <p className="text-xs text-gray-400 mt-1">클릭수</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-900/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-indigo-400" />
            </div>
            <span className="text-sm text-gray-500">Platforms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isIOSAppRegistered ? 'bg-gray-700' : 'bg-gray-800'
            }`}>
              <Smartphone className="w-4 h-4 text-gray-400" />
            </div>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isAndroidAppRegistered ? 'bg-emerald-900/20' : 'bg-gray-800'
            }`}>
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">연결된 앱</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-900/20 flex items-center justify-center">
              <Globe className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-sm text-gray-500">Domain</span>
          </div>
          <p className="text-sm font-medium text-white truncate">
            {project.sub_domain ? `${project.sub_domain}.depl.link` : '미설정'}
          </p>
          <p className="text-xs text-gray-400 mt-1">서브도메인</p>
        </div>
      </div>

      {/* Setup Progress */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t.projectSettingsGuide}</h2>
        <p className="text-sm text-gray-400 mb-6">{t.deepLinkActivation}</p>
        
        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              true ? 'bg-emerald-600' : 'bg-gray-800'
            }`}>
              {true ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className="text-sm font-medium text-gray-400">1</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{t.projectCreation}</h3>
              <p className="text-xs text-gray-400 mt-1">{t.projectCreationSuccess}</p>
            </div>
          </div>
          
          {/* Step 2 */}
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isAndroidAppRegistered && isIOSAppRegistered ? 'bg-emerald-600' : 'bg-gray-800'
            }`}>
              {isAndroidAppRegistered && isIOSAppRegistered ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className="text-sm font-medium text-gray-400">2</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{t.appRegistration}</h3>
              <p className="text-xs text-gray-400 mt-1">{t.appRegistrationDesc}</p>
              <div className="flex items-center space-x-2 mt-2">
                <button
                  onClick={() => setIsAndroidModalOpen(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center ${
                    isAndroidAppRegistered
                      ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-600/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Smartphone className="w-3 h-3 mr-1.5" />
                  Android {isAndroidAppRegistered && '✓'}
                </button>
                <button
                  onClick={() => setIsIOSModalOpen(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center ${
                    isIOSAppRegistered
                      ? 'bg-slate-800/30 text-slate-300 border border-slate-600/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Smartphone className="w-3 h-3 mr-1.5" />
                  iOS {isIOSAppRegistered && '✓'}
                </button>
              </div>
            </div>
          </div>
          
          {/* Step 3 */}
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              project.sub_domain ? 'bg-emerald-600' : 'bg-gray-800'
            }`}>
              {project.sub_domain ? (
                <Check className="w-5 h-5 text-white" />
              ) : (
                <span className="text-sm font-medium text-gray-400">3</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-white">{t.domainSetting}</h3>
              <p className="text-xs text-gray-400 mt-1">{t.domainSettingDesc}</p>
              <button
                onClick={() => setIsDomainModalOpen(true)}
                className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center ${
                  project.sub_domain
                    ? 'bg-indigo-900/20 text-indigo-400 border border-indigo-600/30'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Globe className="w-3 h-3 mr-1.5" />
                {project.sub_domain || t.addDomain}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all cursor-pointer group"
          onClick={() => window.location.href = window.location.pathname + '/docs/restapi'}
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mr-4">
              <Code className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{t.restApiDocs}</h3>
              <p className="text-sm text-gray-400">{t.restApiDocsDesc}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-indigo-400 group-hover:text-indigo-300">
            <span>{t.viewDocs}</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-lg bg-indigo-900/20 flex items-center justify-center mr-4">
              <Key className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white">{t.keyManagement}</h3>
              <p className="text-sm text-gray-400">{t.keyManagementDesc}</p>
            </div>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => copyToClipboard(project.api_key)} 
              className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <span className="text-sm text-gray-300">API Key</span>
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
            <button 
              onClick={() => copyToClipboard(project.client_key)} 
              className="flex items-center justify-between w-full px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
            >
              <span className="text-sm text-gray-300">Client Key</span>
              <Copy className="w-4 h-4 text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Deep Links Table */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">{t.deepLinkList}</h2>
              <p className="text-sm text-gray-400 mt-1">{t.deepLinkListDesc}</p>
            </div>
            <button className="flex items-center px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white text-sm font-medium rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              새 딥링크
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t.slug}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t.url}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t.clicks}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {t.creationDate}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {deeplinks && deeplinks.length > 0 ? (
                deeplinks.map((link) => (
                  <tr key={link.short_code} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Link2 className="w-4 h-4 text-gray-500 mr-2" />
                        <span className="text-sm font-medium text-white">{link.slug}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center group">
                        <span className="text-sm text-gray-400 truncate max-w-xs">
                          {link.sub_domain ? 
                            `https://${link.sub_domain}.depl.link/${link.short_code}` : 
                            `https://${project.sub_domain || project.id}.depl.link/${link.short_code}`}
                        </span>
                        <button 
                          onClick={() => copyToClipboard(link.sub_domain ? 
                            `https://${link.sub_domain}.depl.link/${link.short_code}` : 
                            `https://${project.sub_domain || project.id}.depl.link/${link.short_code}`)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Copy className="w-4 h-4 text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-white">{link.click_count}</span>
                        <Activity className="w-4 h-4 text-gray-500" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>
                          {new Date(link.created_at).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <Link2 className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-gray-400 mb-4">{t.noDeepLinks}</p>
                      <button className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all">
                        <Plus className="w-4 h-4 mr-2" />
                        {t.createFirstDeepLink}
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
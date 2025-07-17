"use client"

import { useState, useEffect } from "react"
import { getProjects } from "@/utils/action/server"
import { getCurrentLanguage } from "@/utils/action/client"
import { 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  RefreshCw,
  Shield,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  MoreVertical,
  Calendar,
  Activity,
  Code,
  Globe
} from "lucide-react"

export default function ApiKeysPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [visibleKeys, setVisibleKeys] = useState<{ [key: string]: boolean }>({})
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const lang = getCurrentLanguage()

  const translations = {
    ko: {
      title: "API 키 관리",
      subtitle: "프로젝트별 API 키와 클라이언트 키를 안전하게 관리하세요",
      apiKey: "API 키",
      clientKey: "클라이언트 키",
      projectName: "프로젝트 이름",
      keyType: "키 타입",
      lastUsed: "마지막 사용",
      created: "생성일",
      actions: "작업",
      showKey: "키 보기",
      hideKey: "키 숨기기",
      copyKey: "키 복사",
      regenerateKey: "키 재생성",
      deleteKey: "키 삭제",
      copied: "복사됨!",
      neverUsed: "사용 안함",
      usage: "사용량",
      requests: "요청",
      securityNotice: "보안 알림",
      securityMessage: "API 키는 서버 측에서만 사용하세요. 클라이언트 키는 프론트엔드에서 사용 가능합니다.",
      noProjects: "프로젝트가 없습니다",
      createFirst: "먼저 프로젝트를 생성하세요",
      regenerateConfirm: "정말로 이 키를 재생성하시겠습니까? 기존 키는 더 이상 작동하지 않습니다.",
      deleteConfirm: "정말로 이 키를 삭제하시겠습니까?",
      apiKeyDesc: "서버 측 API 호출용",
      clientKeyDesc: "클라이언트 측 통합용",
      usageLimit: "사용 제한",
      unlimited: "무제한",
      rateLimit: "Rate Limit",
      requestsPerMinute: "요청/분"
    },
    en: {
      title: "API Key Management",
      subtitle: "Securely manage API keys and client keys for your projects",
      apiKey: "API Key",
      clientKey: "Client Key",
      projectName: "Project Name",
      keyType: "Key Type",
      lastUsed: "Last Used",
      created: "Created",
      actions: "Actions",
      showKey: "Show Key",
      hideKey: "Hide Key",
      copyKey: "Copy Key",
      regenerateKey: "Regenerate Key",
      deleteKey: "Delete Key",
      copied: "Copied!",
      neverUsed: "Never Used",
      usage: "Usage",
      requests: "requests",
      securityNotice: "Security Notice",
      securityMessage: "Use API keys only on the server side. Client keys can be used in frontend applications.",
      noProjects: "No projects",
      createFirst: "Create a project first",
      regenerateConfirm: "Are you sure you want to regenerate this key? The existing key will stop working.",
      deleteConfirm: "Are you sure you want to delete this key?",
      apiKeyDesc: "For server-side API calls",
      clientKeyDesc: "For client-side integration",
      usageLimit: "Usage Limit",
      unlimited: "Unlimited",
      rateLimit: "Rate Limit",
      requestsPerMinute: "requests/min"
    },
    ja: {
      title: "APIキー管理",
      subtitle: "プロジェクトのAPIキーとクライアントキーを安全に管理",
      apiKey: "APIキー",
      clientKey: "クライアントキー",
      projectName: "プロジェクト名",
      keyType: "キータイプ",
      lastUsed: "最終使用",
      created: "作成日",
      actions: "アクション",
      showKey: "キーを表示",
      hideKey: "キーを隠す",
      copyKey: "キーをコピー",
      regenerateKey: "キーを再生成",
      deleteKey: "キーを削除",
      copied: "コピーしました！",
      neverUsed: "未使用",
      usage: "使用量",
      requests: "リクエスト",
      securityNotice: "セキュリティ通知",
      securityMessage: "APIキーはサーバー側でのみ使用してください。クライアントキーはフロントエンドで使用できます。",
      noProjects: "プロジェクトがありません",
      createFirst: "最初にプロジェクトを作成してください",
      regenerateConfirm: "本当にこのキーを再生成しますか？既存のキーは動作しなくなります。",
      deleteConfirm: "本当にこのキーを削除しますか？",
      apiKeyDesc: "サーバー側API呼び出し用",
      clientKeyDesc: "クライアント側統合用",
      usageLimit: "使用制限",
      unlimited: "無制限",
      rateLimit: "レート制限",
      requestsPerMinute: "リクエスト/分"
    }
  }

  const t = translations[lang as keyof typeof translations] || translations.en

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading projects:", error)
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = async (text: string, keyId: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(24) + key.substring(key.length - 4)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-64 bg-gray-800 rounded mb-4"></div>
          <div className="h-6 w-96 bg-gray-800 rounded mb-8"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <div className="h-6 w-48 bg-gray-800 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-800 rounded"></div>
                  <div className="h-4 w-full bg-gray-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <p className="text-gray-400 mt-2">{t.subtitle}</p>
      </div>

      {/* Security Notice */}
      <div className="bg-amber-900/10 border border-amber-700/20 rounded-lg p-4 flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-amber-400">{t.securityNotice}</h3>
          <p className="text-sm text-gray-300 mt-1">{t.securityMessage}</p>
        </div>
      </div>

      {/* API Keys List */}
      {projects.length === 0 ? (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-gray-600" />
          </div>
          <p className="text-gray-400 mb-4">{t.noProjects}</p>
          <p className="text-sm text-gray-500">{t.createFirst}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden">
              {/* Project Header */}
              <div className="px-6 py-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-700/30 to-slate-600/30 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <Activity className="w-4 h-4" />
                    <span>0 {t.requests}</span>
                  </div>
                </div>
              </div>

              {/* Keys */}
              <div className="divide-y divide-gray-800">
                {/* API Key */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center">
                          <Key className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{t.apiKey}</h4>
                          <p className="text-xs text-gray-400">{t.apiKeyDesc}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-4">
                        <code className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-sm font-mono text-gray-300">
                          {visibleKeys[`${project.id}-api`] ? project.api_key : maskKey(project.api_key)}
                        </code>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleKeyVisibility(`${project.id}-api`)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title={visibleKeys[`${project.id}-api`] ? t.hideKey : t.showKey}
                          >
                            {visibleKeys[`${project.id}-api`] ? 
                              <EyeOff className="w-4 h-4 text-gray-400" /> : 
                              <Eye className="w-4 h-4 text-gray-400" />
                            }
                          </button>
                          
                          <button
                            onClick={() => copyToClipboard(project.api_key, `${project.id}-api`)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title={t.copyKey}
                          >
                            {copiedKey === `${project.id}-api` ? 
                              <Check className="w-4 h-4 text-emerald-400" /> : 
                              <Copy className="w-4 h-4 text-gray-400" />
                            }
                          </button>
                          
                          <button
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title={t.regenerateKey}
                          >
                            <RefreshCw className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center space-x-6 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {t.created}: {new Date(project.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          {t.rateLimit}: 100 {t.requestsPerMinute}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Key */}
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-900/20 flex items-center justify-center">
                          <Code className="w-4 h-4 text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-white">{t.clientKey}</h4>
                          <p className="text-xs text-gray-400">{t.clientKeyDesc}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center space-x-4">
                        <code className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-sm font-mono text-gray-300">
                          {visibleKeys[`${project.id}-client`] ? project.client_key : maskKey(project.client_key)}
                        </code>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleKeyVisibility(`${project.id}-client`)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title={visibleKeys[`${project.id}-client`] ? t.hideKey : t.showKey}
                          >
                            {visibleKeys[`${project.id}-client`] ? 
                              <EyeOff className="w-4 h-4 text-gray-400" /> : 
                              <Eye className="w-4 h-4 text-gray-400" />
                            }
                          </button>
                          
                          <button
                            onClick={() => copyToClipboard(project.client_key, `${project.id}-client`)}
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title={t.copyKey}
                          >
                            {copiedKey === `${project.id}-client` ? 
                              <Check className="w-4 h-4 text-emerald-400" /> : 
                              <Copy className="w-4 h-4 text-gray-400" />
                            }
                          </button>
                          
                          <button
                            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                            title={t.regenerateKey}
                          >
                            <RefreshCw className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center space-x-6 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {t.created}: {new Date(project.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          {t.rateLimit}: 1000 {t.requestsPerMinute}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
"use client"

import React, { useState, useEffect } from "react"
import { getProject } from "@/utils/action/server"
import { useParams } from "next/navigation"
import { Tables } from "@/utils/supabase/schema.type"

export default function RestApiDocumentation() {
  const [activeSection, setActiveSection] = useState<string>("authentication")
  const [project, setProject] = useState<Tables<"projects"> | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  
  const params = useParams()
  const projectId = params.id as string

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        const projectData = await getProject(projectId)
        setProject(projectData)
      } catch (err) {
        console.error("프로젝트 정보를 가져오는 중 오류가 발생했습니다:", err)
        setError(err instanceof Error ? err.message : "프로젝트 정보를 가져오는 중 오류가 발생했습니다")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const sections: Record<string, { title: string; content: React.ReactNode }> = {
    authentication: {
      title: "인증",
      content: (
        <div className="space-y-6">
          <div className="border-l-4 border-emerald-500 pl-4">
            <h3 className="text-xl font-semibold mb-3 text-emerald-400">API 키 인증</h3>
            <p className="mb-4 text-gray-300 leading-relaxed">
              모든 API 요청은 인증이 필요합니다. 인증을 위해 HTTP 헤더에 API 키를 포함해야 합니다.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] p-5 rounded-lg border border-[#333] shadow-lg mb-5">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-400 text-xs">HTTP 헤더</span>
            </div>
            <div className="flex items-center justify-between">
              <code className="text-emerald-400 font-mono block">
                Authorization: Bearer {project?.api_key || 'YOUR_API_KEY'}
              </code>
              <button 
                onClick={() => {
                  if (project?.api_key) {
                    navigator.clipboard.writeText(`Authorization: Bearer ${project.api_key}`);
                  }
                }}
                className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 p-2 rounded-md transition-colors duration-200"
                title="API 키 복사"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="bg-[#1a1a10] border border-yellow-900 rounded-lg p-4 flex flex-col items-center justify-center text-center">
            <div className="text-yellow-500 text-xl mb-2">⚠️</div>
            <p className="text-yellow-200 text-sm">
              API 키를 안전하게 보관하세요. 노출될 경우 악용될 수 있습니다.
            </p>
          </div>
        </div>
      )
    },
    endpoints: {
      title: "엔드포인트",
      content: (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-lg">
            <h3 className="text-xl font-bold mb-4 text-white bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">기본 URL</h3>
            <p className="mb-4 text-gray-300">모든 API 요청은 다음 기본 URL을 사용합니다:</p>
            <div className="bg-[#0f1629] p-4 rounded-lg border border-[#2d3748] flex items-center justify-between">
              <code className="text-emerald-400 font-mono">
                https://depl.link/api
              </code>
              <button className="bg-[#1e293b] hover:bg-[#2d3748] text-gray-300 p-2 rounded-md transition-colors duration-200" title="복사">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] rounded-xl border border-[#334155] shadow-lg overflow-hidden">
            <div className="bg-[#1e293b] p-5 border-b border-[#334155] flex items-center justify-between">
              <div className="flex items-center">
                <span className="bg-gradient-to-r from-emerald-500 to-teal-400 text-white px-3 py-1.5 rounded-md text-xs font-bold mr-3 shadow-sm">POST</span>
                <code className="text-white font-mono text-lg">/deeplink</code>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800">이미지 생성</span>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  API 개요
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  딥링크 생성을 위한 API 엔드포인트입니다. 딥링크 생성 요청을 보내면 딥링크 URL을 반환합니다.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                  </svg>
                  요청 본문
                </h4>
                <div className="bg-[#0f1629] rounded-lg border border-[#2d3748] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#1a2234] border-b border-[#2d3748]">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    </div>
                    <span className="text-xs text-gray-400">Request JSON</span>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-emerald-400 font-mono">{`{
  "slug": "invite",
  "app_params": {
    "user_id": "123456789",
    "invite_code": "123456789"
  },
  "social_meta": {
    "title": "콘텐츠 제목",
    "description": "간단한 설명",
    "thumbnail_url": "https://yourdomain.com/images/thumbnail.png"
  }
}`}</code>
                  </pre>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  매개변수 설명
                </h4>
                <div className="overflow-x-auto rounded-lg border border-[#2d3748]">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#1a2234]">
                        <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">매개변수</th>
                        <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">타입</th>
                        <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">필수</th>
                        <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">설명</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-[#1a2234] transition-colors duration-150">
                        <td className="border-b border-[#2d3748] p-3"><code className="text-emerald-400 font-mono">slug</code></td>
                        <td className="border-b border-[#2d3748] p-3 text-gray-300">문자열</td>
                        <td className="border-b border-[#2d3748] p-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400">필수</span></td>
                        <td className="border-b border-[#2d3748] p-3 text-gray-300">생성할 딥링크 경로</td>
                      </tr>
                      <tr className="hover:bg-[#1a2234] transition-colors duration-150">
                        <td className="border-b border-[#2d3748] p-3"><code className="text-emerald-400 font-mono">app_params</code></td>
                        <td className="border-b border-[#2d3748] p-3 text-gray-300">객체</td>
                        <td className="border-b border-[#2d3748] p-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400">필수</span></td>
                        <td className="border-b border-[#2d3748] p-3 text-gray-300">iOS 또는 Android 앱에서 딥링크가 열릴 때 앱이 수신할 파라미터</td>
                      </tr>
                      <tr className="hover:bg-[#1a2234] transition-colors duration-150">
                        <td className="border-b border-[#2d3748] p-3"><code className="text-emerald-400 font-mono">social_meta</code></td>
                        <td className="border-b border-[#2d3748] p-3 text-gray-300">객체</td>
                        <td className="border-b border-[#2d3748] p-3"><span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-400">선택</span></td>
                        <td className="border-b border-[#2d3748] p-3 text-gray-300">링크 공유 시 표시될 메타데이터 (제목, 설명, 썸네일 등)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  응답
                </h4>
                <div className="bg-[#0f1629] rounded-lg border border-[#2d3748] overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-[#1a2234] border-b border-[#2d3748]">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    </div>
                    <span className="text-xs text-gray-400">Response JSON</span>
                  </div>
                  <pre className="p-4 overflow-x-auto">
                    <code className="text-emerald-400 font-mono">{`{
  "success": true,
  "deeplink_url": "https://app.depl.link/a1b2",
  "created_at": "2023-09-15T08:30:45Z"
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  유스케이스별 예시
                </h4>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-[#1a2234] to-[#0f1629] rounded-lg border border-[#2d3748] overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between px-5 py-3 bg-[#1a2234] border-b border-[#2d3748]">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                        </div>
                        <span className="text-white font-medium text-lg">친구 초대 딥링크</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-indigo-900/50 text-indigo-300 font-mono">POST /api/deeplink</span>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-300 mb-4">사용자가 친구를 초대할 때 사용하는 딥링크입니다. 이 딥링크를 통해 앱 내 친구 초대 화면으로 바로 이동하고 리퍼럴 코드를 자동으로 적용할 수 있습니다. 아래 예시는 파이썬을 이용해서 친구 초대 딥링크를 생성하고 응답을 받는 방법을 보여줍니다.</p>
                      
                      <div className="mb-5">
                        <div className="bg-[#0d1220] rounded-lg overflow-hidden border border-[#2d3748]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#1a2234] border-b border-[#2d3748]">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            </div>
                            <span className="text-xs text-gray-400">Python</span>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-emerald-400 font-mono text-sm">{`import requests
import json

url = "https://api.depl.link/api/deeplink"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "app_params": {
        "screen": "invite",
        "referral_code": "USER123",
        "campaign": "summer_event"
    },
    "social_meta": {
        "title": "친구 초대하고 포인트 받기",
        "description": "지금 앱에 가입하면 5,000포인트를 드려요!",
        "thumbnail_url": "https://example.com/invite_image.jpg"
    },
    "slug": "invite-friend"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`}</code>
                          </pre>
                        </div>
                      </div>
                      
                      <div>
                        <div className="bg-[#0d1220] rounded-lg overflow-hidden border border-[#2d3748]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#1a2234] border-b border-[#2d3748]">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            </div>
                            <span className="text-xs text-gray-400">Response JSON</span>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-emerald-400 font-mono text-sm">{`{
  "success": true,
  "deeplink_url": "https://app.depl.link/a1b2",
  "created_at": "2023-09-15T08:30:45Z"
}`}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-[#1a2234] to-[#0f1629] rounded-lg border border-[#2d3748] overflow-hidden shadow-lg">
                    <div className="flex items-center justify-between px-5 py-3 bg-[#1a2234] border-b border-[#2d3748]">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-white font-medium text-lg">커머스 상품 상세 딥링크</span>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-rose-900/50 text-rose-300 font-mono">POST /api/deeplink</span>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-300 mb-4">특정 상품 페이지로 바로 이동하는 딥링크입니다. 상품 ID와 카테고리 정보를 포함하여 사용자에게 원활한 쇼핑 경험을 제공합니다. 앱 내 상품 상세 화면으로 직접 연결되어 전환율을 높이는 데 효과적입니다.</p>
                      
                      <div className="mb-5">
                        <div className="bg-[#0d1220] rounded-lg overflow-hidden border border-[#2d3748]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#1a2234] border-b border-[#2d3748]">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            </div>
                            <span className="text-xs text-gray-400">Python</span>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-emerald-400 font-mono text-sm">{`import requests
import json

url = "https://api.depl.link/api/deeplink"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
}
payload = {
    "app_params": {
        "screen": "product_detail",
        "product_id": "P12345",
        "category": "electronics"
    },
    "social_meta": {
        "title": "최신 스마트폰 특가",
        "description": "단 3일간 한정 특가! 지금 바로 확인하세요.",
        "thumbnail_url": "https://example.com/product_image.jpg"
    },
    "slug": "product-p12345"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`}</code>
                          </pre>
                        </div>
                      </div>
                      
                      <div>

                        <div className="bg-[#0d1220] rounded-lg overflow-hidden border border-[#2d3748]">
                          <div className="flex items-center justify-between px-4 py-2 bg-[#1a2234] border-b border-[#2d3748]">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            </div>
                            <span className="text-xs text-gray-400">Response JSON</span>
                          </div>
                          <pre className="p-4 overflow-x-auto">
                            <code className="text-emerald-400 font-mono text-sm">{`{
  "success": true,
  "deeplink_url": "https://shop.depl.link/c3d4",
  "created_at": "2023-09-16T14:22:30Z"
}`}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-[#172554] to-[#1e3a8a] p-4 rounded-lg border border-[#2563eb] flex items-center">
                <div className="bg-blue-500 p-2 rounded-full mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-medium text-blue-300 mb-1">팁</h5>
                  <p className="text-blue-100 text-sm">
                    더 자세한 프롬프트를 사용할수록 더 정확한 이미지가 생성됩니다. 색상, 구도, 조명 등 구체적인 요소를 포함하세요.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    errors: {
      title: "오류 처리",
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-4">오류 코드</h3>
          <p className="mb-4">API는 다음과 같은 HTTP 상태 코드를 반환할 수 있습니다:</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-[#222]">
                  <th className="border border-[#333] p-3 text-left">상태 코드</th>
                  <th className="border border-[#333] p-3 text-left">설명</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#333] p-3"><code className="text-emerald-400">200 OK</code></td>
                  <td className="border border-[#333] p-3">요청이 성공적으로 처리되었습니다.</td>
                </tr>
                <tr>
                  <td className="border border-[#333] p-3"><code className="text-emerald-400">400 Bad Request</code></td>
                  <td className="border border-[#333] p-3">요청이 잘못되었습니다. 요청 본문을 확인하세요.</td>
                </tr>
                <tr>
                  <td className="border border-[#333] p-3"><code className="text-emerald-400">401 Unauthorized</code></td>
                  <td className="border border-[#333] p-3">인증에 실패했습니다. API 키를 확인하세요.</td>
                </tr>
                <tr>
                  <td className="border border-[#333] p-3"><code className="text-emerald-400">429 Too Many Requests</code></td>
                  <td className="border border-[#333] p-3">요청 한도를 초과했습니다.</td>
                </tr>
                <tr>
                  <td className="border border-[#333] p-3"><code className="text-emerald-400">500 Internal Server Error</code></td>
                  <td className="border border-[#333] p-3">서버 오류가 발생했습니다.</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">오류 응답 형식</h3>
          <pre className="bg-[#111] p-4 rounded-md overflow-x-auto">
            <code className="text-emerald-400">{`{
  "error": {
    "code": "invalid_prompt",
    "message": "프롬프트가 너무 짧습니다. 더 자세한 설명을 입력해주세요."
  }
}`}</code>
          </pre>
        </div>
      )
    },
    ratelimits: {
      title: "사용량 제한",
      content: (
        <div>
          <h3 className="text-xl font-semibold mb-4">요청 한도</h3>
          <p className="mb-4">API 사용량은 구독 플랜에 따라 제한됩니다:</p>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-[#222]">
                  <th className="border border-[#333] p-3 text-left">플랜</th>
                  <th className="border border-[#333] p-3 text-left">분당 요청 수</th>
                  <th className="border border-[#333] p-3 text-left">일일 요청 수</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#333] p-3">기본</td>
                  <td className="border border-[#333] p-3">10</td>
                  <td className="border border-[#333] p-3">100</td>
                </tr>
                <tr>
                  <td className="border border-[#333] p-3">프로</td>
                  <td className="border border-[#333] p-3">30</td>
                  <td className="border border-[#333] p-3">500</td>
                </tr>
                <tr>
                  <td className="border border-[#333] p-3">엔터프라이즈</td>
                  <td className="border border-[#333] p-3">100</td>
                  <td className="border border-[#333] p-3">무제한</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <p className="mb-4">한도를 초과하면 <code className="bg-[#111] px-2 py-1 rounded-md text-emerald-400">429 Too Many Requests</code> 오류가 반환됩니다.</p>
          <p className="mb-4">다음 HTTP 헤더를 통해 현재 사용량을 확인할 수 있습니다:</p>
          <ul className="list-disc pl-6 mb-4">
            <li className="mb-2"><code className="bg-[#111] px-2 py-1 rounded-md text-emerald-400">X-RateLimit-Limit</code>: 총 요청 한도</li>
            <li className="mb-2"><code className="bg-[#111] px-2 py-1 rounded-md text-emerald-400">X-RateLimit-Remaining</code>: 남은 요청 수</li>
            <li className="mb-2"><code className="bg-[#111] px-2 py-1 rounded-md text-emerald-400">X-RateLimit-Reset</code>: 한도 초기화까지 남은 시간(초)</li>
          </ul>
        </div>
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-xl">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">오류가 발생했습니다</h1>
          <p className="text-gray-400 mb-6">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">REST API 문서</h1>
        <p className="text-gray-400 mb-8">
          {project?.name} 프로젝트의 API 사용 방법에 대한 상세한 정보를 제공합니다.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/4">
            <div className="bg-[#111] rounded-lg p-4 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">목차</h2>
              <nav>
                <ul className="space-y-2">
                  {Object.entries(sections).map(([key, section]) => (
                    <li key={key}>
                      <button
                        onClick={() => setActiveSection(key)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                          activeSection === key
                            ? "bg-emerald-600 text-white"
                            : "hover:bg-[#222] text-gray-300"
                        }`}
                      >
                        {section.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <div className="bg-[#111] rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">{sections[activeSection].title}</h2>
              {sections[activeSection].content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

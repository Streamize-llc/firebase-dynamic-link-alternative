"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeBlock from "@/components/codeblock"
import { getProject } from "@/utils/action/server"
import { Tables } from "@/utils/supabase/schema.type"

export default function RestApiDocumentation() {
  const params = useParams()
  const projectId = params.id as string
  const [activeTab, setActiveTab] = useState("authentication")
  const [project, setProject] = useState<Tables<"projects"> | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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
    <div className="w-full max-w-7xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-emerald-400 drop-shadow-sm">REST API Documentation</h1>
        <div className="flex items-center mt-3">
          <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
            <p className="text-sm text-blue-400 font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 13.197l-4.419 2.617A1 1 0 014 15V4z" clipRule="evenodd" />
              </svg>
              Project ID: {projectId}
            </p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="authentication" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="mb-8">
          <TabsList className="bg-transparent h-auto p-0 mb-0">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              <TabsTrigger 
                value="authentication" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Authentication
              </TabsTrigger>
              <TabsTrigger 
                value="endpoints" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                API
              </TabsTrigger>
              <TabsTrigger 
                value="errors" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Error Handling
              </TabsTrigger>
              <TabsTrigger 
                value="ratelimits" 
                className="px-5 py-2.5 rounded-lg bg-gray-800/50 text-gray-400 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:font-medium transition-all duration-200 hover:bg-gray-700/50 hover:text-gray-200"
              >
                Rate Limits
              </TabsTrigger>
            </div>
          </TabsList>
        </div>
        
        <TabsContent value="authentication" className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">API Authentication Guide</h2>
          </div>
          
          <div className="space-y-6 text-gray-300">
            <p>All API requests require authentication. There are two types of keys you need to be aware of:</p>
            
            <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] p-5 rounded-lg border border-[#333] shadow-lg mb-5">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-400 text-xs">API Key (Server-side)</span>
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
                  title="Copy API Key"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-[#111] to-[#1a1a1a] p-5 rounded-lg border border-[#333] shadow-lg mb-5">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-gray-400 text-xs">Client Key (Client-side)</span>
              </div>
              <div className="flex items-center justify-between">
                <code className="text-emerald-400 font-mono block">
                  Authorization: Bearer {project?.client_key || 'YOUR_CLIENT_KEY'}
                </code>
                <button 
                  onClick={() => {
                    if (project?.client_key) {
                      navigator.clipboard.writeText(`Authorization: Bearer ${project.client_key}`);
                    }
                  }}
                  className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 p-2 rounded-md transition-colors duration-200"
                  title="Copy Client Key"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
              <p className="text-blue-300 font-medium">
                <strong>API Key:</strong> Used on the server-side to create deeplinks. Include this in your HTTP Authorization header when making API requests.
              </p>
            </div>
            
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-4">
              <p className="text-purple-300 font-medium">
                <strong>Client Key:</strong> Used on the client-side to retrieve parameter information from deeplinks. Also included in the Authorization header with Bearer prefix.
              </p>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-yellow-300 font-medium">
                Keep your keys secure. If exposed, they could be misused.
              </p>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="endpoints" className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">API Endpoints</h2>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] p-6 rounded-xl border border-[#334155] shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-white bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Base URL</h3>
              <p className="mb-4 text-gray-300">All API requests use the following base URL:</p>
              <div className="bg-[#0f1629] p-4 rounded-lg border border-[#2d3748] flex items-center justify-between">
                <code className="text-emerald-400 font-mono">
                  https://depl.link/api
                </code>
                <button 
                  onClick={() => navigator.clipboard.writeText("https://depl.link/api")}
                  className="bg-[#1e293b] hover:bg-[#2d3748] text-gray-300 p-2 rounded-md transition-colors duration-200" 
                  title="Copy"
                >
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
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-900/30 text-emerald-400 border border-emerald-800">Create Deeplink</span>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    API Overview
                  </h4>
                  <p className="text-gray-300 leading-relaxed">
                    This API endpoint is for creating deeplinks. When you send a deeplink creation request, it returns a deeplink URL.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                    Request Body
                  </h4>
                  <CodeBlock language="json" filename="Request JSON">
                    {`{
  "slug": "invite",
  "app_params": {
    "user_id": "123456789",
    "invite_code": "123456789"
  },
  "social_meta": {
    "title": "Content Title",
    "description": "Brief description",
    "thumbnail_url": "https://yourdomain.com/images/thumbnail.png"
  }
}`}
                  </CodeBlock>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Parameter Description
                  </h4>
                  <div className="overflow-x-auto rounded-lg border border-[#2d3748]">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#1a2234]">
                          <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">Parameter</th>
                          <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">Type</th>
                          <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">Required</th>
                          <th className="border-b border-[#2d3748] p-3 text-left text-gray-200">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="hover:bg-[#1a2234] transition-colors duration-150">
                          <td className="border-b border-[#2d3748] p-3"><code className="text-emerald-400 font-mono">slug</code></td>
                          <td className="border-b border-[#2d3748] p-3 text-gray-300">string</td>
                          <td className="border-b border-[#2d3748] p-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400">required</span></td>
                          <td className="border-b border-[#2d3748] p-3 text-gray-300">Path for the deeplink to be created</td>
                        </tr>
                        <tr className="hover:bg-[#1a2234] transition-colors duration-150">
                          <td className="border-b border-[#2d3748] p-3"><code className="text-emerald-400 font-mono">app_params</code></td>
                          <td className="border-b border-[#2d3748] p-3 text-gray-300">object</td>
                          <td className="border-b border-[#2d3748] p-3"><span className="text-xs px-2 py-1 rounded-full bg-emerald-900/30 text-emerald-400">required</span></td>
                          <td className="border-b border-[#2d3748] p-3 text-gray-300">Parameters that the app will receive when the deeplink is opened in iOS or Android app</td>
                        </tr>
                        <tr className="hover:bg-[#1a2234] transition-colors duration-150">
                          <td className="border-b border-[#2d3748] p-3"><code className="text-emerald-400 font-mono">social_meta</code></td>
                          <td className="border-b border-[#2d3748] p-3 text-gray-300">object</td>
                          <td className="border-b border-[#2d3748] p-3"><span className="text-xs px-2 py-1 rounded-full bg-gray-700/50 text-gray-400">optional</span></td>
                          <td className="border-b border-[#2d3748] p-3 text-gray-300">Metadata to be displayed when the link is shared (title, description, thumbnail, etc.)</td>
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
                    Response
                  </h4>
                  <CodeBlock language="json" filename="Response JSON">
                    {`{
  "success": true,
  "deeplink_url": "https://app.depl.link/a1b2",
  "created_at": "2023-09-15T08:30:45Z"
}`}
                  </CodeBlock>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Use Case Examples
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
                          <span className="text-white font-medium text-lg">Friend Invitation Deeplink</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-indigo-900/50 text-indigo-300 font-mono">POST /api/deeplink</span>
                      </div>
                      <div className="p-5">
                        <p className="text-gray-300 mb-4">This deeplink is used when a user invites a friend. Through this deeplink, users can directly navigate to the friend invitation screen in the app and automatically apply a referral code.</p>
                        
                        <CodeBlock language="python" filename="Python">
                          {`import requests
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
        "title": "Invite Friends and Get Points",
        "description": "Sign up now and get 5,000 points!",
        "thumbnail_url": "https://example.com/invite_image.jpg"
    },
    "slug": "invite-friend"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`}
                        </CodeBlock>
                        
                        <CodeBlock language="json" filename="Response JSON">
                          {`{
  "success": true,
  "deeplink_url": "https://app.depl.link/a1b2",
  "created_at": "2023-09-15T08:30:45Z"
}`}
                        </CodeBlock>
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
                          <span className="text-white font-medium text-lg">E-commerce Product Detail Deeplink</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-rose-900/50 text-rose-300 font-mono">POST /api/deeplink</span>
                      </div>
                      <div className="p-5">
                        <p className="text-gray-300 mb-4">This deeplink navigates directly to a specific product page. It includes product ID and category information to provide users with a seamless shopping experience.</p>
                        
                        <CodeBlock language="python" filename="Python">
                          {`import requests
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
        "title": "Latest Smartphone Special Deal",
        "description": "Limited special offer for 3 days only! Check it out now.",
        "thumbnail_url": "https://example.com/product_image.jpg"
    },
    "slug": "product-p12345"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
print(response.json())`}
                        </CodeBlock>
                        <CodeBlock language="json" filename="Response JSON">
                          {`{
  "success": true,
  "deeplink_url": "https://app.depl.link/b3c4",
  "created_at": "2023-09-16T14:22:33Z"
}`}
                        </CodeBlock>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-[#1a2234] to-[#0f1629] rounded-lg border border-[#2d3748] overflow-hidden shadow-lg">
                      <div className="flex items-center justify-between px-5 py-3 bg-[#1a2234] border-b border-[#2d3748]">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                            </svg>
                          </div>
                          <span className="text-white font-medium text-lg">Event Page Deeplink</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-900/50 text-amber-300 font-mono">POST /api/deeplink</span>
                      </div>
                      <div className="p-5">
                        <p className="text-gray-300 mb-4">This deeplink navigates directly to a specific event or promotion page. It includes event ID and campaign information to enhance marketing effectiveness.</p>
                        
                        <CodeBlock language="javascript" filename="JavaScript">
                          {`const axios = require('axios');

const url = 'https://api.depl.link/api/deeplink';
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer YOUR_API_KEY'
};
const payload = {
  "app_params": {
    "screen": "event_page",
    "event_id": "E789",
    "campaign": "summer_festival"
  },
  "social_meta": {
    "title": "Summer Festival Event",
    "description": "Join the Summer Festival with various benefits and prizes!",
    "thumbnail_url": "https://example.com/event_image.jpg"
  },
  "slug": "event-summer-festival"
};

axios.post(url, payload, { headers })
  .then(response => console.log(response.data))
  .catch(error => console.error('Error:', error));`}
                        </CodeBlock>
                        
                        <CodeBlock language="json" filename="Response JSON">
                          {`{
  "success": true,
  "deeplink_url": "https://app.depl.link/d5e6",
  "created_at": "2023-09-17T10:15:22Z"
}`}
                        </CodeBlock>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

import React from "react"
import Link from "next/link"
import { headers } from "next/headers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  
  const isProjectPage = pathname.includes('/dashboard/project/')
  const isRestapiDocs = pathname.includes('/docs/restapi')
  const isClientDocs = pathname.includes('/docs/client')
  
  return (
    <div className="flex w-full overflow-auto bg-black min-h-screen">
      <header className="fixed top-0 left-0 w-full h-[5rem] bg-black flex items-center justify-between px-6 z-10">
        {isProjectPage ? (
          <div className="flex space-x-4">
            <Link href={pathname.split('/docs/')[0]} className={`px-5 py-2 rounded-full ${!pathname.includes('/docs/') ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' : 'text-gray-400 bg-transparent border border-[#333]'} transition-all duration-200 flex items-center`}>
              <span className="text-sm font-medium">Project</span>
            </Link>
            <Link 
              href={`${pathname.split('/docs/')[0]}/docs/restapi`}
              className={`px-5 py-2 rounded-full ${isRestapiDocs ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' : 'text-gray-400 bg-transparent border border-[#333]'} transition-all duration-200 flex items-center`}
            >
              <span className="text-sm font-medium">API Documentation</span>
            </Link>
            <Link 
              href={`${pathname.split('/docs/')[0]}/docs/client`}
              className={`px-5 py-2 rounded-full ${isClientDocs ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg' : 'text-gray-400 bg-transparent border border-[#333]'} transition-all duration-200 flex items-center`}
            >
              <span className="text-sm font-medium">Client Integration</span>
            </Link>
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link href="#" className="px-5 py-2 rounded-full text-gray-400 bg-transparent border border-[#333] transition-all duration-200 flex items-center">
              <span className="text-sm font-medium">비디오 제작</span>
            </Link>
            <Link href="#" className="px-5 py-2 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg flex items-center">
              <span className="text-sm font-medium">이미지 제작</span>
            </Link>
          </div>
        )}
        <div className="flex items-center space-x-4">
          <div className="flex items-center px-4 py-1.5 rounded-full bg-[#222] border border-[#444]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-emerald-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-white">120</span>
          </div>
          <div className="flex items-center px-4 py-1.5 rounded-full bg-[#222] border border-[#444]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
            </svg>
            <span className="text-sm font-medium text-white">35</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#333] overflow-hidden">
            <img src="https://gcp-cdn.shineai.app/temp/ee/2025-02-14/e5d89715-3a29-4fc7-93f2-16e50af63552.jpg" alt="프로필" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>
      <main className="pt-[5rem] w-full">
        {children}
      </main>
    </div>
  )
}

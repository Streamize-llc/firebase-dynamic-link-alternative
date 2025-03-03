"use client"

import { useParams } from "next/navigation"

export default function DocsClientPage() {
  const params = useParams()
  const projectId = params.id as string

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">클라이언트 문서</h1>
      <p className="text-gray-500">프로젝트 ID: {projectId}</p>
      <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-lg mt-6">
        <p className="text-gray-400">빈 페이지</p>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createProject } from "@/utils/action/server"
import { useRouter } from "next/navigation"

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => void
}

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async () => {
    if (!projectName.trim()) return

    try {
      setIsSubmitting(true)
      setError(null)
      
      // 서버 액션을 사용하여 프로젝트 생성
      const newProject = await createProject(
        projectName.trim(),
        projectDescription.trim() || undefined
      )
      
      // 성공 시 콜백 호출
      onSubmit({
        name: projectName.trim(),
        description: projectDescription.trim() || undefined
      })
      
      // 상태 초기화
      setProjectName("")
      setProjectDescription("")
      
      // 모달 닫기
      onClose()
      
      // 페이지 새로고침
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "프로젝트 생성 중 오류가 발생했습니다")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-[#111] border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">새 프로젝트 생성</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="project-name" className="text-white">
              프로젝트 이름 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="프로젝트 이름을 입력하세요"
              className="bg-[#222] border-gray-700 text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description" className="text-white">
              설명 <span className="text-gray-400 text-sm">(선택사항)</span>
            </Label>
            <Textarea
              id="project-description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="프로젝트에 대한 설명을 입력하세요"
              className="bg-[#222] border-gray-700 text-white resize-none"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={onClose}
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!projectName.trim() || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                생성 중...
              </div>
            ) : "생성하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

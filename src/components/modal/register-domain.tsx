"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProjectSubDomain } from "@/utils/action/server";

interface RegisterDomainModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onRegister?: (data: { subDomain: string }) => void;
}

export default function RegisterDomainModal({
  isOpen,
  onClose,
  onRegister,
  project,
}: RegisterDomainModalProps) {
  const [subDomain, setSubDomain] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (project?.sub_domain) {
      setSubDomain(project.sub_domain);
    } else {
      setSubDomain('');
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await updateProjectSubDomain(project.id, subDomain);
      
      if (onRegister) {
        onRegister({ subDomain });
      }
      
      onClose();
    } catch (error: any) {
      console.error('서브도메인 등록 중 오류 발생:', error);
      setError(error.message || '서브도메인 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-[#111] to-[#151515] border border-gray-600 shadow-xl">
        <DialogHeader className="pb-3">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center mr-3 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <DialogTitle className="text-xl font-bold text-white">서브도메인 {project?.sub_domain ? '정보' : '등록'}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 mt-2">
            {project?.sub_domain 
              ? '서브도메인은 한 번 설정하면 변경할 수 없습니다. 변경이 필요한 경우 관리자에게 문의하세요.' 
              : '프로젝트의 서브도메인을 설정하여 딥링크를 활성화하세요. 한 번 설정하면 변경할 수 없습니다.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          
          {!project?.sub_domain && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-sm text-yellow-400">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>서브도메인은 <strong>한 번 설정하면 변경할 수 없습니다</strong>. 신중하게 결정해주세요.</span>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <Label htmlFor="subDomain" className="text-sm font-medium text-gray-300 flex items-center">
              <span>서브도메인</span>
              {!project?.sub_domain && (
                <span className="ml-2 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">필수</span>
              )}
            </Label>
            <div className="flex items-center">
              <Input
                id="subDomain"
                value={subDomain}
                onChange={(e) => setSubDomain(e.target.value)}
                placeholder="myproject"
                className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 rounded-r-none"
                required
                disabled={!!project?.sub_domain}
              />
              <div className="bg-gray-800 border border-gray-700 border-l-0 rounded-r-md px-3 py-2 text-gray-400">
                .delp.link
              </div>
            </div>
            <p className="text-xs text-gray-500 flex items-center mt-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.
            </p>
          </div>
          
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 mt-4">
            <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              도메인 사용 안내
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              등록한 서브도메인은 <span className="text-blue-300 font-medium">yourname.delp.link</span> 형태로 사용됩니다.
            </p>
          </div>
          
          <DialogFooter className="pt-5 mt-6">
            {project?.sub_domain ? (
              <Button 
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 ease-in-out w-full"
                onClick={() => window.open('mailto:support@delp.link?subject=서브도메인 변경 요청', '_blank')}
              >
                관리자에게 문의하기
              </Button>
            ) : (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white mr-3"
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 ease-in-out"
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      처리 중...
                    </div>
                  ) : '서브도메인 등록하기'}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

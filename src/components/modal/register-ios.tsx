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
import { createApp } from "@/utils/action/server";

interface RegisterIOSModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onRegister?: (data: { bundleId: string; teamId: string }) => void;
}

export default function RegisterIOSModal({
  isOpen,
  onClose,
  onRegister,
  project,
}: RegisterIOSModalProps) {
  console.log(project);
  const iosApp = project?.apps?.find((app: any) => app.platform === 'IOS');
  const isEditMode = !!iosApp;
  
  const [bundleId, setBundleId] = useState<string>('');
  const [teamId, setTeamId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // tests
    if (iosApp) {
      setBundleId(iosApp.platform_data.bundleId || '');
      setTeamId(iosApp.platform_data.teamId || '');
    } else {
      setBundleId(project.id ? `com.example.${project.id}` : '');
      setTeamId('');
    }
  }, [iosApp, project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // createApp 함수를 사용하여 iOS 앱 생성
      const platformData = {
        bundleId,
        teamId
      };
      
      await createApp(project.id, 'IOS', platformData);
      
      // 성공 후 onRegister 콜백 호출
      if (onRegister) {
        onRegister({ bundleId, teamId });
      }
      
      onClose();
    } catch (error: any) {
      console.error('iOS 앱 등록 중 오류 발생:', error);
      setError(error.message || '앱 등록 중 오류가 발생했습니다.');
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
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.74 3.51 7.1 8.42 6.82c1.74-.08 2.9.83 3.84.83.93 0 2.65-1.03 4.5-.88 1.65.14 2.95.81 3.79 2.01-3.34 2.23-2.77 6.76.5 8.5z"/>
                <path d="M12.77 4.05c.83-1.07 1.41-2.55 1.2-4.05-1.4.07-3.08.96-4.05 2.13-.85 1.04-1.56 2.56-1.28 4.02 1.49.12 3.03-.74 4.13-2.1z"/>
              </svg>
            </div>
            <DialogTitle className="text-xl font-bold text-white">iOS 앱 {isEditMode ? '수정' : '등록'}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 mt-2">
            iOS 앱 정보를 입력하여 딥링크를 활성화하세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <Label htmlFor="bundleId" className="text-sm font-medium text-gray-300 flex items-center">
              <span>번들 ID</span>
              <span className="ml-2 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">필수</span>
            </Label>
            <Input
              id="bundleId"
              value={bundleId}
              onChange={(e) => setBundleId(e.target.value)}
              placeholder="com.example.app"
              className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              required
            />
            <p className="text-xs text-gray-500 flex items-center mt-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              App Store에 등록된 앱의 번들 ID를 입력하세요.
            </p>
          </div>
          
          <div className="space-y-3 mt-6">
            <Label htmlFor="teamId" className="text-sm font-medium text-gray-300 flex items-center">
              <span>Apple 개발자 팀 ID</span>
              <span className="ml-2 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">필수</span>
            </Label>
            <Input
              id="teamId"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="ABCDE12345"
              className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              required
            />
            <p className="text-xs text-gray-500 flex items-center mt-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Apple Developer 계정의 팀 ID를 입력하세요.
            </p>
          </div>
          
          <DialogFooter className="pt-5 mt-6">
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
              ) : isEditMode ? '앱 수정하기' : '앱 등록하기'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

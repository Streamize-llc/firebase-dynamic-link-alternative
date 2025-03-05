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

interface RegisterAndroidModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onRegister?: (data: { packageName: string; sha256: string }) => void;
}

export default function RegisterAndroidModal({
  isOpen,
  onClose,
  onRegister,
  project,
}: RegisterAndroidModalProps) {
  const androidApp = project?.apps?.find((app: any) => app.platform === 'ANDROID');
  const isEditMode = !!androidApp;
  
  const [packageName, setPackageName] = useState<string>('');
  const [sha256, setSha256] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (androidApp) {
      setPackageName(androidApp.platform_data.package_name || '');
      setSha256(androidApp.platform_data.sha256 || '');
    } else {
      setPackageName(project.id ? `com.example.${project.id}` : '');
      setSha256('');
    }
  }, [androidApp, project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // createApp 함수 직접 호출
      const platformData = {
        package_name: packageName,
        sha256: sha256
      };
      
      await createApp(project.id, 'ANDROID', platformData);
      
      // 기존 onRegister 콜백이 있으면 호출
      if (onRegister) {
        onRegister({ packageName, sha256 });
      }
      
      onClose();
    } catch (error: any) {
      console.error('안드로이드 앱 등록 중 오류 발생:', error);
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
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.34l.5-1.2-2.2-1.7-2.5 1.7.6 1.2 1.7-1.2 1.9 1.2zM6.823 15.34l.5-1.2-2.2-1.7-2.5 1.7.6 1.2 1.7-1.2 1.9 1.2z"/>
                <path d="M12.723 2.44l-1.4.9-8.5 5.6-.5 1.2 8.5 5.5.5.1.5-.1 8.5-5.5-.5-1.2-8.5-5.6-1.4-.9h1.4zm-1.4 1.9l9.4 6-9.4 6-9.4-6 9.4-6z"/>
                <path d="M12.723 22.76l.5-.1 8.5-5.5-.5-1.2-8.5 5.6-8.5-5.6-.5 1.2 8.5 5.5.5.1z"/>
                <path d="M12.723 19.46l.5-.1 8.5-5.5-.5-1.2-8.5 5.6-8.5-5.6-.5 1.2 8.5 5.5.5.1z"/>
              </svg>
            </div>
            <DialogTitle className="text-xl font-bold text-white">Android 앱 {isEditMode ? '수정' : '등록'}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-400 mt-2">
            Android 앱 정보를 입력하여 딥링크를 활성화하세요.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-400">
              {error}
            </div>
          )}
          
          <div className="space-y-3">
            <Label htmlFor="packageName" className="text-sm font-medium text-gray-300 flex items-center">
              <span>패키지 이름</span>
              <span className="ml-2 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">필수</span>
            </Label>
            <Input
              id="packageName"
              value={packageName}
              onChange={(e) => setPackageName(e.target.value)}
              placeholder="com.example.app"
              className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              required
            />
            <p className="text-xs text-gray-500 flex items-center mt-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Google Play 스토어에 등록된 앱의 패키지 이름을 입력하세요.
            </p>
          </div>
          
          <div className="space-y-3 mt-6">
            <Label htmlFor="sha256" className="text-sm font-medium text-gray-300 flex items-center">
              <span>SHA-256 인증서 지문</span>
              <span className="ml-2 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">필수</span>
            </Label>
            <Input
              id="sha256"
              value={sha256}
              onChange={(e) => setSha256(e.target.value)}
              placeholder="FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0..."
              className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
              required
            />
            <p className="text-xs text-gray-500 flex items-center mt-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              앱 서명에 사용된 인증서의 SHA-256 지문을 입력하세요.
            </p>
          </div>
          
          {/* <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 mt-6">
            <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              무료 등록 혜택
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">현재 베타 서비스 기간으로 Android 앱 등록이 무료입니다. (정식 출시 후 월 ₩5,000)</p>
          </div> */}
          
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

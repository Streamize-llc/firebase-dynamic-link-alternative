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
import { getCurrentLanguage } from "@/utils/action/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RegisterAndroidModalProps {
  project: any;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: { packageName: string; sha256_list: string[]; }) => void;
}

export default function RegisterAndroidModal({
  isOpen,
  onClose,
  onRegister,
  project,
}: RegisterAndroidModalProps) {
  const androidApp = project?.apps?.find((app: any) => app.platform === 'ANDROID');
  const isEditMode = !!androidApp;
  const lang = getCurrentLanguage();
  
  const [packageName, setPackageName] = useState<string>('');
  const [sha256Fingerprints, setSha256Fingerprints] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const translations = {
    ko: {
      title: 'Android 앱 등록',
      titleEdit: 'Android 앱 수정',
      description: 'Android 앱 정보를 입력하여 딥링크를 활성화하세요.',
      packageName: '패키지 이름',
      required: '필수',
      packageNameHelp: 'Google Play 스토어에 등록된 앱의 패키지 이름을 입력하세요.',
      packageNameTooltip: '앱의 고유 식별자로, 보통 역방향 도메인 형식(com.회사명.앱이름)으로 작성합니다. Google Play Console에서 확인할 수 있습니다.',
      sha256: 'SHA-256 인증서 지문',
      sha256Help: '앱 서명에 사용된 인증서의 SHA-256 지문을 입력하세요. 최대 5개까지 추가할 수 있습니다.',
      sha256Tooltip: '앱 서명에 사용된 인증서의 SHA-256 지문입니다. Android Studio나 keytool 명령어를 사용하여 확인할 수 있습니다.',
      max5: '최대 5개',
      addFingerprint: '인증서 지문 추가',
      cancel: '취소',
      processing: '처리 중...',
      register: '앱 등록하기',
      edit: '앱 수정하기',
      error: '앱 등록 중 오류가 발생했습니다.'
    },
    en: {
      title: 'Register Android App',
      titleEdit: 'Edit Android App',
      description: 'Android app information to enable deep linking.',
      packageName: 'Package Name',
      required: 'Required',
      packageNameHelp: 'Enter your app package name from Google Play.',
      packageNameTooltip: 'A unique identifier for your app, typically written in reverse domain format (com.company.appname). You can find it in Google Play Console.',
      sha256: 'SHA-256 Certificate Fingerprints',
      sha256Help: 'Enter the SHA-256 fingerprints of the certificate used to sign your app. You can add up to 5 fingerprints.',
      sha256Tooltip: 'The SHA-256 fingerprints of the certificate used to sign your app. You can find it using Android Studio or keytool command.',
      max5: 'Max 5',
      addFingerprint: 'Add Fingerprint',
      cancel: 'Cancel',
      processing: 'Processing...',
      register: 'Register App',
      edit: 'Update App',
      error: 'An error occurred while registering the app.'
    },
    ja: {
      title: 'Androidアプリ登録',
      titleEdit: 'Androidアプリ編集',
      description: 'Androidアプリ情報を入力してディープリンクを有効にしてください。',
      packageName: 'パッケージ名',
      required: '必須',
      packageNameHelp: 'Google Play ストアに登録されているアプリのパッケージ名を入力してください。',
      packageNameTooltip: 'アプリの固有識別子で、通常は逆ドメイン形式（com.会社名.アプリ名）で作成されます。Google Play Consoleで確認できます。',
      sha256: 'SHA-256証明書フィンガープリント',
      sha256Help: 'アプリ署名に使用された証明書のSHA-256フィンガープリントを入力してください。最大5つまで追加できます。',
      sha256Tooltip: 'アプリ署名に使用された証明書のSHA-256フィンガープリントです。Android Studioまたはkeytoolコマンドを使用して確認できます。',
      max5: '最大5つ',
      addFingerprint: 'フィンガープリントを追加',
      cancel: 'キャンセル',
      processing: '処理中...',
      register: 'アプリを登録する',
      edit: 'アプリを更新する',
      error: 'アプリの登録中にエラーが発生しました。'
    }
  };

  const t = translations[lang as keyof typeof translations] || translations.en;

  useEffect(() => {
    if (androidApp) {
      setPackageName(androidApp.platform_data.package_name || '');
      // SHA-256 지문이 문자열이면 배열로 변환, 배열이면 그대로 사용
      const sha256Data = androidApp.platform_data.sha256_list || '';
      setSha256Fingerprints(
        Array.isArray(sha256Data) 
          ? sha256Data.length > 0 ? sha256Data : [''] 
          : sha256Data ? [sha256Data] : ['']
      );
    } else {
      setPackageName(project.id ? `com.example.${project.id}` : '');
      setSha256Fingerprints(['']);
    }
  }, [androidApp, project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // 빈 지문 필터링
      const filteredFingerprints = sha256Fingerprints.filter(fp => fp.trim() !== '');
      
      // createApp 함수 직접 호출
      const platformData = {
        package_name: packageName,
        sha256_list: filteredFingerprints
      };
      
      await createApp(project.id, 'ANDROID', platformData);
      
      // 기존 onRegister 콜백이 있으면 호출
      if (onRegister) {
        onRegister({ 
          packageName, 
          sha256_list: filteredFingerprints
        });
      }
      
      onClose();
    } catch (error: any) {
      console.error('안드로이드 앱 등록 중 오류 발생:', error);
      setError(error.message || t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFingerprint = () => {
    if (sha256Fingerprints.length < 5) {
      setSha256Fingerprints([...sha256Fingerprints, '']);
    }
  };

  const removeFingerprint = (index: number) => {
    if (sha256Fingerprints.length > 1) {
      const newFingerprints = [...sha256Fingerprints];
      newFingerprints.splice(index, 1);
      setSha256Fingerprints(newFingerprints);
    }
  };

  const updateFingerprint = (index: number, value: string) => {
    const newFingerprints = [...sha256Fingerprints];
    newFingerprints[index] = value;
    setSha256Fingerprints(newFingerprints);
  };

  return (
    <TooltipProvider>
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
              <DialogTitle className="text-xl font-bold text-white">{isEditMode ? t.titleEdit : t.title}</DialogTitle>
            </div>
            <DialogDescription className="text-gray-400 mt-2">
              {t.description}
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
                <span>{t.packageName}</span>
                <span className="ml-2 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{t.required}</span>
              </Label>
              <Input
                id="packageName"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                placeholder="com.example.app"
                className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                required
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-gray-500 flex items-center mt-1.5 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.packageNameHelp}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700 p-3 max-w-xs">
                  <p>{t.packageNameTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center">
                <Label htmlFor="sha256" className="text-sm font-medium text-gray-300 flex items-center">
                  <span>{t.sha256}</span>
                  <span className="ml-2 text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">{t.required}</span>
                </Label>
                <span className="text-xs text-gray-500">{t.max5}</span>
              </div>
              
              {sha256Fingerprints.map((fingerprint, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    id={`sha256-${index}`}
                    value={fingerprint}
                    onChange={(e) => updateFingerprint(index, e.target.value)}
                    placeholder="FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0..."
                    className="bg-black/30 border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                    required={index === 0}
                  />
                  {index > 0 && (
                    <Button 
                      type="button" 
                      onClick={() => removeFingerprint(index)}
                      className="p-2 h-10 bg-red-500/10 hover:bg-red-500/20 border-none text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              ))}
              
              {sha256Fingerprints.length < 5 && (
                <Button 
                  type="button" 
                  onClick={addFingerprint}
                  className="mt-2 w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t.addFingerprint} ({sha256Fingerprints.length}/5)
                </Button>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-xs text-gray-500 flex items-center mt-1.5 cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t.sha256Help}
                  </p>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-white border-gray-700 p-3 max-w-xs">
                  <p>{t.sha256Tooltip}</p>
                </TooltipContent>
              </Tooltip>
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
                {t.cancel}
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
                    {t.processing}
                  </div>
                ) : isEditMode ? t.edit : t.register}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

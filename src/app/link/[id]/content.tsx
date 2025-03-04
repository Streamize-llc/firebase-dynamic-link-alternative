'use client'

import { useEffect, useState } from 'react'

export default function LinkContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [appStoreUrl, setAppStoreUrl] = useState('https://apps.apple.com/app/id6450730873')
  const [playStoreUrl, setPlayStoreUrl] = useState('https://play.google.com/store/apps/details?id=com.streamize.dailystudio')

  useEffect(() => {
    // URL 파라미터 확인 (딥링크에서 전달된 데이터)
    const urlParams = new URLSearchParams(window.location.search)
    const linkData = urlParams.get('data')
    
    const isAndroid = /Android/.test(navigator.userAgent)
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    // 앱 스키마 URL 생성 (앱이 설치된 경우 앱 열기)
    const appSchemeUrl = linkData ? `myapp://deeplink?data=${linkData}` : 'myapp://home'
    
    if (isAndroid || isiOS) {
      // 앱 열기 시도
      window.location.href = appSchemeUrl
      
      // 앱이 설치되어 있지 않을 경우를 대비한 폴백
      setTimeout(() => {
        setIsLoading(false)
      }, 1500)
    } else {
      // 데스크톱 등의 경우 바로 다운로드 옵션 표시
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      {isLoading ? (
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-6"></div>
          <h1 className="text-2xl font-bold mb-4">앱으로 이동 중입니다...</h1>
        </div>
      ) : (
        <>
          <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.102 1.101" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">앱을 설치해 주세요</h1>
          <p className="mb-8 text-gray-300 text-center max-w-md">
            이 링크는 모바일 앱에서 열리도록 설계되었습니다. 아래 버튼을 통해 앱을 설치하고 더 나은 경험을 즐겨보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={appStoreUrl} 
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium flex items-center justify-center shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.74 3.51 7.1 8.42 6.82c1.74-.08 2.9.83 3.84.83.93 0 2.65-1.03 4.5-.88 1.65.14 2.95.81 3.79 2.01-3.34 2.23-2.77 6.76.5 8.5z"/>
                <path d="M12.77 4.05c.83-1.07 1.41-2.55 1.2-4.05-1.4.07-3.08.96-4.05 2.13-.85 1.04-1.56 2.56-1.28 4.02 1.49.12 3.03-.74 4.13-2.1z"/>
              </svg>
              iOS 앱 다운로드
            </a>
            <a 
              href={playStoreUrl} 
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-medium flex items-center justify-center shadow-lg shadow-green-500/20 hover:from-green-600 hover:to-green-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.34c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m-11.046 0c-.5 0-.906.406-.906.906s.406.906.906.906.906-.406.906-.906-.406-.906-.906-.906m11.816-6.5l1.571-2.718a.325.325 0 00-.12-.445.325.325 0 00-.445.12l-1.59 2.754a10.384 10.384 0 00-4.709-1.12c-1.7 0-3.304.414-4.73 1.146L6.69 5.792a.33.33 0 00-.445-.12.33.33 0 00-.12.445l1.572 2.718c-2.438 1.665-4.047 4.345-4.047 7.394h15.703c0-3.049-1.61-5.73-4.047-7.394M7.168 13.434a.906.906 0 110-1.813.906.906 0 010 1.813m9.665 0a.906.906 0 110-1.813.906.906 0 010 1.813"/>
              </svg>
              Android 앱 다운로드
            </a>
          </div>
        </>
      )}
    </div>
  )
}

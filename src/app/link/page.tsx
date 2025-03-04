'use client'

import { useEffect } from 'react'

export default function AppLinkHandler() {
  useEffect(() => {
    // URL 파라미터 확인 (딥링크에서 전달된 데이터)
    const urlParams = new URLSearchParams(window.location.search)
    const linkData = urlParams.get('data')
    
    const isAndroid = /Android/.test(navigator.userAgent)
    const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    
    // 앱이 설치되어 있지 않을 경우를 대비한 폴백만 설정
    // Android의 경우
    if (isAndroid) {
      setTimeout(() => {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.streamize.dailystudio'
      }, 1000)
    }
    // iOS의 경우
    else if (isiOS) {
      setTimeout(() => {
        window.location.href = 'https://apps.apple.com/app/id6450730873'
      }, 1000)
    }
    // 데스크톱 등의 경우 웹 경험 제공
    else {
      // setTimeout(() => {
      //   window.location.href = '/web-experience' + (linkData ? `?data=${linkData}` : '')
      // }, 1000)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">앱으로 이동 중입니다...</h1>
      <p className="mb-2">자동으로 이동하지 않는 경우:</p>
      <div className="flex gap-4">
        <a href="https://apps.apple.com/app/your-app-id" className="text-blue-500 hover:underline">
          iOS 앱 다운로드
        </a>
        <a href="https://play.google.com/store/apps/details?id=your.package.name" className="text-blue-500 hover:underline">
          Android 앱 다운로드
        </a>
      </div>
    </div>
  )
}
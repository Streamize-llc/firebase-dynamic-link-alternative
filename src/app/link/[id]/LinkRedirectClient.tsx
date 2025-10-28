"use client";

import { useEffect } from 'react';
import { incrementDeeplinkClick } from '@/utils/action/server';
import {
  type Deeplink,
  type AndroidParameters,
  type IOSParameters,
  isAndroidParameters,
  isIOSParameters
} from '@/types/deeplink';

interface LinkRedirectClientProps {
  deeplink: Deeplink;
  userAgent: string;
  host: string;
  slug: string;
}

// Android Intent URL 생성
function createAndroidAppLink(packageName: string, fallbackUrl: string, deepLinkUrl: string): string {
  return `intent://${deepLinkUrl}#Intent;package=${packageName};action=android.intent.action.VIEW;scheme=https;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
}

export default function LinkRedirectClient({
  deeplink,
  userAgent,
  host,
  slug
}: LinkRedirectClientProps) {
  useEffect(() => {
    console.log('=== DEPL 디버깅 시작 ===');
    console.log('1. 전체 딥링크 데이터:', JSON.stringify(deeplink, null, 2));
    console.log('2. User Agent:', userAgent);
    console.log('3. Host:', host);
    console.log('4. Slug:', slug);

    // 클릭 추적 (비동기, 에러 무시)
    incrementDeeplinkClick(deeplink.workspace_id, slug).catch(err => {
      console.error('클릭 추적 실패:', err);
    });

    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    console.log('5. 플랫폼 감지 - isAndroid:', isAndroid, 'isIOS:', isIOS);

    // 1초 후 리디렉션 (메타 태그 크롤링 시간 확보)
    const timer = setTimeout(() => {
      if (isAndroid) {
        console.log('6. Android 처리 시작');
        console.log('7. android_parameters:', JSON.stringify(deeplink.android_parameters, null, 2));

        // Android 파라미터 타입 검증
        const isValid = isAndroidParameters(deeplink.android_parameters);
        console.log('8. android_parameters 검증 결과:', isValid);

        if (!isValid || !deeplink.android_parameters) {
          console.error('❌ android_parameters 검증 실패!');
          console.error('받은 데이터:', deeplink.android_parameters);
          return;
        }

        // 타입 가드 통과 후 변수에 할당
        const androidParams = deeplink.android_parameters;

        const subdomain = host.split('.')[0];
        const normalizedSubdomain = subdomain === 'www' ? '' : subdomain;
        const deepLinkUrl = `${normalizedSubdomain}.depl.link/${slug}`;

        const fallbackUrl = androidParams.fallback_url ||
          `https://play.google.com/store/apps/details?id=${androidParams.package_name}`;

        const androidAppLink = createAndroidAppLink(
          androidParams.package_name,
          fallbackUrl,
          deepLinkUrl
        );

        console.log('9. 생성된 Intent URL:', androidAppLink);
        console.log('10. 리디렉션 실행!');
        window.location.href = androidAppLink;
      } else if (isIOS) {
        console.log('6. iOS 처리 시작');
        console.log('7. ios_parameters:', JSON.stringify(deeplink.ios_parameters, null, 2));

        // iOS 파라미터 타입 검증
        const isValid = isIOSParameters(deeplink.ios_parameters);
        console.log('8. ios_parameters 검증 결과:', isValid);

        if (!isValid || !deeplink.ios_parameters) {
          console.error('❌ ios_parameters 검증 실패!');
          console.error('받은 데이터:', deeplink.ios_parameters);
          return;
        }

        // Universal Link URL 구성
        const subdomain = host.split('.')[0];
        const appParams = deeplink.app_params || {};
        const queryString = Object.keys(appParams).length > 0
          ? new URLSearchParams(appParams as Record<string, any>).toString()
          : '';
        const universalLinkUrl = queryString
          ? `https://${subdomain}.depl.link/${slug}?${queryString}`
          : `https://${subdomain}.depl.link/${slug}`;

        console.log('9. 생성된 Universal Link URL:', universalLinkUrl);
        console.log('10. 리디렉션 실행!');
        window.location.href = universalLinkUrl;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [deeplink, userAgent, host, slug]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="max-w-md mx-auto px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">{deeplink.social_meta?.title || '앱으로 이동 중'}</h1>
        <p className="text-gray-400 mb-8">{deeplink.social_meta?.description || ''}</p>

        {deeplink.social_meta?.thumbnail_url && (
          <img
            src={deeplink.social_meta.thumbnail_url}
            alt={deeplink.social_meta.title || ''}
            className="w-full rounded-lg mb-8"
          />
        )}

        <div className="flex items-center justify-center gap-2 text-gray-500">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <p>앱으로 이동 중...</p>
        </div>
      </div>
    </div>
  );
}

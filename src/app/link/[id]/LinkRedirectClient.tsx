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
    // 클릭 추적 (비동기, 에러 무시)
    incrementDeeplinkClick(deeplink.workspace_id, slug).catch(err => {
      console.error('클릭 추적 실패:', err);
    });

    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    // 1초 후 리디렉션 (메타 태그 크롤링 시간 확보)
    const timer = setTimeout(() => {
      if (isAndroid) {
        // Android 파라미터 타입 검증
        if (!isAndroidParameters(deeplink.android_parameters)) {
          console.error('Invalid android_parameters:', deeplink.android_parameters);
          return;
        }

        const subdomain = host.split('.')[0];
        const normalizedSubdomain = subdomain === 'www' ? '' : subdomain;
        const deepLinkUrl = `${normalizedSubdomain}.depl.link/${slug}`;

        const fallbackUrl = deeplink.android_parameters.fallback_url ||
          `https://play.google.com/store/apps/details?id=${deeplink.android_parameters.package_name}`;

        const androidAppLink = createAndroidAppLink(
          deeplink.android_parameters.package_name,
          fallbackUrl,
          deepLinkUrl
        );

        window.location.href = androidAppLink;
      } else if (isIOS) {
        // iOS 파라미터 타입 검증
        if (!isIOSParameters(deeplink.ios_parameters)) {
          console.error('Invalid ios_parameters:', deeplink.ios_parameters);
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

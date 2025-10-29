"use client";

import { useEffect } from 'react';
import { incrementDeeplinkClick } from '@/utils/action/server';
import type { Deeplink } from '@/types/deeplink';

interface AppData {
  id: string;
  platform: string;
  platform_data: any;
}

interface AndroidPlatformData {
  package_name: string;
  sha256_list?: string[];
}

interface IOSPlatformData {
  bundle_id: string;
  team_id: string;
  app_store_id?: string;
}

interface LinkRedirectClientProps {
  deeplink: Deeplink;
  apps: AppData[];
  userAgent: string;
  host: string;
  slug: string;
}

// Android platform_data 검증
function isAndroidPlatformData(data: any): data is AndroidPlatformData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.package_name === 'string' &&
    data.package_name.length > 0
  );
}

// iOS platform_data 검증
function isIOSPlatformData(data: any): data is IOSPlatformData {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.bundle_id === 'string' &&
    data.bundle_id.length > 0 &&
    typeof data.team_id === 'string' &&
    data.team_id.length > 0
  );
}

// Android Intent URL 생성
function createAndroidAppLink(packageName: string, fallbackUrl: string, deepLinkUrl: string): string {
  return `intent://${deepLinkUrl}#Intent;package=${packageName};action=android.intent.action.VIEW;scheme=https;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
}

export default function LinkRedirectClient({
  deeplink,
  apps,
  userAgent,
  host,
  slug
}: LinkRedirectClientProps) {
  useEffect(() => {
    console.log('=== DEPL 디버깅 시작 ===');
    console.log('1. 전체 딥링크 데이터:', JSON.stringify(deeplink, null, 2));
    console.log('2. 앱 데이터:', JSON.stringify(apps, null, 2));
    console.log('3. User Agent:', userAgent);
    console.log('4. Host:', host);
    console.log('5. Slug:', slug);

    // 클릭 추적 (비동기, 에러 무시)
    incrementDeeplinkClick(deeplink.workspace_id, slug).catch(err => {
      console.error('클릭 추적 실패:', err);
    });

    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

    console.log('6. 플랫폼 감지 - isAndroid:', isAndroid, 'isIOS:', isIOS);

    // 1초 후 리디렉션 (메타 태그 크롤링 시간 확보)
    const timer = setTimeout(() => {
      if (isAndroid) {
        console.log('7. Android 처리 시작');

        // Android 앱 찾기
        const androidApp = apps.find(app => app.platform.toUpperCase() === 'ANDROID');
        console.log('8. Android 앱:', androidApp);

        if (!androidApp || !androidApp.platform_data) {
          console.error('❌ Android 앱 정보 없음!');
          return;
        }

        // platform_data 검증
        const isValid = isAndroidPlatformData(androidApp.platform_data);
        console.log('9. platform_data 검증 결과:', isValid);

        if (!isValid) {
          console.error('❌ platform_data 검증 실패!');
          console.error('받은 데이터:', androidApp.platform_data);
          return;
        }

        const androidData = androidApp.platform_data;
        const subdomain = host.split('.')[0];
        const normalizedSubdomain = subdomain === 'www' ? '' : subdomain;
        const deepLinkUrl = `${normalizedSubdomain}.depl.link/${slug}`;

        const fallbackUrl = `https://play.google.com/store/apps/details?id=${androidData.package_name}`;

        const androidAppLink = createAndroidAppLink(
          androidData.package_name,
          fallbackUrl,
          deepLinkUrl
        );

        console.log('10. 생성된 Intent URL:', androidAppLink);
        console.log('11. 리디렉션 실행!');
        window.location.href = androidAppLink;
      } else if (isIOS) {
        console.log('7. iOS 처리 시작');

        // iOS 앱 찾기
        const iosApp = apps.find(app => app.platform.toUpperCase() === 'IOS');
        console.log('8. iOS 앱:', iosApp);

        if (!iosApp || !iosApp.platform_data) {
          console.error('❌ iOS 앱 정보 없음!');
          return;
        }

        // platform_data 검증
        const isValid = isIOSPlatformData(iosApp.platform_data);
        console.log('9. platform_data 검증 결과:', isValid);

        if (!isValid) {
          console.error('❌ platform_data 검증 실패!');
          console.error('받은 데이터:', iosApp.platform_data);
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

        console.log('10. 생성된 Universal Link URL:', universalLinkUrl);
        console.log('11. 리디렉션 실행!');
        window.location.href = universalLinkUrl;
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [deeplink, apps, userAgent, host, slug]);

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

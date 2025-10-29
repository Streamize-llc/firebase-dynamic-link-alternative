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
    console.log('=== DEPL Debug Start ===');
    console.log('1. Deeplink data:', JSON.stringify(deeplink, null, 2));
    console.log('2. Apps data:', JSON.stringify(apps, null, 2));
    console.log('3. User Agent:', userAgent);
    console.log('4. Host:', host);
    console.log('5. Slug:', slug);

    // Click tracking (async, ignore errors)
    incrementDeeplinkClick(deeplink.workspace_id, slug).catch(err => {
      console.error('Click tracking failed:', err);
    });

    // No apps configured
    if (!apps || apps.length === 0) {
      console.error('❌ No apps registered!');
      alert('No app information found. Please contact the administrator.');
      return;
    }

    const isAndroid = /Android/i.test(userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(userAgent);
    const isDesktop = !isAndroid && !isIOS;

    console.log('6. Platform detection - isAndroid:', isAndroid, 'isIOS:', isIOS, 'isDesktop:', isDesktop);

    // 1초 후 리디렉션 (메타 태그 크롤링 시간 확보)
    const timer = setTimeout(() => {
      // Find apps
      const androidApp = apps.find(app => app.platform.toUpperCase() === 'ANDROID');
      const iosApp = apps.find(app => app.platform.toUpperCase() === 'IOS');

      console.log('7. App availability - Android:', androidApp ? 'Available' : 'N/A', 'iOS:', iosApp ? 'Available' : 'N/A');

      // Android redirect function
      const redirectToAndroid = (forceWebStore = false) => {
        if (!androidApp || !androidApp.platform_data) {
          console.error('❌ Android app info not found');
          return false;
        }

        if (!isAndroidPlatformData(androidApp.platform_data)) {
          console.error('❌ Android platform_data validation failed:', androidApp.platform_data);
          return false;
        }

        const androidData = androidApp.platform_data;
        const playStoreUrl = `https://play.google.com/store/apps/details?id=${androidData.package_name}`;

        // Desktop/PC 사용자는 웹 스토어로 직접 이동
        if (forceWebStore || isDesktop) {
          console.log('✅ Android redirect (Web Store):', playStoreUrl);
          window.location.href = playStoreUrl;
          return true;
        }

        // Android 디바이스는 Intent URL 사용
        const subdomain = host.split('.')[0] || 'app';
        const normalizedSubdomain = subdomain === 'www' ? 'app' : subdomain;
        const deepLinkUrl = `${normalizedSubdomain}.depl.link/${slug}`;

        const androidAppLink = createAndroidAppLink(
          androidData.package_name,
          playStoreUrl,
          deepLinkUrl
        );

        console.log('✅ Android redirect (Intent):', androidAppLink);
        window.location.href = androidAppLink;
        return true;
      };

      // iOS redirect function
      const redirectToIOS = (forceWebStore = false) => {
        if (!iosApp || !iosApp.platform_data) {
          console.error('❌ iOS app info not found');
          return false;
        }

        if (!isIOSPlatformData(iosApp.platform_data)) {
          console.error('❌ iOS platform_data validation failed:', iosApp.platform_data);
          return false;
        }

        const iosData = iosApp.platform_data;

        // Desktop/PC 사용자는 App Store 웹으로 이동
        if (forceWebStore || isDesktop) {
          const appStoreUrl = iosData.app_store_id
            ? `https://apps.apple.com/app/id${iosData.app_store_id}`
            : `https://apps.apple.com`;
          console.log('✅ iOS redirect (Web Store):', appStoreUrl);
          window.location.href = appStoreUrl;
          return true;
        }

        // iOS 디바이스는 Universal Link 사용
        const subdomain = host.split('.')[0] || 'app';
        const appParams = deeplink.app_params || {};

        // Safely convert app_params to query string
        let queryString = '';
        try {
          if (Object.keys(appParams).length > 0) {
            const params = new URLSearchParams();
            Object.entries(appParams).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                params.append(key, String(value));
              }
            });
            queryString = params.toString();
          }
        } catch (e) {
          console.error('app_params parsing error:', e);
        }

        const universalLinkUrl = queryString
          ? `https://${subdomain}.depl.link/${slug}?${queryString}`
          : `https://${subdomain}.depl.link/${slug}`;

        console.log('✅ iOS redirect (Universal Link):', universalLinkUrl);
        window.location.href = universalLinkUrl;
        return true;
      };

      // Platform-specific handling
      let redirected = false;

      if (isAndroid) {
        console.log('8. Processing Android user');
        redirected = redirectToAndroid();
        if (!redirected) {
          console.log('9. Android app not available, fallback to iOS');
          redirected = redirectToIOS();
        }
      } else if (isIOS) {
        console.log('8. Processing iOS user');
        redirected = redirectToIOS();
        if (!redirected) {
          console.log('9. iOS app not available, fallback to Android');
          redirected = redirectToAndroid();
        }
      } else {
        console.log('8. Processing Desktop/PC user - Android priority');
        redirected = redirectToAndroid();
        if (!redirected) {
          console.log('9. Android app not available, fallback to iOS');
          redirected = redirectToIOS();
        }
      }

      // All attempts failed
      if (!redirected) {
        console.error('❌ No valid app configuration available');
        alert('App configuration is invalid. Please contact the administrator.');
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

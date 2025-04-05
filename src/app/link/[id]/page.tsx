// import LinkContent from './content'
import { Metadata, ResolvingMetadata } from 'next'
// import { createClient } from '@/utils/supabase/server'
import { redirect, permanentRedirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
// type Props = {
//   params: { id: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata(
//   { params, searchParams }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const supabase = await createClient();
//   const { id } = await params
  
//   if (id) {
//     const { data: deeplink, error } = await supabase
//       .from('deeplinks')
//       .select('*')
//       .eq('short_code', id)
//       .single()
      
//     if (deeplink) {
//       const socialMeta = deeplink.social_meta as { title: string; description: string; thumbnail_url: string };
//       return {
//         title: `${socialMeta.title || '앱 다운로드'} - 딥링크`,
//         description: socialMeta.description || '모바일 앱을 다운로드하여 더 나은 경험을 즐겨보세요.',
//         openGraph: {
//           title: `${socialMeta.title || '앱 다운로드'} - 딥링크`,
//           description: socialMeta.description || '모바일 앱을 다운로드하여 더 나은 경험을 즐겨보세요.',
//           images: [socialMeta.thumbnail_url || '/images/og-image.jpg'],
//         },
//       }
//     }
//   }

  // return {
  //   title: 'App Download - DeepLink',
  //   description: 'Download the mobile app for a better experience.'
  // }
// }

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;

  try { // 안정성을 위해 try/catch 추가
    const { data: deeplink, error } = await supabase
      .from('deeplinks')
      .select('social_meta') // 필요한 필드만 선택
      .eq('short_code', id)
      .maybeSingle(); // 에러 없이 찾지 못한 경우를 처리하기 위해 maybeSingle 사용

    if (error) {
        console.error("딥링크 메타데이터 조회 오류:", error);
        // 요구사항에 따라 대체(fallback) 메타데이터 반환 또는 에러 다시 던지기
    }

    if (deeplink && deeplink.social_meta) {
      // 필드를 선택적으로 만들기 위해 ? 추가
      const socialMeta = deeplink.social_meta as { title?: string; description?: string; thumbnail_url?: string };
      const defaultTitle = '앱 다운로드 - DeepLink';
      const defaultDescription = '더 나은 경험을 위해 모바일 앱을 다운로드하세요.';
      const defaultImage = '/images/og-image.jpg'; // 이 이미지가 public 폴더에 있는지 확인

      return {
        title: `${socialMeta.title || defaultTitle}`,
        description: socialMeta.description || defaultDescription,
        openGraph: {
          title: `${socialMeta.title || defaultTitle}`,
          description: socialMeta.description || defaultDescription,
          images: [socialMeta.thumbnail_url || defaultImage],
        },
        // 선택 사항: 트위터 카드 메타데이터 추가
        twitter: {
            card: 'summary_large_image',
            title: `${socialMeta.title || defaultTitle}`,
            description: socialMeta.description || defaultDescription,
            images: [socialMeta.thumbnail_url || defaultImage],
        }
      }
    }
  } catch (e) {
      console.error("메타데이터 조회 중 예외 발생:", e);
      // 예외 발생 시 대체 메타데이터 반환
  }

  // 딥링크를 찾지 못했거나 오류 발생 시 기본 메타데이터
  return {
    title: '앱 다운로드 - DeepLink',
    description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
    openGraph: {
        title: '앱 다운로드 - DeepLink',
        description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
        images: ['/images/og-image.jpg'],
    },
    twitter: {
        card: 'summary_large_image',
        title: '앱 다운로드 - DeepLink',
        description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
        images: ['/images/og-image.jpg'],
    }
  };
}

interface AndroidParameters {
  package_name: string;
}

interface IOSParameters {
  app_store_id: string;
  bundle_id: string;
}

async function getDeepLinkUrl(id: string) {
  const supabase = await createClient();
  const { data: deeplink, error } = await supabase
    .from('deeplinks')
    .select('*')
    .eq('short_code', id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }
  return deeplink;
}

// Android 앱 링크 생성 함수
function createAndroidAppLink(packageName: string, fallbackUrl: string, deepLinkUrl: string): string {
  // Intent URL 형식으로 생성
  return `intent://${deepLinkUrl}#Intent;package=${packageName};action=android.intent.action.VIEW;scheme=https;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
}

export default async function AppLinkHandler({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const deeplink = await getDeepLinkUrl(id)
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const host = headersList.get('host') || ''
  const subdomain = host.split('.')[0]
  const normalizedSubdomain = subdomain === 'www' ? '' : subdomain

  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
  const isAndroid = /Android/i.test(userAgent)
  
  if (!deeplink) {
    return null
  }
  
  if (isAndroid) {
    const deepLinkUrl = `${normalizedSubdomain}.depl.link/${id}`
    const androidParams = deeplink.android_parameters as unknown as AndroidParameters;
    const androidAppLink = createAndroidAppLink(
      androidParams.package_name,
      `https://play.google.com/store/apps/details?id=${androidParams.package_name}`,
      deepLinkUrl
    )
    return redirect(androidAppLink)
  }

  if (isIOS) {
    // TODO : 아이폰 앱 정보 가져오기
    const iosParams = deeplink.ios_parameters as unknown as IOSParameters;
    return permanentRedirect(`https://apps.apple.com/KR/app/id${iosParams.app_store_id}?mt=8`)
  }

  return (
    <p>This link requires a mobile device. Please open this link on an iOS or Android device to continue.</p>
  )
}
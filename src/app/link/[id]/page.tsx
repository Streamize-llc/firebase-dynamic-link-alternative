// import LinkContent from './content'
// import { Metadata, ResolvingMetadata } from 'next'
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

//   return {
//     title: 'App Download - DeepLink',
//     description: 'Download the mobile app for a better experience.'
//   }
// }

// Android 앱 링크 생성 함수
function createAndroidAppLink(packageName: string, fallbackUrl: string, deepLinkUrl: string): string {
  // Intent URL 형식으로 생성
  return `intent://${deepLinkUrl}#Intent;package=${packageName};action=android.intent.action.VIEW;scheme=https;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end;`;
}

// iOS 유니버설 링크 생성 함수
function createIOSUniversalLink(appStoreId: string, bundleId: string, deepLinkUrl: string): string {
  // iOS의 경우 일반적으로 Universal Link 형식 사용
  return `https://${deepLinkUrl}`;
}

async function getApps(projectId: string) {
  const supabase = await createClient();
  const { data: apps, error } = await supabase
    .from('apps')
    .select('*')
    .eq('platform', 'ANDROID')
    .eq('project_id', projectId)
    .single();

  return apps;
} 

export default async function AppLinkHandler({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const host = headersList.get('host') || ''
  const subdomain = host.split('.')[0]
  const normalizedSubdomain = subdomain === 'www' ? '' : subdomain

  const isIOS = /iPhone|iPad|iPod/i.test(userAgent)
  const isAndroid = /Android/i.test(userAgent)
  
  if (isAndroid) {
    const deepLinkUrl = `${normalizedSubdomain}.depl.link/${id}`
    const androidAppLink = createAndroidAppLink('com.streamize.dailystudio', 'https://play.google.com/store/apps/details?id=com.streamize.dailystudio', deepLinkUrl)
    return redirect(androidAppLink)
  }

  if (isIOS) {
    // TODO : 아이폰 앱 정보 가져오기
    return permanentRedirect('https://apps.apple.com/KR/app/id6470640320?mt=8')
  }

  return null
}
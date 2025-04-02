import { redirect, permanentRedirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = params
  
  if (id) {
    const { data: deeplink, error } = await supabase
      .from('deeplinks')
      .select('*')
      .eq('short_code', id)
      .single()
      
    if (deeplink) {
      const socialMeta = deeplink.social_meta as { title: string; description: string; thumbnail_url: string };
      return {
        title: `${socialMeta.title || '앱 다운로드'} - 딥링크`,
        description: socialMeta.description || '모바일 앱을 다운로드하여 더 나은 경험을 즐겨보세요.',
        openGraph: {
          title: `${socialMeta.title || '앱 다운로드'} - 딥링크`,
          description: socialMeta.description || '모바일 앱을 다운로드하여 더 나은 경험을 즐겨보세요.',
          images: [socialMeta.thumbnail_url || '/images/og-image.jpg'],
        },
      }
    }
  }

  return {
    title: 'App Download - DeepLink',
    description: 'Download the mobile app for a better experience.'
  }
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

export default async function AppLinkHandler({ params }: { params: { id: string } }) {
  const { id } = params
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

  return null
}
import { Metadata } from 'next'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import LinkRedirectClient from './LinkRedirectClient'
import type { Deeplink } from '@/types/deeplink'

function getDefaultMetadata(): Metadata {
  const defaultImage = 'https://depl.link/images/og-image.jpg';

  return {
    title: '앱 다운로드 - DeepLink',
    description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
    openGraph: {
      title: '앱 다운로드 - DeepLink',
      description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: '앱 다운로드',
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: '앱 다운로드 - DeepLink',
      description: '더 나은 경험을 위해 모바일 앱을 다운로드하세요.',
      images: [defaultImage],
    }
  };
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params;
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const isProd = process.env.NODE_ENV === 'production';
  const subdomain = isProd ? host.split('.')[0] : 'test';

  try {
    // workspace 조회
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id')
      .eq('sub_domain', subdomain)
      .maybeSingle();

    if (!workspace) {
      return getDefaultMetadata();
    }

    // short_code 또는 slug로 조회
    const { data: deeplink, error } = await supabase
      .from('deeplinks')
      .select('social_meta, ios_parameters')
      .eq('workspace_id', workspace.id)
      .or(`short_code.eq.${id},slug.eq.${id}`)
      .maybeSingle();

    if (error) {
      console.error("딥링크 메타데이터 조회 오류:", { id, error });
    }

    if (deeplink && deeplink.social_meta) {
      const socialMeta = deeplink.social_meta as { title?: string; description?: string; thumbnail_url?: string };
      const iosParams = deeplink.ios_parameters as { app_store_id?: string } | null;

      const defaultTitle = '앱 다운로드 - DeepLink';
      const defaultDescription = '더 나은 경험을 위해 모바일 앱을 다운로드하세요.';
      const defaultImage = 'https://depl.link/images/og-image.jpg';

      const imageUrl = socialMeta.thumbnail_url || defaultImage;

      return {
        title: socialMeta.title || defaultTitle,
        description: socialMeta.description || defaultDescription,
        openGraph: {
          title: socialMeta.title || defaultTitle,
          description: socialMeta.description || defaultDescription,
          images: [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: socialMeta.title || defaultTitle,
            }
          ],
          type: 'website',
        },
        twitter: {
          card: 'summary_large_image',
          title: socialMeta.title || defaultTitle,
          description: socialMeta.description || defaultDescription,
          images: [imageUrl],
        },
        // iOS Smart App Banner 추가
        other: iosParams?.app_store_id ? {
          'apple-itunes-app': `app-id=${iosParams.app_store_id}`
        } : undefined
      }
    }
  } catch (e) {
    console.error("메타데이터 조회 중 예외 발생:", { id, error: e });
  }

  return getDefaultMetadata();
}

async function getDeepLinkUrl(id: string, host: string): Promise<Deeplink | null> {
  const supabase = await createClient();
  const isProd = process.env.NODE_ENV === 'production';

  // 서브도메인 추출
  const subdomain = isProd ? host.split('.')[0] : 'test';

  // 1. 서브도메인으로 workspace 조회
  const { data: workspace, error: workspaceError } = await supabase
    .from('workspaces')
    .select('id')
    .eq('sub_domain', subdomain)
    .single();

  if (workspaceError || !workspace) {
    console.error('워크스페이스 조회 오류:', { subdomain, error: workspaceError });
    return null;
  }

  // 2. workspace_id + (short_code OR slug)로 딥링크 조회
  const { data: deeplink, error: deeplinkError } = await supabase
    .from('deeplinks')
    .select('*')
    .eq('workspace_id', workspace.id)
    .or(`short_code.eq.${id},slug.eq.${id}`)
    .maybeSingle();

  if (deeplinkError) {
    console.error('딥링크 조회 오류:', { workspace_id: workspace.id, id, error: deeplinkError });
    return null;
  }

  if (!deeplink) {
    console.log('딥링크 없음:', { workspace_id: workspace.id, id });
    return null;
  }

  return deeplink as Deeplink;
}

export default async function AppLinkHandler({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const host = headersList.get('host') || ''

  const deeplink = await getDeepLinkUrl(id, host)

  if (!deeplink) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-2xl font-bold mb-4">딥링크를 찾을 수 없습니다</h1>
        <p className="text-gray-400">유효하지 않은 링크입니다.</p>
      </div>
    )
  }

  // 소셜 크롤러 감지
  const isCrawler = /facebookexternalhit|Twitterbot|WhatsApp|Slackbot|KakaoTalkBot|LinkedInBot|Pinterest|Discordbot/i.test(userAgent);

  if (isCrawler) {
    // 크롤러에게는 HTML + 메타 태그 반환 (리디렉션 없음)
    const socialMeta = deeplink.social_meta as { title?: string; description?: string; thumbnail_url?: string } | null;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <div className="max-w-md mx-auto px-6 text-center">
          <h1 className="text-2xl font-bold mb-4">{socialMeta?.title || '앱 다운로드'}</h1>
          <p className="text-gray-400 mb-8">{socialMeta?.description || '더 나은 경험을 위해 모바일 앱을 다운로드하세요.'}</p>

          {socialMeta?.thumbnail_url && (
            <img
              src={socialMeta.thumbnail_url}
              alt={socialMeta.title || 'Preview'}
              className="w-full rounded-lg"
            />
          )}
        </div>
      </div>
    );
  }

  // 일반 사용자는 Client Component로 리디렉션 처리
  return (
    <LinkRedirectClient
      deeplink={deeplink}
      userAgent={userAgent}
      host={host}
      slug={id}
    />
  );
}

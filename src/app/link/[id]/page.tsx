// import LinkContent from './content'
import { Metadata, ResolvingMetadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const supabase = await createClient();
  const { id } = await params
  
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

export default function AppLinkHandler({ params }: { params: { id: string } }) {
  redirect('https://apps.apple.com/KR/app/id6470640320?mt=8')
  return null
}
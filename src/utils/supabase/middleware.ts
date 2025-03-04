import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // 호스트 헤더에서 서브도메인 추출
  const host = request.headers.get('host') || '';
  const isProd = process.env.NODE_ENV === 'production';
  
  // 프로덕션 환경에서 *.depl.link 형식인 경우 처리
  if (isProd && host.endsWith('.depl.link')) {
    const subdomain = host.split('.')[0];
    
    // 서브도메인이 존재하면 /api/deeplink로 리다이렉트
    if (subdomain) {
      const url = request.nextUrl.clone();
      url.pathname = '/link';
      return NextResponse.rewrite(url);
    }
  }

  // refreshing the auth token
  await supabase.auth.getUser()

  return supabaseResponse
}
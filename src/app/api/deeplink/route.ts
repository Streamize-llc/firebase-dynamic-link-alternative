import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

// 딥링크 테이블의 JSON 필드에 대한 타입 정의

// iOS 파라미터 타입 (자유 형식)
export type IOSParameters = {
  [key: string]: any;
};

// Android 파라미터 타입 (자유 형식)
export type AndroidParameters = {
  [key: string]: any;
};

// 앱 파라미터 타입 (완전 자유 형식)
export type AppParams = {
  [key: string]: any;
};

// 소셜 메타 데이터 타입
export type SocialMeta = {
  title?: string;
  description?: string;
  thumbnail_url?: string;
  [key: string]: any;
};


export async function GET() {
  try {
    // 헤더 정보 가져오기
    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    // 간단한 헬로우 월드 응답 반환
    return NextResponse.json(
      { 
        message: 'test',
        host: host
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('ERROR:', error);
    return NextResponse.json(
      { error: 'ERROR' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 요청 본문 파싱
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { 
          error: {
            code: "INVALID_JSON",
            message: "Request body is not a valid JSON format."
          }
        },
        { status: 400 }
      );
    }

    if (!body.slug || !body.app_params) {
      return NextResponse.json(
        { 
          error: {
            code: "INVALID_REQUEST",
            message: "Required fields are missing. slug and app_params are required."
          }
        },
        { status: 400 }
      );
    }

    // 소셜 메타 데이터 처리
    const socialMeta = {
      title: body.social_meta?.title || "Depl.link | App Download",
      description: body.social_meta?.description || "Download the mobile app for a better experience.",
      thumbnail_url: body.social_meta?.thumbnail_url || "/images/og-image.jpg"
    };
    
    // 인증 헤더에서 API 키 추출
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: {
            code: "UNAUTHORIZED",
            message: "Valid API key is required."
          }
        },
        { status: 401 }
      );
    }
    
    const apiKey = authHeader.substring(7); // 'Bearer ' 부분 제거
    
    // Supabase 클라이언트 생성
    const supabase = await createClient();
    
    // API 키로 프로젝트 조회
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        apps (
          id,
          name,
          platform,
          platform_data
        )
      `)
      .eq('api_key', apiKey)
      .single();
    
    if (projectError || !project) {
      return NextResponse.json(
        { 
          error: {
            code: "INVALID_API_KEY",
            message: "Invalid API key."
          }
        },
        { status: 401 }
      );
    }

    // 프로젝트에 연결된 앱 정보 확인
    if (!project.apps || project.apps.length === 0) {
      return NextResponse.json(
        { 
          error: {
            code: "NO_APPS_CONFIGURED",
            message: "프로젝트에 등록된 앱이 없습니다."
          }
        },
        { status: 400 }
      );
    }
    
    // iOS 및 Android 앱 정보 추출
    const iosApp = project.apps.find(app => app.platform === 'ios');
    const androidApp = project.apps.find(app => app.platform === 'android');
    
    // iOS 및 Android 파라미터 설정
    const iosParameters: IOSParameters = {};
    const androidParameters: AndroidParameters = {};
    
    // iOS 앱 정보가 있는 경우 파라미터 설정
    if (iosApp && iosApp.platform_data) {
      const iosData = iosApp.platform_data as { bundle_id?: string, app_store_id?: string };
      if (iosData.bundle_id) {
        iosParameters.bundle_id = iosData.bundle_id;
      }
      if (iosData.app_store_id) {
        iosParameters.app_store_id = iosData.app_store_id;
      }
    }
    
    // Android 앱 정보가 있는 경우 파라미터 설정
    if (androidApp && androidApp.platform_data) {
      const androidData = androidApp.platform_data as { package_name?: string };
      if (androidData.package_name) {
        androidParameters.package_name = androidData.package_name;
        androidParameters.action = 'android.intent.action.VIEW';
        androidParameters.fallback_url = `https://play.google.com/store/apps/details?id=${androidData.package_name}`;
      }
    }
    
    // 여기서 실제 딥링크 생성 로직 구현
    const shortCode = generateRandomString(4)
    const deeplinkUrl = `https://${project.sub_domain || 'app'}.depl.link/${shortCode}`;

    const { data: deeplink, error: deeplinkError } = await supabase
      .from('deeplinks')
      .insert({
        android_parameters: androidParameters,
        ios_parameters: iosParameters,
        app_params: body.app_params,  
        social_meta: socialMeta,
        project_id: project.id,
        short_code: shortCode,
        slug: body.slug,
        sub_domain: project.sub_domain || 'app',
      })

    if (deeplinkError) {
      return NextResponse.json(
        { 
          error: {
            code: "SERVER_ERROR",
            message: "server error"
          }
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        success: true,
        deeplink_url: deeplinkUrl,
        created_at: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        error: {
          code: "SERVER_ERROR",
          message: "server error"
        }
      },
      { status: 500 }
    );
  }
}

// 랜덤 문자열 생성 헬퍼 함수
function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

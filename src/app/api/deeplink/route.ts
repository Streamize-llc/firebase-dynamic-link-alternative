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


export async function GET(request: Request) {
  try {
    // Get header information
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    // Verify authentication with client_key
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: {
            code: "UNAUTHORIZED",
            message: "Valid client_key is required."
          }
        },
        { status: 401 }
      );
    }
    
    const clientKey = authHeader.replace('Bearer ', '');
    
    // Extract short_code parameter from URL
    const { searchParams } = new URL(request.url);
    const shortCode = searchParams.get('short_code');
    
    if (!shortCode) {
      return NextResponse.json(
        { 
          error: {
            code: "INVALID_REQUEST",
            message: "short_code parameter is required."
          }
        },
        { status: 400 }
      );
    }
    
    // Create Supabase client
    const supabase = await createClient();
    
    // First verify project with client_key
    const { data: projectData, error: projectError } = await supabase
      .from('workspaces')
      .select('id')
      .eq('client_key', clientKey)
      .single();
    
    if (projectError || !projectData) {
      return NextResponse.json(
        { 
          error: {
            code: "INVALID_CLIENT_KEY",
            message: "Invalid client_key."
          }
        },
        { status: 401 }
      );
    }
    
    // Query deeplink with project ID and short_code
    const { data: deeplinkData, error: deeplinkError } = await supabase
      .from('deeplinks')
      .select('*')
      .eq('project_id', projectData.id)
      .eq('short_code', shortCode)
      .single();
    
    if (deeplinkError || !deeplinkData) {
      return NextResponse.json(
        { 
          error: {
            code: "NOT_FOUND",
            message: "Deeplink with the specified short_code not found."
          }
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json(deeplinkData, { status: 200 });
  } catch (error) {
    console.error('ERROR:', error);
    return NextResponse.json(
      { 
        error: {
          code: "SERVER_ERROR",
          message: "An internal server error occurred."
        }
      },
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
      .from('workspaces')
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

    // shortCode 생성 with 중복 체크
    let shortCode: string = '';
    let attempts = 0;
    const MAX_ATTEMPTS = 10;

    while (attempts < MAX_ATTEMPTS) {
      shortCode = generateRandomString(6);  // 6글자로 증가 (62^6 = 56억 조합)

      // 기존 shortCode 확인 (workspace 내에서 중복 체크)
      const { data: existing } = await supabase
        .from('deeplinks')
        .select('short_code')
        .eq('workspace_id', project.id)
        .eq('short_code', shortCode)
        .maybeSingle();

      if (!existing) {
        break;  // 중복 없음, 사용 가능
      }

      attempts++;
    }

    if (attempts === MAX_ATTEMPTS) {
      return NextResponse.json(
        {
          error: {
            code: "SHORT_CODE_GENERATION_FAILED",
            message: "Failed to generate unique short code after 10 attempts. Please try again."
          }
        },
        { status: 500 }
      );
    }

    const deeplinkUrl = `https://${project.sub_domain || 'app'}.depl.link/${shortCode}`;

    const { data: deeplink, error: deeplinkError } = await supabase
      .from('deeplinks')
      .insert({
        android_parameters: androidParameters,
        ios_parameters: iosParameters,
        app_params: body.app_params,
        social_meta: socialMeta,
        workspace_id: project.id,
        short_code: shortCode,
        slug: body.slug,
        source: 'API',
      })

    if (deeplinkError) {
      console.error('딥링크 생성 실패:', {
        workspace_id: project.id,
        short_code: shortCode,
        slug: body.slug,
        error: deeplinkError
      });

      return NextResponse.json(
        {
          error: {
            code: deeplinkError.code || "DEEPLINK_CREATION_FAILED",
            message: deeplinkError.message || "Failed to create deeplink in database.",
            details: process.env.NODE_ENV === 'development' ? deeplinkError : undefined
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

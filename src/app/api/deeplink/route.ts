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
    
    // Extract slug parameter from URL
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "slug parameter is required."
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
    
    // Query deeplink with project ID and slug
    const { data: deeplinkData, error: deeplinkError } = await supabase
      .from('deeplinks')
      .select('*')
      .eq('workspace_id', projectData.id)
      .eq('slug', slug)
      .single();

    if (deeplinkError || !deeplinkData) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Deeplink with the specified slug not found."
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

    if (!body.app_params) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "Required field missing. app_params is required."
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

    // android_parameters, ios_parameters는 더 이상 사용하지 않음
    // 빈 객체로 저장 (DB 스키마 호환성 유지)
    const iosParameters: IOSParameters = {};
    const androidParameters: AndroidParameters = {};

    // slug 생성 또는 사용자 지정 slug 사용
    let slug: string = '';
    let isRandomSlug: boolean;

    if (body.slug) {
      // 사용자가 slug 지정
      slug = body.slug;
      isRandomSlug = false;

      // 중복 체크
      const { data: existing } = await supabase
        .from('deeplinks')
        .select('slug')
        .eq('workspace_id', project.id)
        .eq('slug', slug)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          {
            error: {
              code: "SLUG_ALREADY_EXISTS",
              message: "A deeplink with this slug already exists in your workspace."
            }
          },
          { status: 409 }
        );
      }
    } else {
      // 랜덤 slug 생성 with 중복 체크
      isRandomSlug = true;
      let attempts = 0;
      const MAX_ATTEMPTS = 10;

      while (attempts < MAX_ATTEMPTS) {
        slug = generateRandomString(6);  // 6글자 랜덤 (62^6 = 56억 조합)

        // 기존 slug 확인 (workspace 내에서 중복 체크)
        const { data: existing } = await supabase
          .from('deeplinks')
          .select('slug')
          .eq('workspace_id', project.id)
          .eq('slug', slug)
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
              code: "SLUG_GENERATION_FAILED",
              message: "Failed to generate unique slug after 10 attempts. Please try again."
            }
          },
          { status: 500 }
        );
      }
    }

    const deeplinkUrl = `https://${project.sub_domain || 'app'}.depl.link/${slug}`;

    const { data: deeplink, error: deeplinkError } = await supabase
      .from('deeplinks')
      .insert({
        android_parameters: androidParameters,
        ios_parameters: iosParameters,
        app_params: body.app_params,
        social_meta: socialMeta,
        workspace_id: project.id,
        slug: slug,
        is_random_slug: isRandomSlug,
        source: 'API',
      })

    if (deeplinkError) {
      console.error('딥링크 생성 실패:', {
        workspace_id: project.id,
        slug: slug,
        is_random_slug: isRandomSlug,
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

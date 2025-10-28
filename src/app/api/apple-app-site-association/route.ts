import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

interface PlatformData {
  team_id: string;
  bundle_id: string;
}

function isPlatformData(data: any): data is PlatformData {
  return typeof data === 'object' && 
         typeof data.team_id === 'string' && 
         typeof data.bundle_id === 'string';
}

export async function GET() {
  try {
    // Extract subdomain from host header
    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    // Check environment
    const isProd = process.env.NODE_ENV === 'production';
    
    // Check if it's in *.depl.link format (only in production environment)
    if (isProd && !host.endsWith('.depl.link')) {
      return NextResponse.json(
        { error: 'Invalid host.' },
        { status: 400 }
      );
    }
    
    // Extract subdomain (assume 'test' if not in production environment)
    const subdomain = isProd ? host.split('.')[0] : 'test';
    const supabase = await createClient();
    // Query workspace and iOS app information at once
    const { data: project, error: projectError } = await supabase
      .from('workspaces')
      .select(`
        id,
        apps!inner(
          id,
          name,
          platform,
          platform_data
        )
      `)
      .eq('sub_domain', subdomain)
      .eq('apps.platform', 'IOS')
      .single();
    
    if (projectError || !project) {
      console.error('AASA generation failed for subdomain:', { subdomain, error: projectError });

      // iOS/Apple 요구사항: 에러 시에도 200 OK + 빈 AASA 반환
      return NextResponse.json({
        applinks: {
          apps: [],
          details: []
        }
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const rawPlatformData = project.apps[0]?.platform_data;
    if (!isPlatformData(rawPlatformData)) {
      console.error('Invalid platform data format:', { subdomain, platform_data: rawPlatformData });

      // 잘못된 데이터 형식도 빈 AASA 반환
      return NextResponse.json({
        applinks: {
          apps: [],
          details: []
        }
      }, {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const platformData = rawPlatformData;

    // Configure response according to Apple App Site Association format
    const response = {
      applinks: {
        apps: [],
        details: [{
          appID: `${platformData.team_id}.${platformData.bundle_id}`,
          paths: ["NOT /_/*", "/*"]
        }]
      }
    };
    
    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating Apple App Site Association:', error);

    // 예외 발생 시에도 200 OK + 빈 AASA 반환
    return NextResponse.json({
      applinks: {
        apps: [],
        details: []
      }
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

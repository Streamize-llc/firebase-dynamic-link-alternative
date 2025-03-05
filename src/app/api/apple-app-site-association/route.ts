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
    // Query project and iOS app information at once
    const { data: project, error: projectError } = await supabase
      .from('projects')
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
    
    if (projectError) {
      return NextResponse.json(
        { error: 'Subdomain not found.' },
        { status: 404 }
      );
    }
    
    const rawPlatformData = project.apps[0].platform_data;
    if (!isPlatformData(rawPlatformData)) {
      throw new Error('Invalid platform data format');
    }
    
    const platformData = rawPlatformData;
    
    // Temporary data (actually needs DB lookup by subdomain)
    const dummyIosApps = [
      {
        platform_data: {
          teamId: platformData.team_id,
          bundleId: platformData.bundle_id
        }
      }
    ];
    
    // Configure response according to Apple App Site Association format
    const response = {
      applinks: {
        apps: [],
        details: dummyIosApps.map((app: any) => ({
          appID: `${app.platform_data.team_id}.${app.platform_data.bundle_id}`,
          paths: ["NOT /_/*", "/*"]
        }))
      }
    };
    
    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error creating Apple App Site Association:', error);
    return NextResponse.json(
      { error: 'Server error occurred.' },
      { status: 500 }
    );
  }
}

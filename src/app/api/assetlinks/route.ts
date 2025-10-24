import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';

interface PlatformData {
  sha256_list: string;
  package_name: string;
}

function isPlatformData(data: any): data is PlatformData {
  return typeof data === 'object' && 
         typeof data.sha256_list === 'string' && 
         typeof data.package_name === 'string';
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
      .eq('apps.platform', 'ANDROID')
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

    const response = [
      {
        relation: ['delegate_permission/common.handle_all_urls'],
        target: {
          namespace: 'android_app',
          package_name: platformData.package_name,
          sha256_cert_fingerprints: platformData.sha256_list
        }
      }
    ]

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return NextResponse.json([], {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}


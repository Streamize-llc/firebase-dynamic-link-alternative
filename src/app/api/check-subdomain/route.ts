import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter is required' },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain)) {
      return NextResponse.json(
        { available: false, error: 'Invalid subdomain format' },
        { status: 400 }
      );
    }

    // Check length
    if (subdomain.length < 3 || subdomain.length > 30) {
      return NextResponse.json(
        { available: false, error: 'Subdomain must be between 3 and 30 characters' },
        { status: 400 }
      );
    }

    // Reserved subdomains
    const reserved = ['www', 'api', 'admin', 'app', 'test', 'dev', 'staging', 'prod', 'production', 'mail', 'email', 'ftp', 'ssh'];
    if (reserved.includes(subdomain.toLowerCase())) {
      return NextResponse.json(
        { available: false, error: 'This subdomain is reserved' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if subdomain already exists
    const { data, error } = await supabase
      .from('workspaces')
      .select('id')
      .eq('sub_domain', subdomain)
      .limit(1);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { available: false, error: 'Failed to check subdomain availability' },
        { status: 500 }
      );
    }

    const available = !data || data.length === 0;

    return NextResponse.json({ available }, { status: 200 });
  } catch (error) {
    console.error('Error checking subdomain:', error);
    return NextResponse.json(
      { available: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

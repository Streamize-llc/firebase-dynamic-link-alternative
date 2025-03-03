import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // 호스트 헤더에서 서브도메인 추출
    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    // *.depl.link 형태인지 확인
    if (!host.endsWith('.depl.link')) {
      return NextResponse.json(
        { error: '유효하지 않은 호스트입니다.' },
        { status: 400 }
      );
    }
    
    // 서브도메인 추출 (프로젝트 ID로 사용)
    // const subdomain = host.split('.')[0];
    
    // 여기서 서브도메인을 사용하여 해당 프로젝트의 iOS 앱 정보를 조회할 수 있음
    // 예시 코드: const iosApps = await getIosAppsByProjectId(subdomain);
    
    // 임시 데이터 (실제로는 서브도메인으로 DB 조회 필요)
    const dummyIosApps = [
      {
        platform_data: {
          teamId: 'ABC12345DE',
          bundleId: 'com.example.myapp'
        }
      }
    ];
    
    // Apple App Site Association 형식에 맞게 응답 구성
    const response = {
      applinks: {
        apps: [],
        details: dummyIosApps.map((app: any) => ({
          appID: `${app.platform_data.teamId}.${app.platform_data.bundleId}`,
          paths: ["*"]
        }))
      }
    };
    
    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Apple App Site Association 생성 중 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

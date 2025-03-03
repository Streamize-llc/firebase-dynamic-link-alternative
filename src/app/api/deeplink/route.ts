import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  try {
    // 헤더 정보 가져오기
    const headersList = await headers();
    const host = headersList.get('host') || '';
    
    // 간단한 헬로우 월드 응답 반환
    return NextResponse.json(
      { 
        message: '헬로우 월드',
        host: host
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('오류 발생:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

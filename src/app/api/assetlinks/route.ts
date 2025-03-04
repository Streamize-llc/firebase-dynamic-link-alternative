import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json(
      { message: 'hello world' },
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

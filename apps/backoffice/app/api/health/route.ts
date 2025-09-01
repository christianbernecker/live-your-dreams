import { NextResponse } from 'next/server';

export async function GET() {
  // Erstmal OHNE Datenbankcheck
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasDatabase: !!process.env.DATABASE_URL,
      hasNextAuth: !!process.env.NEXTAUTH_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
}

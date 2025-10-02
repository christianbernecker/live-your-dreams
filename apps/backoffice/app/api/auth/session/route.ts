import { auth } from '@/lib/nextauth';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      email: session.user.email,
      name: session.user.name,
      isAdmin: session.user.email === 'christianbernecker@gmail.com',
    },
  });
}

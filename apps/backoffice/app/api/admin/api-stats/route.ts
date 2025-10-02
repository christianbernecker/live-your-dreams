import { auth } from '@/lib/nextauth';
import { ApiKeyService } from '@/lib/services/apiKeyService';
import { ApiUsageService } from '@/lib/services/apiUsageService';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.email !== 'christianbernecker@gmail.com') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [keys, stats, dailyUsage, recentCalls] = await Promise.all([
    ApiKeyService.listKeys(),
    ApiUsageService.getOverallStats(),
    ApiUsageService.getDailyUsage(30),
    ApiUsageService.getRecentCalls(10),
  ]);

  return NextResponse.json({
    keys,
    stats,
    dailyUsage,
    recentCalls,
  });
}

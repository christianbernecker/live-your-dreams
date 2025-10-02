import { prisma } from '@/lib/prisma';
import { ApiCallStatus } from '@prisma/client';

// Pricing pro 1M Tokens (in €)
// Quelle: Anthropic & OpenAI Pricing (Stand Oktober 2025)
export const PRICING = {
  // Anthropic Claude Models
  'claude-sonnet-4-5': { input: 3.0, output: 15.0 },
  'claude-sonnet-4-5-20250929': { input: 3.0, output: 15.0 },
  'claude-sonnet-4-20250514': { input: 3.0, output: 15.0 },
  'claude-sonnet-4': { input: 3.0, output: 15.0 },
  'claude-opus-4-20250514': { input: 15.0, output: 75.0 },
  'claude-opus-4': { input: 15.0, output: 75.0 },
  'claude-3-7-sonnet-20250219': { input: 3.0, output: 15.0 },
  'claude-3-5-sonnet-20241022': { input: 3.0, output: 15.0 },
  'claude-3-5-haiku-20241022': { input: 0.8, output: 4.0 },
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },

  // OpenAI GPT Models
  'gpt-5': { input: 1.25, output: 10.0 },
  'gpt-5-mini': { input: 0.3, output: 1.2 },
  'gpt-5-nano': { input: 0.1, output: 0.4 },
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-2024-08-06': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-4o-mini-2024-07-18': { input: 0.15, output: 0.6 },
  'gpt-4-turbo-2024-04-09': { input: 10.0, output: 30.0 },
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  'o4-mini': { input: 1.0, output: 4.0 },
} as const;

type PricingModel = keyof typeof PRICING;

/**
 * API Usage Tracking & Cost Monitoring Service
 */
export class ApiUsageService {
  /**
   * Loggt API Usage nach einem Call
   *
   * @param params - Usage Details
   */
  static async logUsage(params: {
    apiKeyId: string;
    feature: string;
    endpoint: string;
    model: string;
    inputTokens: number;
    outputTokens: number;
    durationMs: number;
    status: ApiCallStatus;
    userId?: string;
    errorMessage?: string;
    metadata?: any;
  }) {
    const pricing = PRICING[params.model as PricingModel] || { input: 0, output: 0 };

    const inputCost = (params.inputTokens / 1_000_000) * pricing.input;
    const outputCost = (params.outputTokens / 1_000_000) * pricing.output;
    const totalCost = inputCost + outputCost;

    return await prisma.apiUsageLog.create({
      data: {
        apiKeyId: params.apiKeyId,
        feature: params.feature,
        endpoint: params.endpoint,
        model: params.model,
        inputTokens: params.inputTokens,
        outputTokens: params.outputTokens,
        totalTokens: params.inputTokens + params.outputTokens,
        inputCost,
        outputCost,
        totalCost,
        durationMs: params.durationMs,
        status: params.status,
        userId: params.userId,
        errorMessage: params.errorMessage,
        metadata: params.metadata,
      },
    });
  }

  /**
   * Monatliche Kosten für einen Key
   *
   * @param apiKeyId - ID des API Keys
   */
  static async getMonthlyUsage(apiKeyId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const stats = await prisma.apiUsageLog.aggregate({
      where: {
        apiKeyId,
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        inputTokens: true,
        outputTokens: true,
        totalCost: true,
      },
      _count: true,
    });

    return {
      totalCalls: stats._count,
      totalTokens: (stats._sum.inputTokens || 0) + (stats._sum.outputTokens || 0),
      totalCost: stats._sum.totalCost ? Number(stats._sum.totalCost) : 0,
    };
  }

  /**
   * Übersicht aller Features
   *
   * @param startDate - Start-Datum
   * @param endDate - End-Datum
   */
  static async getFeatureBreakdown(startDate: Date, endDate: Date) {
    const logs = await prisma.apiUsageLog.groupBy({
      by: ['feature', 'model'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalCost: true,
        totalTokens: true,
      },
      _count: true,
    });

    return logs.map((log) => ({
      feature: log.feature,
      model: log.model,
      calls: log._count,
      tokens: log._sum.totalTokens || 0,
      cost: log._sum.totalCost ? Number(log._sum.totalCost) : 0,
    }));
  }

  /**
   * Tägliche Nutzungsstatistiken (für Charts)
   *
   * @param days - Anzahl Tage zurück
   */
  static async getDailyUsage(days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const logs = await prisma.apiUsageLog.findMany({
      where: {
        createdAt: { gte: startDate },
      },
      select: {
        createdAt: true,
        totalCost: true,
        totalTokens: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group by day
    const dailyMap = new Map<string, { cost: number; tokens: number; calls: number }>();

    logs.forEach((log) => {
      const day = log.createdAt.toISOString().split('T')[0];
      const existing = dailyMap.get(day) || { cost: 0, tokens: 0, calls: 0 };

      dailyMap.set(day, {
        cost: existing.cost + Number(log.totalCost),
        tokens: existing.tokens + log.totalTokens,
        calls: existing.calls + 1,
      });
    });

    return Array.from(dailyMap.entries())
      .map(([date, stats]) => ({
        date,
        totalCost: stats.cost,
        tokens: stats.tokens,
        totalCalls: stats.calls,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  /**
   * Letzte API Calls (für Recent Activity Feed)
   *
   * @param limit - Anzahl der Einträge
   */
  static async getRecentCalls(limit: number = 20) {
    return await prisma.apiUsageLog.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        apiKey: {
          select: {
            provider: true,
            name: true,
          },
        },
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  /**
   * Gesamt-Statistiken (für Dashboard Overview)
   */
  static async getOverallStats() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Monthly Stats
    const monthlyStats = await prisma.apiUsageLog.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
      },
      _sum: {
        totalCost: true,
        totalTokens: true,
        inputTokens: true,
        outputTokens: true,
      },
      _count: true,
    });

    // Today Stats
    const todayStats = await prisma.apiUsageLog.aggregate({
      where: {
        createdAt: { gte: startOfToday },
      },
      _sum: {
        totalCost: true,
        totalTokens: true,
        inputTokens: true,
        outputTokens: true,
      },
      _count: true,
    });

    return {
      today: {
        totalCost: todayStats._sum.totalCost ? Number(todayStats._sum.totalCost) : 0,
        totalCalls: todayStats._count || 0,
        totalTokens: todayStats._sum.totalTokens || 0,
        inputTokens: todayStats._sum.inputTokens || 0,
        outputTokens: todayStats._sum.outputTokens || 0,
      },
      month: {
        totalCost: monthlyStats._sum.totalCost ? Number(monthlyStats._sum.totalCost) : 0,
        totalCalls: monthlyStats._count || 0,
        totalTokens: monthlyStats._sum.totalTokens || 0,
        inputTokens: monthlyStats._sum.inputTokens || 0,
        outputTokens: monthlyStats._sum.outputTokens || 0,
      },
    };
  }
}

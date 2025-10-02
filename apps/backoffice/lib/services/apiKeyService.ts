import { prisma } from '@/lib/prisma';
import { EncryptionService } from '@/lib/encryption';
import { ApiProvider } from '@prisma/client';

/**
 * API Key Management Service
 *
 * Handles secure storage and retrieval of API keys
 */
export class ApiKeyService {
  /**
   * Holt aktiven API Key für Provider (für API Calls)
   *
   * @param provider - ANTHROPIC oder OPENAI
   * @returns Entschlüsselter API Key oder null
   */
  static async getActiveKey(provider: ApiProvider): Promise<string | null> {
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        provider,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!apiKey) {
      console.warn(`⚠️  No active ${provider} API key found`);
      return null;
    }

    // Update lastUsedAt
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return EncryptionService.decrypt(apiKey.keyHash);
  }

  /**
   * Liste aller Keys (maskiert, für Dashboard)
   *
   * @returns Array von API Keys mit maskierten Keys
   */
  static async listKeys() {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const keys = await prisma.apiKey.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { usageLogs: true },
        },
      },
    });

    // Fetch monthly costs for all keys in parallel
    const keysWithCosts = await Promise.all(
      keys.map(async (key) => {
        const monthlyCostData = await prisma.apiUsageLog.aggregate({
          where: {
            apiKeyId: key.id,
            createdAt: { gte: startOfMonth },
          },
          _sum: {
            totalCost: true,
          },
        });

        return {
          id: key.id,
          provider: key.provider,
          name: key.name,
          maskedKey: EncryptionService.mask(EncryptionService.decrypt(key.keyHash)),
          isActive: key.isActive,
          createdAt: key.createdAt,
          lastUsedAt: key.lastUsedAt,
          monthlyLimit: key.monthlyLimit ? Number(key.monthlyLimit) : null,
          callCount: key._count.usageLogs,
          monthlyCost: monthlyCostData._sum.totalCost ? Number(monthlyCostData._sum.totalCost) : 0,
        };
      })
    );

    return keysWithCosts;
  }

  /**
   * Holt API Key Details mit Nutzungsstatistiken
   *
   * @param keyId - ID des API Keys
   * @returns Key Details mit Stats
   */
  static async getKeyStats(keyId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const key = await prisma.apiKey.findUnique({
      where: { id: keyId },
      include: {
        usageLogs: {
          where: {
            createdAt: { gte: startOfMonth },
          },
        },
      },
    });

    if (!key) return null;

    const monthlyStats = await prisma.apiUsageLog.aggregate({
      where: {
        apiKeyId: keyId,
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
      id: key.id,
      provider: key.provider,
      name: key.name,
      maskedKey: EncryptionService.mask(EncryptionService.decrypt(key.keyHash)),
      isActive: key.isActive,
      monthlyLimit: key.monthlyLimit ? Number(key.monthlyLimit) : null,
      monthlyUsage: {
        calls: monthlyStats._count,
        totalTokens: (monthlyStats._sum.inputTokens || 0) + (monthlyStats._sum.outputTokens || 0),
        totalCost: monthlyStats._sum.totalCost ? Number(monthlyStats._sum.totalCost) : 0,
      },
    };
  }
}

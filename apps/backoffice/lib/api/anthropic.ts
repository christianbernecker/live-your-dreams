import Anthropic from '@anthropic-ai/sdk';
import { ApiKeyService } from '@/lib/services/apiKeyService';
import { ApiUsageService } from '@/lib/services/apiUsageService';
import { prisma } from '@/lib/prisma';

/**
 * Erstellt Anthropic Client mit aktivem API Key
 */
export async function createAnthropicClient() {
  const apiKey = await ApiKeyService.getActiveKey('ANTHROPIC');

  if (!apiKey) {
    throw new Error('No active Anthropic API key found. Please configure an API key first.');
  }

  return new Anthropic({ apiKey });
}

/**
 * Wrapper für Anthropic API Calls mit automatischem Usage Tracking
 *
 * @example
 * const response = await callClaude({
 *   feature: 'blog-assistant',
 *   model: 'claude-sonnet-4.5-20250929',
 *   messages: [{ role: 'user', content: 'Write a blog post about...' }],
 *   userId: session.user.id,
 * });
 */
export async function callClaude(params: {
  feature: string;
  model: string;
  messages: Anthropic.MessageParam[];
  userId?: string;
  maxTokens?: number;
  temperature?: number;
  metadata?: any;
}) {
  const startTime = Date.now();
  const client = await createAnthropicClient();

  // Get API Key for logging
  const apiKey = await prisma.apiKey.findFirst({
    where: { provider: 'ANTHROPIC', isActive: true },
  });

  if (!apiKey) {
    throw new Error('No active Anthropic API key found');
  }

  try {
    const response = await client.messages.create({
      model: params.model,
      messages: params.messages,
      max_tokens: params.maxTokens || 4096,
      temperature: params.temperature,
    });

    // Log Success
    await ApiUsageService.logUsage({
      apiKeyId: apiKey.id,
      feature: params.feature,
      endpoint: 'messages',
      model: params.model,
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      durationMs: Date.now() - startTime,
      status: 'SUCCESS',
      userId: params.userId,
      metadata: params.metadata,
    });

    return response;
  } catch (error) {
    // Log Error
    await ApiUsageService.logUsage({
      apiKeyId: apiKey.id,
      feature: params.feature,
      endpoint: 'messages',
      model: params.model,
      inputTokens: 0,
      outputTokens: 0,
      durationMs: Date.now() - startTime,
      status: error instanceof Error && error.message.includes('rate_limit') ? 'RATE_LIMITED' : 'ERROR',
      userId: params.userId,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      metadata: params.metadata,
    });

    throw error;
  }
}

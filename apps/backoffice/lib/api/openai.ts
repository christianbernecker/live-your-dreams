import OpenAI from 'openai';
import { ApiKeyService } from '@/lib/services/apiKeyService';
import { ApiUsageService } from '@/lib/services/apiUsageService';
import { prisma } from '@/lib/prisma';

/**
 * Erstellt OpenAI Client mit aktivem API Key
 */
export async function createOpenAIClient() {
  const apiKey = await ApiKeyService.getActiveKey('OPENAI');

  if (!apiKey) {
    throw new Error('No active OpenAI API key found. Please configure an API key first.');
  }

  return new OpenAI({ apiKey });
}

/**
 * Wrapper für OpenAI API Calls mit automatischem Usage Tracking
 *
 * @example
 * const response = await callGPT({
 *   feature: 'blog-assistant',
 *   model: 'gpt-4o',
 *   messages: [{ role: 'user', content: 'Write a blog post about...' }],
 *   userId: session.user.id,
 * });
 */
export async function callGPT(params: {
  feature: string;
  model: string;
  messages: OpenAI.ChatCompletionMessageParam[];
  userId?: string;
  temperature?: number;
  maxTokens?: number;
  metadata?: any;
}) {
  const startTime = Date.now();
  const client = await createOpenAIClient();

  // Get API Key for logging
  const apiKey = await prisma.apiKey.findFirst({
    where: { provider: 'OPENAI', isActive: true },
  });

  if (!apiKey) {
    throw new Error('No active OpenAI API key found');
  }

  try {
    const response = await client.chat.completions.create({
      model: params.model,
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
    });

    // Log Success
    await ApiUsageService.logUsage({
      apiKeyId: apiKey.id,
      feature: params.feature,
      endpoint: 'chat/completions',
      model: params.model,
      inputTokens: response.usage?.prompt_tokens || 0,
      outputTokens: response.usage?.completion_tokens || 0,
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
      endpoint: 'chat/completions',
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

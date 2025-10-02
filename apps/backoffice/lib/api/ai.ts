/**
 * Intelligente AI API
 *
 * Task-basierte Model-Auswahl statt hardcoded Models.
 * Wählt automatisch das beste Model für den jeweiligen Task.
 *
 * Beispiel:
 * ```ts
 * const response = await callAI({
 *   task: 'coding',
 *   quality: 'premium',
 *   messages: [{ role: 'user', content: 'Schreibe eine Funktion...' }],
 *   feature: 'code-generator',
 * });
 * ```
 */

import { callClaude } from './anthropic';
import { callGPT } from './openai';
import {
  type AITask,
  type AIQuality,
  type AIProvider,
  getBestModelForTask,
  DEFAULT_QUALITY,
  DEFAULT_TASK,
} from '../config/ai-models';
import type Anthropic from '@anthropic-ai/sdk';

export interface AICallParams {
  // Task-Definition (automatische Model-Wahl)
  task?: AITask;
  quality?: AIQuality;

  // Oder explizite Provider/Model-Wahl (überschreibt task-basierte Auswahl)
  provider?: AIProvider;
  model?: string;

  // Feature-Name für Tracking
  feature: string;

  // Messages (kompatibel mit beiden Providern)
  messages: Anthropic.MessageParam[];

  // Optional
  userId?: string;
  maxTokens?: number;
  metadata?: any;
  temperature?: number;
  systemPrompt?: string;
}

export interface AICallResponse {
  // Unified Response
  content: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  model: string;
  provider: AIProvider;

  // Raw Response (falls detaillierte Infos benötigt werden)
  raw: any;
}

/**
 * Intelligente AI Call Funktion
 *
 * Wählt automatisch das beste Model basierend auf Task & Quality.
 * Fallback auf anderen Provider bei Fehler.
 */
export async function callAI(params: AICallParams): Promise<AICallResponse> {
  let provider: AIProvider;
  let model: string;

  // Model-Auswahl: Explizit oder automatisch
  if (params.provider && params.model) {
    // Explizite Wahl
    provider = params.provider;
    model = params.model;
  } else {
    // Automatische Task-basierte Auswahl
    const bestModel = getBestModelForTask(
      params.task || DEFAULT_TASK,
      params.quality || DEFAULT_QUALITY
    );
    provider = bestModel.provider;
    model = bestModel.model;
  }

  try {
    // Provider-spezifischer Call
    if (provider === 'ANTHROPIC') {
      return await callClaudeWithUnifiedResponse(params, model);
    } else {
      return await callGPTWithUnifiedResponse(params, model);
    }
  } catch (error) {
    console.error(`AI Call Error (${provider}:${model}):`, error);

    // Fallback: Versuche anderen Provider
    const fallbackProvider: AIProvider = provider === 'ANTHROPIC' ? 'OPENAI' : 'ANTHROPIC';

    console.log(`= Fallback to ${fallbackProvider}...`);

    try {
      if (fallbackProvider === 'ANTHROPIC') {
        return await callClaudeWithUnifiedResponse(params, model);
      } else {
        return await callGPTWithUnifiedResponse(params, model);
      }
    } catch (fallbackError) {
      console.error(`Fallback also failed:`, fallbackError);
      throw new Error(`Both AI providers failed. Original error: ${error}`);
    }
  }
}

/**
 * Claude Call mit unified Response
 */
async function callClaudeWithUnifiedResponse(
  params: AICallParams,
  model: string
): Promise<AICallResponse> {
  const response = await callClaude({
    feature: params.feature,
    model,
    messages: params.messages,
    userId: params.userId,
    maxTokens: params.maxTokens || 4096,
    metadata: {
      ...params.metadata,
      task: params.task,
      quality: params.quality,
    },
  });

  return {
    content: response.content[0].type === 'text' ? response.content[0].text : '',
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens,
    },
    model: response.model,
    provider: 'ANTHROPIC',
    raw: response,
  };
}

/**
 * GPT Call mit unified Response
 */
async function callGPTWithUnifiedResponse(
  params: AICallParams,
  model: string
): Promise<AICallResponse> {
  const response = await callGPT({
    feature: params.feature,
    model,
    messages: params.messages.map((msg) => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content),
    })),
    userId: params.userId,
    maxTokens: params.maxTokens || 4096,
    metadata: {
      ...params.metadata,
      task: params.task,
      quality: params.quality,
    },
  });

  const usage = response.usage;

  return {
    content: response.choices[0].message.content || '',
    usage: {
      inputTokens: usage?.prompt_tokens || 0,
      outputTokens: usage?.completion_tokens || 0,
      totalTokens: usage?.total_tokens || 0,
    },
    model: response.model,
    provider: 'OPENAI',
    raw: response,
  };
}

/**
 * Convenience Functions für häufige Tasks
 */

export async function generateCode(params: {
  prompt: string;
  feature: string;
  userId?: string;
  quality?: AIQuality;
}): Promise<string> {
  const response = await callAI({
    task: 'coding',
    quality: params.quality || 'premium',
    feature: params.feature,
    messages: [{ role: 'user', content: params.prompt }],
    userId: params.userId,
  });

  return response.content;
}

export async function analyzeText(params: {
  text: string;
  task: string;
  feature: string;
  userId?: string;
  quality?: AIQuality;
}): Promise<string> {
  const response = await callAI({
    task: 'general',
    quality: params.quality || 'standard',
    feature: params.feature,
    messages: [
      { role: 'user', content: `${params.task}\n\nText: ${params.text}` },
    ],
    userId: params.userId,
  });

  return response.content;
}

export async function reasonAbout(params: {
  question: string;
  context?: string;
  feature: string;
  userId?: string;
}): Promise<string> {
  const response = await callAI({
    task: 'reasoning',
    quality: 'premium',
    feature: params.feature,
    messages: [
      {
        role: 'user',
        content: params.context
          ? `Context: ${params.context}\n\nQuestion: ${params.question}`
          : params.question,
      },
    ],
    userId: params.userId,
  });

  return response.content;
}

export async function quickResponse(params: {
  prompt: string;
  feature: string;
  userId?: string;
}): Promise<string> {
  const response = await callAI({
    task: 'fast',
    quality: 'nano',
    feature: params.feature,
    messages: [{ role: 'user', content: params.prompt }],
    userId: params.userId,
    maxTokens: 512,
  });

  return response.content;
}

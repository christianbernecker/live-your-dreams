/**
 * AI Model Configuration
 *
 * Zentrale Verwaltung aller AI Models mit:
 * - Aktuellen Model-Namen
 * - Pricing-Information
 * - Task-basierter Model-Auswahl
 * - Quality-Stufen
 */

export type AIProvider = 'ANTHROPIC' | 'OPENAI';
export type AITask = 'coding' | 'reasoning' | 'general' | 'fast' | 'vision' | 'transcription';
export type AIQuality = 'premium' | 'standard' | 'fast' | 'nano';

/**
 * Model Definitions mit aktuellen Namen (Stand Oktober 2025)
 */
export const MODELS = {
  ANTHROPIC: {
    // Claude Sonnet 4.5 - Neuestes Model (Sept 2025), beste Coding-Performance
    SONNET_4_5: 'claude-sonnet-4-5',

    // Claude Sonnet 4 - Sehr gutes Balance-Model
    SONNET_4: 'claude-sonnet-4-20250514',

    // Claude Opus 4 - H�chste Qualit�t f�r komplexe Tasks
    OPUS_4: 'claude-opus-4-20250514',

    // Claude Haiku 3.5 - Schnell & g�nstig
    HAIKU_3_5: 'claude-3-5-haiku-20241022',
  },
  OPENAI: {
    // GPT-5 - Neuestes Model (Aug 2025), beste Balance
    GPT_5: 'gpt-5',

    // GPT-5 Mini - G�nstiger, schneller
    GPT_5_MINI: 'gpt-5-mini',

    // GPT-5 Nano - Noch g�nstiger, f�r einfache Tasks
    GPT_5_NANO: 'gpt-5-nano',

    // GPT-4o - Weiterhin verf�gbar, gutes Multi-Modal Model
    GPT_4O: 'gpt-4o',

    // o4-mini - Reasoning Model
    O4_MINI: 'o4-mini',
  },
} as const;

/**
 * Pricing pro 1M Tokens (Input / Output) in �
 * Stand: Oktober 2025
 */
export const PRICING = {
  ANTHROPIC: {
    [MODELS.ANTHROPIC.SONNET_4_5]: { input: 3.0, output: 15.0 },
    [MODELS.ANTHROPIC.SONNET_4]: { input: 3.0, output: 15.0 },
    [MODELS.ANTHROPIC.OPUS_4]: { input: 15.0, output: 75.0 },
    [MODELS.ANTHROPIC.HAIKU_3_5]: { input: 0.8, output: 4.0 },
  },
  OPENAI: {
    [MODELS.OPENAI.GPT_5]: { input: 1.25, output: 10.0 },
    [MODELS.OPENAI.GPT_5_MINI]: { input: 0.3, output: 1.2 },
    [MODELS.OPENAI.GPT_5_NANO]: { input: 0.1, output: 0.4 },
    [MODELS.OPENAI.GPT_4O]: { input: 2.5, output: 10.0 },
    [MODELS.OPENAI.O4_MINI]: { input: 1.0, output: 4.0 },
  },
} as const;

/**
 * Task-basierte Model-Auswahl
 *
 * W�hlt automatisch das beste Model f�r den jeweiligen Task.
 * Ber�cksichtigt Quality-Stufe und Provider-Pr�ferenz.
 */
export const TASK_MODEL_MAP = {
  // Coding: Claude Sonnet 4.5 ist Weltklasse
  coding: {
    premium: { provider: 'ANTHROPIC' as const, model: MODELS.ANTHROPIC.SONNET_4_5 },
    standard: { provider: 'ANTHROPIC' as const, model: MODELS.ANTHROPIC.SONNET_4 },
    fast: { provider: 'ANTHROPIC' as const, model: MODELS.ANTHROPIC.HAIKU_3_5 },
  },

  // Reasoning: OpenAI o4-mini spezialisiert
  reasoning: {
    premium: { provider: 'OPENAI' as const, model: MODELS.OPENAI.O4_MINI },
    standard: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5 },
    fast: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5_MINI },
  },

  // General: GPT-5 beste Balance (g�nstiger als Claude)
  general: {
    premium: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5 },
    standard: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5_MINI },
    fast: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5_NANO },
    nano: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5_NANO },
  },

  // Fast: Schnellste & g�nstigste Models
  fast: {
    premium: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5_MINI },
    standard: { provider: 'ANTHROPIC' as const, model: MODELS.ANTHROPIC.HAIKU_3_5 },
    fast: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5_NANO },
    nano: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_5_NANO },
  },

  // Vision: Multi-Modal Models
  vision: {
    premium: { provider: 'ANTHROPIC' as const, model: MODELS.ANTHROPIC.SONNET_4_5 },
    standard: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_4O },
    fast: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_4O },
  },

  // Transcription: GPT-4o spezialisiert
  transcription: {
    premium: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_4O },
    standard: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_4O },
    fast: { provider: 'OPENAI' as const, model: MODELS.OPENAI.GPT_4O },
  },
} as const;

/**
 * Default Settings
 */
export const DEFAULT_PROVIDER: AIProvider = 'ANTHROPIC';
export const DEFAULT_QUALITY: AIQuality = 'standard';
export const DEFAULT_TASK: AITask = 'general';

/**
 * Helper: Hole bestes Model f�r Task
 */
export function getBestModelForTask(
  task: AITask = DEFAULT_TASK,
  quality: AIQuality = DEFAULT_QUALITY
): { provider: AIProvider; model: string } {
  const taskMap = TASK_MODEL_MAP[task];

  // Fallback wenn Quality nicht existiert
  if (!(quality in taskMap)) {
    quality = 'standard';
  }

  return taskMap[quality as keyof typeof taskMap];
}

/**
 * Helper: Berechne Kosten f�r Model
 */
export function calculateCost(
  provider: AIProvider,
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const providerPricing = PRICING[provider] as Record<string, { input: number; output: number }>;
  const pricing = providerPricing[model];

  if (!pricing) {
    console.warn(`No pricing found for ${provider}:${model}, using fallback`);
    return 0;
  }

  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;

  return inputCost + outputCost;
}

/**
 * Helper: Model-Info abrufen
 */
export function getModelInfo(provider: AIProvider, model: string) {
  const providerPricing = PRICING[provider] as Record<string, { input: number; output: number }>;
  const pricing = providerPricing[model];

  return {
    provider,
    model,
    pricing: pricing || { input: 0, output: 0 },
    displayName: model,
  };
}

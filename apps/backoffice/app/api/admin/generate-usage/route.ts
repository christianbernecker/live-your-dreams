/**
 * API Route: POST /api/admin/generate-usage
 * 
 * Generiert API Usage für Dashboard Testing
 * Führt Deep Research Tasks mit Anthropic & OpenAI aus
 * 
 * SICHERHEIT: Nur für Admin-User
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/nextauth';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_SECRET || '7fa5fff1bbfea7f136743546fcd40e5d948ef55ebc13059417a3e4929364158b';

// Entschlüsselung
function decrypt(encryptedData: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encryptedText = Buffer.from(parts[2], 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString('utf8');
}

// Research Tasks
const CLAUDE_TASK = `Analysiere die Evolution von Large Language Models von 2020 bis 2025. Fokus auf: Architektur (Transformer-Varianten), Training (RLHF, Constitutional AI), Benchmarks (MMLU, HumanEval), Ethik (Bias, Safety), Business Impact. Liefere eine tiefgehende Analyse mit konkreten Zahlen und Trends.`;

const OPENAI_TASK = `Erstelle eine technische Deep-Dive Analyse zu State-of-the-Art AI Agent Architectures. Fokus auf: Frameworks (ReAct, CoT, Tree of Thoughts), Tool Use, Memory Systems (RAG, Vector DBs), Planning, Production Challenges (Latency, Cost, Reliability). Inkludiere Best Practices.`;

// Pricing
const PRICING = {
  ANTHROPIC: { input: 1.00, output: 5.00 },
  OPENAI: { input: 0.15, output: 0.60 }
};

function calculateCost(provider: 'ANTHROPIC' | 'OPENAI', inputTokens: number, outputTokens: number): number {
  const pricing = PRICING[provider];
  const costUSD = (inputTokens / 1_000_000 * pricing.input) + (outputTokens / 1_000_000 * pricing.output);
  return costUSD * 1.10; // USD -> EUR
}

export async function POST(request: NextRequest) {
  try {
    // Auth Check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Admin Check
    const isAdmin = session.user.permissions?.includes('users.read') || 
                    session.user.email === 'admin@liveyourdreams.online';
    
    if (!isAdmin) {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 });
    }

    console.log('🚀 Generating API Usage...');

    // Fetch Keys
    const keys: any[] = await prisma.$queryRaw`
      SELECT id, provider, name, "keyHash", is_active
      FROM api_keys
      WHERE is_active = true
    `;

    if (keys.length === 0) {
      return NextResponse.json({ error: 'No active API keys found' }, { status: 404 });
    }

    const results: any[] = [];

    for (const key of keys) {
      const decryptedKey = decrypt(key.keyHash);
      const startTime = Date.now();

      try {
        if (key.provider === 'ANTHROPIC') {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': decryptedKey,
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: 'claude-3-5-haiku-20241022',
              max_tokens: 2048,
              messages: [{ role: 'user', content: CLAUDE_TASK }]
            })
          });

          const duration = Date.now() - startTime;

          if (response.ok) {
            const data = await response.json();
            const cost = calculateCost('ANTHROPIC', data.usage.input_tokens, data.usage.output_tokens);

            await prisma.apiUsageLog.create({
              data: {
                apiKeyId: key.id,
                provider: 'ANTHROPIC',
                model: data.model,
                feature: 'research-llm-evolution',
                inputTokens: data.usage.input_tokens,
                outputTokens: data.usage.output_tokens,
                totalTokens: data.usage.input_tokens + data.usage.output_tokens,
                totalCost: cost,
                status: 'SUCCESS',
                durationMs: duration
              }
            });

            await prisma.apiKey.update({
              where: { id: key.id },
              data: { lastUsedAt: new Date() }
            });

            results.push({
              provider: 'ANTHROPIC',
              status: 'SUCCESS',
              tokens: data.usage.input_tokens + data.usage.output_tokens,
              cost
            });
          }
        } else if (key.provider === 'OPENAI') {
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${decryptedKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              max_tokens: 2048,
              messages: [{ role: 'user', content: OPENAI_TASK }]
            })
          });

          const duration = Date.now() - startTime;

          if (response.ok) {
            const data = await response.json();
            const cost = calculateCost('OPENAI', data.usage.prompt_tokens, data.usage.completion_tokens);

            await prisma.apiUsageLog.create({
              data: {
                apiKeyId: key.id,
                provider: 'OPENAI',
                model: data.model,
                feature: 'research-ai-agents',
                inputTokens: data.usage.prompt_tokens,
                outputTokens: data.usage.completion_tokens,
                totalTokens: data.usage.total_tokens,
                totalCost: cost,
                status: 'SUCCESS',
                durationMs: duration
              }
            });

            await prisma.apiKey.update({
              where: { id: key.id },
              data: { lastUsedAt: new Date() }
            });

            results.push({
              provider: 'OPENAI',
              status: 'SUCCESS',
              tokens: data.usage.total_tokens,
              cost
            });
          }
        }

        // Pause zwischen Calls
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error calling ${key.provider}:`, error);
        results.push({
          provider: key.provider,
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'API Usage generated. Refresh dashboard to see updates.'
    });

  } catch (error) {
    console.error('Generate Usage Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}


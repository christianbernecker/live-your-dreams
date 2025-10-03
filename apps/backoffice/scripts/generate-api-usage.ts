/**
 * Generate API Usage for Dashboard Testing
 * 
 * Führt Deep Research Tasks mit Anthropic & OpenAI aus
 * Loggt Usage in api_usage_logs Tabelle
 * 
 * Usage: ts-node scripts/generate-api-usage.ts
 */

import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_SECRET || '7fa5fff1bbfea7f136743546fcd40e5d948ef55ebc13059417a3e4929364158b';

// Entschlüsselung (aus test-api-keys.ts)
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

// Research Task 1: Anthropic Claude (Deep Analysis)
const CLAUDE_RESEARCH_TASK = `
Analysiere die Evolution von Large Language Models von 2020 bis 2025:

1. **Architektur-Entwicklung:**
   - Transformer-Varianten (GPT, BERT, T5, PaLM, Claude, etc.)
   - Skalierungsgesetze (Chinchilla, Emergent Abilities)
   - Multimodal Integration (Vision, Audio, Code)

2. **Training-Methoden:**
   - Pretraining vs. Finetuning
   - RLHF (Reinforcement Learning from Human Feedback)
   - Constitutional AI
   - Alignment-Techniken

3. **Performance-Benchmarks:**
   - MMLU, HumanEval, GSM8K
   - Real-world Use Cases
   - Frontier Capabilities

4. **Ethik & Safety:**
   - Bias Mitigation
   - Red Teaming
   - Jailbreak-Resistenz
   - Content Moderation

5. **Business Impact:**
   - Adoption Rates in verschiedenen Industrien
   - ROI Studies
   - Cost vs. Performance Trade-offs

Liefere eine tiefgehende Analyse mit konkreten Zahlen, Papers und Trends.
`;

// Research Task 2: OpenAI GPT (Technical Deep Dive)
const OPENAI_RESEARCH_TASK = `
Erstelle eine technische Deep-Dive Analyse zu State-of-the-Art AI Agent Architectures:

1. **Agent Frameworks:**
   - ReAct Pattern (Reasoning + Acting)
   - Chain-of-Thought Prompting
   - Tree of Thoughts
   - Reflection & Self-Correction
   - Multi-Agent Systems

2. **Tool Use & Function Calling:**
   - API Integration Patterns
   - Context Management
   - Error Handling & Retry Logic
   - Parallel vs. Sequential Execution

3. **Memory Systems:**
   - Short-term vs. Long-term Memory
   - Vector Databases (Pinecone, Weaviate, Chroma)
   - Retrieval-Augmented Generation (RAG)
   - Episodic Memory for Agents

4. **Planning & Reasoning:**
   - Hierarchical Task Decomposition
   - Goal-Directed Behavior
   - Environment Feedback Loops
   - Plan Refinement

5. **Production Challenges:**
   - Latency Optimization
   - Cost Management
   - Reliability & Failover
   - Monitoring & Observability

Inkludiere Code-Beispiele, Architektur-Diagramme (als Text) und Best Practices.
`;

// Pricing (Stand Oktober 2025)
const PRICING = {
  ANTHROPIC: {
    'claude-3-5-haiku-20241022': { input: 1.00, output: 5.00 }, // $ per 1M tokens
    'claude-sonnet-4': { input: 3.00, output: 15.00 }
  },
  OPENAI: {
    'gpt-4o-mini': { input: 0.15, output: 0.60 }
  }
};

function calculateCost(provider: 'ANTHROPIC' | 'OPENAI', model: string, inputTokens: number, outputTokens: number): number {
  const pricing = provider === 'ANTHROPIC' 
    ? PRICING.ANTHROPIC[model as keyof typeof PRICING.ANTHROPIC]
    : PRICING.OPENAI[model as keyof typeof PRICING.OPENAI];
  
  if (!pricing) return 0;
  
  const costUSD = (inputTokens / 1_000_000 * pricing.input) + (outputTokens / 1_000_000 * pricing.output);
  return costUSD * 1.10; // USD -> EUR (ca. 10% Aufschlag)
}

async function callAnthropicAPI(apiKey: string, keyId: string) {
  console.log('\n🔵 ANTHROPIC CLAUDE - Deep Research Task');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-haiku-20241022', // Schneller & günstiger für Test
        max_tokens: 2048, // Erhöht für längere Antwort
        messages: [{ 
          role: 'user', 
          content: CLAUDE_RESEARCH_TASK 
        }]
      })
    });
    
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API Error: ${response.status}`);
      console.error(error.substring(0, 200));
      
      // Log Error
      await prisma.apiUsageLog.create({
        data: {
          apiKeyId: keyId,
          provider: 'ANTHROPIC',
          model: 'claude-3-5-haiku-20241022',
          feature: 'research-llm-evolution',
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          totalCost: 0,
          status: 'ERROR',
          errorMessage: `HTTP ${response.status}: ${error.substring(0, 200)}`,
          durationMs: duration
        }
      });
      
      return;
    }
    
    const data = await response.json();
    const inputTokens = data.usage.input_tokens;
    const outputTokens = data.usage.output_tokens;
    const totalTokens = inputTokens + outputTokens;
    const cost = calculateCost('ANTHROPIC', 'claude-3-5-haiku-20241022', inputTokens, outputTokens);
    
    console.log(`✅ SUCCESS`);
    console.log(`   Model: ${data.model}`);
    console.log(`   Tokens: ${inputTokens.toLocaleString()} in / ${outputTokens.toLocaleString()} out = ${totalTokens.toLocaleString()} total`);
    console.log(`   Cost: €${cost.toFixed(4)}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Response Preview: ${data.content[0].text.substring(0, 150)}...`);
    
    // Log Success
    await prisma.apiUsageLog.create({
      data: {
        apiKeyId: keyId,
        provider: 'ANTHROPIC',
        model: data.model,
        feature: 'research-llm-evolution',
        inputTokens,
        outputTokens,
        totalTokens,
        totalCost: cost,
        status: 'SUCCESS',
        durationMs: duration
      }
    });
    
    // Update lastUsedAt
    await prisma.apiKey.update({
      where: { id: keyId },
      data: { lastUsedAt: new Date() }
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Network Error:', error);
    
    await prisma.apiUsageLog.create({
      data: {
        apiKeyId: keyId,
        provider: 'ANTHROPIC',
        model: 'claude-3-5-haiku-20241022',
        feature: 'research-llm-evolution',
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        totalCost: 0,
        status: 'ERROR',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        durationMs: duration
      }
    });
  }
}

async function callOpenAIAPI(apiKey: string, keyId: string) {
  console.log('\n🟢 OPENAI GPT - Deep Research Task');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 2048,
        messages: [{ 
          role: 'user', 
          content: OPENAI_RESEARCH_TASK 
        }]
      })
    });
    
    const duration = Date.now() - startTime;
    
    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ API Error: ${response.status}`);
      console.error(error.substring(0, 200));
      
      await prisma.apiUsageLog.create({
        data: {
          apiKeyId: keyId,
          provider: 'OPENAI',
          model: 'gpt-4o-mini',
          feature: 'research-ai-agents',
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
          totalCost: 0,
          status: 'ERROR',
          errorMessage: `HTTP ${response.status}: ${error.substring(0, 200)}`,
          durationMs: duration
        }
      });
      
      return;
    }
    
    const data = await response.json();
    const inputTokens = data.usage.prompt_tokens;
    const outputTokens = data.usage.completion_tokens;
    const totalTokens = data.usage.total_tokens;
    const cost = calculateCost('OPENAI', 'gpt-4o-mini', inputTokens, outputTokens);
    
    console.log(`✅ SUCCESS`);
    console.log(`   Model: ${data.model}`);
    console.log(`   Tokens: ${inputTokens.toLocaleString()} in / ${outputTokens.toLocaleString()} out = ${totalTokens.toLocaleString()} total`);
    console.log(`   Cost: €${cost.toFixed(4)}`);
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Response Preview: ${data.choices[0].message.content.substring(0, 150)}...`);
    
    await prisma.apiUsageLog.create({
      data: {
        apiKeyId: keyId,
        provider: 'OPENAI',
        model: data.model,
        feature: 'research-ai-agents',
        inputTokens,
        outputTokens,
        totalTokens,
        totalCost: cost,
        status: 'SUCCESS',
        durationMs: duration
      }
    });
    
    await prisma.apiKey.update({
      where: { id: keyId },
      data: { lastUsedAt: new Date() }
    });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error('❌ Network Error:', error);
    
    await prisma.apiUsageLog.create({
      data: {
        apiKeyId: keyId,
        provider: 'OPENAI',
        model: 'gpt-4o-mini',
        feature: 'research-ai-agents',
        inputTokens: 0,
        outputTokens: 0,
        totalTokens: 0,
        totalCost: 0,
        status: 'ERROR',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        durationMs: duration
      }
    });
  }
}

async function main() {
  console.log('🚀 GENERATE API USAGE FOR DASHBOARD\n');
  
  // Fetch API Keys
  const keys: any[] = await prisma.$queryRaw`
    SELECT id, provider, name, "keyHash", is_active
    FROM api_keys
    WHERE is_active = true
  `;
  
  if (keys.length === 0) {
    console.log('❌ Keine aktiven API Keys gefunden!');
    process.exit(1);
  }
  
  console.log(`✅ ${keys.length} API Keys gefunden\n`);
  
  for (const key of keys) {
    const decryptedKey = decrypt(key.keyHash);
    
    if (key.provider === 'ANTHROPIC') {
      await callAnthropicAPI(decryptedKey, key.id);
    } else if (key.provider === 'OPENAI') {
      await callOpenAIAPI(decryptedKey, key.id);
    }
    
    // Pause zwischen Calls
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ DONE - Usage Logs in DB geschrieben');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 DASHBOARD UPDATES:');
  console.log('   - Quick Stats (Heute): SOFORT sichtbar');
  console.log('   - Quick Stats (Monat): SOFORT sichtbar');
  console.log('   - API Keys Table: Calls & Costs SOFORT sichtbar');
  console.log('   - Recent Activity: Letzte 2 Calls SOFORT sichtbar');
  console.log('\n🔗 Prüfe jetzt: https://backoffice.liveyourdreams.online/admin/api-keys');
  
  await prisma.$disconnect();
}

main().catch(console.error);


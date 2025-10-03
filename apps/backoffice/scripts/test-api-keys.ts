import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

const ENCRYPTION_KEY = process.env.API_KEY_ENCRYPTION_SECRET || '7fa5fff1bbfea7f136743546fcd40e5d948ef55ebc13059417a3e4929364158b';

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

async function main() {
  console.log('🔍 Fetching API Keys via Raw SQL...\n');
  
  // Raw SQL Query - KORRIGIERTE COLUMN NAMES (snake_case)
  const keys: any[] = await prisma.$queryRaw`
    SELECT id, provider, name, "keyHash", is_active, created_at, last_used_at
    FROM "api_keys"
    WHERE is_active = true
  `;
  
  if (keys.length === 0) {
    console.log('❌ Keine aktiven API Keys gefunden!\n');
    process.exit(1);
  }
  
  console.log(`✅ ${keys.length} API Keys gefunden\n`);
  
  for (const key of keys) {
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`Provider: ${key.provider}`);
    console.log(`Name: ${key.name}`);
    console.log(`Status: ${key.is_active ? '✅ AKTIV' : '❌ INAKTIV'}`);
    console.log(`Erstellt: ${key.created_at.toISOString()}`);
    console.log(`Zuletzt genutzt: ${key.last_used_at ? key.last_used_at.toISOString() : 'Nie'}`);
    
    try {
      const decryptedKey = decrypt(key.keyHash);
      const masked = decryptedKey.slice(0, 7) + '...' + decryptedKey.slice(-4);
      console.log(`Key: ${masked}`);
      console.log(`\n🧪 Testing API Call...`);
      
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
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Test' }]
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ANTHROPIC KEY FUNKTIONIERT!`);
          console.log(`   Model: ${data.model}`);
          console.log(`   Tokens: ${data.usage.input_tokens} in / ${data.usage.output_tokens} out`);
        } else {
          const error = await response.text();
          console.log(`❌ FEHLER: ${response.status} ${response.statusText}`);
          console.log(`   ${error.substring(0, 200)}`);
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
            max_tokens: 10,
            messages: [{ role: 'user', content: 'Test' }]
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ OPENAI KEY FUNKTIONIERT!`);
          console.log(`   Model: ${data.model}`);
          console.log(`   Tokens: ${data.usage.prompt_tokens} in / ${data.usage.completion_tokens} out`);
        } else {
          const error = await response.text();
          console.log(`❌ FEHLER: ${response.status} ${response.statusText}`);
          console.log(`   ${error.substring(0, 200)}`);
        }
      }
    } catch (error: any) {
      console.log(`❌ FEHLER: ${error.message}`);
    }
    console.log();
  }
  
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

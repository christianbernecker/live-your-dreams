#!/usr/bin/env tsx

/**
 * Script zum Hinzufügen von API Keys in die Datenbank
 *
 * Usage:
 *   tsx scripts/add-api-key.ts <ANTHROPIC|OPENAI> <name> <api-key> [monthly-limit]
 *
 * Beispiele:
 *   tsx scripts/add-api-key.ts ANTHROPIC "Claude Sonnet 4.5 Production" "sk-ant-xxx" 100
 *   tsx scripts/add-api-key.ts OPENAI "GPT-4 Turbo Backup" "sk-xxx" 50
 */

import { PrismaClient } from '@prisma/client';
import { EncryptionService } from '../lib/encryption';

const prisma = new PrismaClient();

async function addApiKey() {
  const provider = process.argv[2] as 'ANTHROPIC' | 'OPENAI';
  const name = process.argv[3];
  const apiKey = process.argv[4];
  const monthlyLimit = process.argv[5] ? parseFloat(process.argv[5]) : null;

  // Validierung
  if (!provider || !name || !apiKey) {
    console.error('❌ Fehler: Ungültige Parameter');
    console.log('\nUsage:');
    console.log('  tsx scripts/add-api-key.ts <ANTHROPIC|OPENAI> <name> <api-key> [monthly-limit]');
    console.log('\nBeispiele:');
    console.log('  tsx scripts/add-api-key.ts ANTHROPIC "Claude Sonnet 4.5 Production" "sk-ant-xxx" 100');
    console.log('  tsx scripts/add-api-key.ts OPENAI "GPT-4 Turbo Backup" "sk-xxx" 50');
    process.exit(1);
  }

  if (!['ANTHROPIC', 'OPENAI'].includes(provider)) {
    console.error('❌ Fehler: Provider muss ANTHROPIC oder OPENAI sein');
    process.exit(1);
  }

  // API Key Format validieren
  if (provider === 'ANTHROPIC' && !apiKey.startsWith('sk-ant-')) {
    console.error('❌ Fehler: Anthropic Keys müssen mit "sk-ant-" beginnen');
    process.exit(1);
  }

  if (provider === 'OPENAI' && !apiKey.startsWith('sk-')) {
    console.error('❌ Fehler: OpenAI Keys müssen mit "sk-" beginnen');
    process.exit(1);
  }

  try {
    console.log('\n🔐 Verschlüssele API Key...');
    const encryptedKey = EncryptionService.encrypt(apiKey);

    console.log('💾 Speichere in Datenbank...');
    const key = await prisma.apiKey.create({
      data: {
        provider,
        name,
        keyHash: encryptedKey,
        monthlyLimit,
      },
    });

    console.log('\n✅ API Key erfolgreich hinzugefügt!\n');
    console.log('Details:');
    console.log(`  ID:       ${key.id}`);
    console.log(`  Provider: ${key.provider}`);
    console.log(`  Name:     ${key.name}`);
    console.log(`  Key:      ${EncryptionService.mask(apiKey)}`);
    console.log(`  Aktiv:    ${key.isActive ? 'Ja' : 'Nein'}`);
    if (key.monthlyLimit) {
      console.log(`  Limit:    €${key.monthlyLimit}/Monat`);
    }
    console.log(`  Erstellt: ${key.createdAt.toLocaleString('de-DE')}`);
    console.log('\n🎉 Der Key ist jetzt einsatzbereit!\n');
  } catch (error) {
    console.error('\n❌ Fehler beim Speichern:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run
addApiKey().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

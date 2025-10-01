#!/usr/bin/env node

/**
 * Test Script für Prisma MCP Server
 * Prüft Konfiguration und Datenbankverbindung
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testMCPServer() {
  console.log('🔍 Prisma MCP Server Test\n');
  
  // 1. Environment Check
  console.log('1️⃣ Environment Variables:');
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('   ❌ DATABASE_URL nicht gesetzt');
    console.log('   💡 Lösung: export DATABASE_URL="postgresql://..."');
    process.exit(1);
  }
  console.log('   ✓ DATABASE_URL vorhanden');
  
  // 2. Prisma Schema Validation
  console.log('\n2️⃣ Prisma Schema Validation:');
  try {
    const { stdout } = await execAsync(
      'cd ../../../apps/backoffice && npx prisma validate',
      { env: { ...process.env } }
    );
    console.log('   ✓ Schema valide');
  } catch (error) {
    console.error('   ❌ Schema invalid:', error.message);
    process.exit(1);
  }
  
  // 3. Database Connection Test
  console.log('\n3️⃣ Database Connection Test:');
  try {
    const { stdout } = await execAsync(
      'cd ../../../apps/backoffice && npx prisma db execute --stdin <<< "SELECT 1"',
      { env: { ...process.env } }
    );
    console.log('   ✓ Datenbankverbindung erfolgreich');
  } catch (error) {
    console.error('   ❌ Verbindung fehlgeschlagen:', error.message);
    process.exit(1);
  }
  
  // 4. Prisma Client Check
  console.log('\n4️⃣ Prisma Client Status:');
  try {
    await execAsync(
      'cd ../../../apps/backoffice && node -e "const { PrismaClient } = require(\'@prisma/client\'); console.log(\'Client loaded\')"',
      { env: { ...process.env } }
    );
    console.log('   ✓ Prisma Client generiert');
  } catch (error) {
    console.warn('   ⚠ Prisma Client fehlt - führe `prisma generate` aus');
  }
  
  // 5. MCP Server Dependencies
  console.log('\n5️⃣ MCP Server Dependencies:');
  try {
    await import('@modelcontextprotocol/sdk/server/index.js');
    console.log('   ✓ @modelcontextprotocol/sdk installiert');
  } catch (error) {
    console.error('   ❌ SDK fehlt:', error.message);
    process.exit(1);
  }
  
  console.log('\n✅ Alle Tests bestanden! MCP Server ist einsatzbereit.\n');
  console.log('📋 Nächste Schritte:');
  console.log('   1. Server starten: node ./tooling/mcp/prisma/index.mjs');
  console.log('   2. In Cursor: MCP Server sollte automatisch verfügbar sein');
  console.log('   3. Tools testen: prisma_generate, prisma_migrate_status, etc.\n');
}

testMCPServer().catch(error => {
  console.error('\n❌ Test fehlgeschlagen:', error);
  process.exit(1);
});


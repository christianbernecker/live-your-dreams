/**
 * Password Reset Script für Production Database
 * 
 * Setzt die Passwörter für Admin und Demo User zurück
 * Verwendung: node scripts/reset-passwords.mjs
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetPasswords() {
  console.log('🔧 Password Reset gestartet...\n');

  try {
    // 1. Admin User Password Reset
    console.log('1️⃣ Admin User wird aktualisiert...');
    const adminPassword = 'changeme123';
    const adminHash = await bcrypt.hash(adminPassword, 10);
    
    const adminUser = await prisma.user.update({
      where: { email: 'admin@liveyourdreams.online' },
      data: { 
        password: adminHash,
        isActive: true // Sicherstellen, dass User aktiv ist
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      }
    });

    console.log('✅ Admin User aktualisiert:');
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   Status: ${adminUser.isActive ? 'Aktiv' : 'Inaktiv'}\n`);

    // 2. Demo User Password Reset
    console.log('2️⃣ Demo User wird aktualisiert...');
    const demoPassword = 'demo123';
    const demoHash = await bcrypt.hash(demoPassword, 10);
    
    const demoUser = await prisma.user.update({
      where: { email: 'demo@liveyourdreams.online' },
      data: { 
        password: demoHash,
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
      }
    });

    console.log('✅ Demo User aktualisiert:');
    console.log(`   Email: ${demoUser.email}`);
    console.log(`   Name: ${demoUser.name}`);
    console.log(`   Password: ${demoPassword}`);
    console.log(`   Status: ${demoUser.isActive ? 'Aktiv' : 'Inaktiv'}\n`);

    // 3. Verification
    console.log('3️⃣ Passwörter werden verifiziert...');
    
    const adminVerify = await bcrypt.compare(adminPassword, adminHash);
    const demoVerify = await bcrypt.compare(demoPassword, demoHash);

    console.log(`   Admin Password: ${adminVerify ? '✅ Gültig' : '❌ Ungültig'}`);
    console.log(`   Demo Password: ${demoVerify ? '✅ Gültig' : '❌ Ungültig'}\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ PASSWORD RESET ERFOLGREICH ABGESCHLOSSEN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 LOGIN CREDENTIALS:');
    console.log('\n🔑 Admin Account:');
    console.log(`   URL: https://backoffice.liveyourdreams.online`);
    console.log(`   Email: admin@liveyourdreams.online`);
    console.log(`   Password: changeme123`);
    console.log('\n🔑 Demo Account:');
    console.log(`   URL: https://backoffice.liveyourdreams.online`);
    console.log(`   Email: demo@liveyourdreams.online`);
    console.log(`   Password: demo123`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Fehler beim Password Reset:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Script ausführen
resetPasswords();

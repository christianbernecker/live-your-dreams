const bcrypt = require('bcryptjs');

async function testPassword() {
  const plainPassword = 'changeme123';
  const hashedPassword = await bcrypt.hash(plainPassword, 12);
  
  console.log('🔐 PASSWORD TEST');
  console.log('════════════════════════════════════════════');
  console.log('Plain password:', plainPassword);
  console.log('Hashed password:', hashedPassword);
  console.log('');
  
  // Test verification
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  console.log('✅ Verification test:', isValid ? 'PASS' : 'FAIL');
  
  // Test with wrong password
  const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log('❌ Wrong password test:', isInvalid ? 'FAIL' : 'PASS');
  
  console.log('');
  console.log('📊 CHECKING DATABASE PASSWORDS...');
  console.log('════════════════════════════════════════════');
  
  // Connect to database and check
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    const users = await prisma.user.findMany({
      select: { email: true, password: true }
    });
    
    for (const user of users) {
      const canLogin = await bcrypt.compare('changeme123', user.password);
      const canLoginDemo = await bcrypt.compare('demo123', user.password);
      console.log(`User: ${user.email}`);
      console.log(`  Password hash: ${user.password.substring(0, 20)}...`);
      console.log(`  Can login with 'changeme123': ${canLogin}`);
      console.log(`  Can login with 'demo123': ${canLoginDemo}`);
    }
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPassword();


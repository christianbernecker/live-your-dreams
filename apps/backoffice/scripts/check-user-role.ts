import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking user roles...\n');

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true
    }
  });

  users.forEach(user => {
    console.log(`User: ${user.email}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Active: ${user.isActive}`);
    console.log(`  ID: ${user.id}\n`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('=== Checking Admin RBAC Setup ===\n');

  // 1. Check admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'admin@liveyourdreams.online' },
    select: { id: true, email: true, role: true, isActive: true }
  });

  console.log('1. Admin User:');
  console.log(adminUser);
  console.log();

  if (!adminUser) {
    console.log('❌ Admin user not found!');
    return;
  }

  // 2. Check admin role
  const adminRole = await prisma.role.findFirst({
    where: { name: 'admin' },
    select: { id: true, name: true, displayName: true, isActive: true }
  });

  console.log('2. Admin Role:');
  console.log(adminRole);
  console.log();

  if (!adminRole) {
    console.log('❌ Admin role not found!');
    return;
  }

  // 3. Check user-role assignment
  const userRoles = await prisma.userRole.findMany({
    where: { userId: adminUser.id },
    include: {
      role: {
        select: { id: true, name: true, displayName: true, isActive: true }
      }
    }
  });

  console.log('3. User Role Assignments:');
  console.log(JSON.stringify(userRoles, null, 2));
  console.log();

  if (userRoles.length === 0) {
    console.log('❌ No roles assigned to admin user!');
    console.log('\nFix needed: Run the following SQL:');
    console.log(`INSERT INTO user_roles (user_id, role_id) VALUES ('${adminUser.id}', '${adminRole.id}');`);
  } else {
    const hasAdminRole = userRoles.some(ur => ur.role.name === 'admin' && ur.role.isActive);
    if (hasAdminRole) {
      console.log('✅ Admin user correctly assigned to admin role!');
    } else {
      console.log('❌ Admin user has roles but not the admin role!');
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

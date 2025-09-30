/**
 * Prisma Seed Script
 * 
 * Sets up initial data for development and production
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { PERMISSION_INFO, ROLE_PRESETS } from '../lib/rbac';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // ============================================================================
  // 1. CREATE PERMISSIONS
  // ============================================================================
  
  console.log('📝 Creating permissions...');
  
  const permissionEntries = Object.values(PERMISSION_INFO);
  
  for (const permInfo of permissionEntries) {
    await prisma.permission.upsert({
      where: { name: permInfo.key },
      create: {
        name: permInfo.key,
        displayName: permInfo.displayName,
        description: permInfo.description,
        module: permInfo.module,
        action: permInfo.action
      },
    update: {
        displayName: permInfo.displayName,
        description: permInfo.description,
        module: permInfo.module,
        action: permInfo.action
      }
    });
  }
  
  console.log(`✅ Created/updated ${permissionEntries.length} permissions`);

  // ============================================================================
  // 2. CREATE ROLES WITH PERMISSIONS
  // ============================================================================
  
  console.log('🔐 Creating roles...');
  
  const roleColors = {
    admin: '#DC2626',      // Red
    editor: '#059669',     // Green  
    reviewer: '#7C3AED',   // Purple
    author: '#2563EB',     // Blue
    viewer: '#6B7280'      // Gray
  };
  
  for (const [roleName, permissionKeys] of Object.entries(ROLE_PRESETS)) {
    // Create role
    const role = await prisma.role.upsert({
      where: { name: roleName },
    create: {
        name: roleName,
        displayName: roleName.charAt(0).toUpperCase() + roleName.slice(1),
        description: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} role with predefined permissions`,
        color: roleColors[roleName as keyof typeof roleColors] || '#6B7280',
        isActive: true
      },
      update: {
        displayName: roleName.charAt(0).toUpperCase() + roleName.slice(1),
        description: `${roleName.charAt(0).toUpperCase() + roleName.slice(1)} role with predefined permissions`,
        color: roleColors[roleName as keyof typeof roleColors] || '#6B7280'
      }
    });

    // Get permissions for this role
    const permissions = await prisma.permission.findMany({
      where: { name: { in: permissionKeys } }
    });

    // Delete existing role permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id }
    });

    // Create role permissions
    await prisma.rolePermission.createMany({
      data: permissions.map(permission => ({
        roleId: role.id,
        permissionId: permission.id
      })),
      skipDuplicates: true
    });

    console.log(`✅ Created role: ${roleName} with ${permissions.length} permissions`);
  }

  // ============================================================================
  // 3. CREATE ADMIN USER
  // ============================================================================
  
  console.log('👤 Creating admin user...');
  
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' }
  });

  if (!adminRole) {
    throw new Error('Admin role not found - check role creation step');
  }

  // Hash admin password
  const hashedPassword = await bcrypt.hash('changeme123', 12);

  // Create or update admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@liveyourdreams.online' },
    create: {
      email: 'admin@liveyourdreams.online',
      name: 'System Administrator',
      firstName: 'System',
      lastName: 'Administrator',
      password: hashedPassword,
      isActive: true,
      isVerified: true,
      timezone: 'Europe/Berlin',
      locale: 'de'
    },
    update: {
      name: 'System Administrator',
      firstName: 'System',
      lastName: 'Administrator',
      password: hashedPassword,
      isActive: true,
      isVerified: true
    }
  });

  // Assign admin role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id
      }
    },
    create: {
      userId: adminUser.id,
      roleId: adminRole.id
    },
    update: {}
  });

  console.log('✅ Created admin user: admin@liveyourdreams.online');

  // ============================================================================
  // 4. CREATE DEMO USERS
  // ============================================================================
  
  console.log('👥 Creating demo users...');
  
  const demoUsers = [
    {
      email: 'editor@liveyourdreams.online',
      name: 'Content Editor',
      firstName: 'Content',
      lastName: 'Editor',
      role: 'editor'
    },
    {
      email: 'reviewer@liveyourdreams.online', 
      name: 'Content Reviewer',
      firstName: 'Content',
      lastName: 'Reviewer',
      role: 'reviewer'
    },
    {
      email: 'author@liveyourdreams.online',
      name: 'Content Author',
      firstName: 'Content', 
      lastName: 'Author',
      role: 'author'
    },
    {
      email: 'viewer@liveyourdreams.online',
      name: 'Content Viewer',
      firstName: 'Content',
      lastName: 'Viewer', 
      role: 'viewer'
    }
  ];

  for (const userData of demoUsers) {
    const role = await prisma.role.findUnique({
      where: { name: userData.role }
    });

    if (!role) {
      console.warn(`Role ${userData.role} not found, skipping user ${userData.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash('demo123', 12);

    const user = await prisma.user.upsert({
      where: { email: userData.email },
      create: {
        email: userData.email,
        name: userData.name,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPassword,
        isActive: true,
        isVerified: true,
        timezone: 'Europe/Berlin',
        locale: 'de'
      },
      update: {
        name: userData.name,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isActive: true,
        isVerified: true
      }
    });

    // Assign role
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id
        }
      },
      create: {
        userId: user.id,
        roleId: role.id
      },
      update: {}
    });

    console.log(`✅ Created demo user: ${userData.email} (${userData.role})`);
  }

  // ============================================================================
  // 5. CREATE CONTENT TYPES
  // ============================================================================
  
  console.log('📝 Creating content types...');
  
  const contentTypes = [
    {
      key: 'product',
      name: 'Produkt',
      description: 'Immobilien-Produkte und Angebote',
      fields: {
        description: { type: 'textarea', label: 'Beschreibung', required: true },
        price: { type: 'number', label: 'Preis (€)', required: true },
        location: { type: 'text', label: 'Standort', required: true },
        size: { type: 'number', label: 'Größe (m²)', required: false },
        rooms: { type: 'number', label: 'Zimmer', required: false },
        features: { type: 'textarea', label: 'Ausstattung', required: false },
        images: { type: 'media[]', label: 'Bilder', required: false }
      }
    },
    {
      key: 'service',
      name: 'Dienstleistung',
      description: 'Services und Beratungsleistungen',
      fields: {
        description: { type: 'textarea', label: 'Beschreibung', required: true },
        duration: { type: 'text', label: 'Dauer', required: false },
        price: { type: 'number', label: 'Preis (€)', required: false },
        benefits: { type: 'textarea', label: 'Vorteile', required: false }
      }
    },
    {
      key: 'testimonial',
      name: 'Kundenstimme',
      description: 'Kundenbewertungen und Testimonials',
      fields: {
        customerName: { type: 'text', label: 'Kundenname', required: true },
        customerTitle: { type: 'text', label: 'Position/Titel', required: false },
        quote: { type: 'textarea', label: 'Zitat', required: true },
        rating: { type: 'number', label: 'Bewertung (1-5)', required: false },
        image: { type: 'media', label: 'Kundenfoto', required: false }
      }
    }
  ];

  for (const typeData of contentTypes) {
    await prisma.contentType.upsert({
      where: { key: typeData.key },
      create: {
        key: typeData.key,
        name: typeData.name,
        description: typeData.description,
        fields: typeData.fields,
        isActive: true
      },
      update: {
        name: typeData.name,
        description: typeData.description,
        fields: typeData.fields
      }
    });

    console.log(`✅ Created content type: ${typeData.name}`);
  }

  // ============================================================================
  // SUMMARY
  // ============================================================================
  
  const stats = {
    permissions: await prisma.permission.count(),
    roles: await prisma.role.count(),
    users: await prisma.user.count(),
    contentTypes: await prisma.contentType.count()
  };

  console.log('\n🎉 Database seed completed!');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(`📊 Created: ${stats.permissions} permissions, ${stats.roles} roles, ${stats.users} users, ${stats.contentTypes} content types`);
  console.log('\n🔑 Login credentials:');
  console.log('   Admin:    admin@liveyourdreams.online / changeme123');
  console.log('   Editor:   editor@liveyourdreams.online / demo123');
  console.log('   Reviewer: reviewer@liveyourdreams.online / demo123');
  console.log('   Author:   author@liveyourdreams.online / demo123');
  console.log('   Viewer:   viewer@liveyourdreams.online / demo123');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });


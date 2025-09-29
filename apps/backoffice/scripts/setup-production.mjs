#!/usr/bin/env node

/**
 * PRODUCTION DATABASE SETUP SCRIPT
 * 
 * Creates admin users, roles, and permissions for production deployment
 * Run this once after database schema is pushed
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const DATABASE_URL = 'postgresql://neondb_owner:npg_hz8vgpX6UOBw@ep-divine-dust-abhyp415.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
})

async function setupProduction() {
  try {
    console.log('🚀 Setting up production database...')
    
    // 1. Create Roles
    console.log('📋 Creating roles...')
    const roles = await Promise.all([
      prisma.role.upsert({
        where: { name: 'admin' },
        create: {
          id: 'role_admin',
          name: 'admin',
          displayName: 'Administrator',
          description: 'System Administrator with full access',
          color: '#ef4444',
          isActive: true
        },
        update: {
          displayName: 'Administrator',
          description: 'System Administrator with full access',
          color: '#ef4444',
          isActive: true
        }
      }),
      prisma.role.upsert({
        where: { name: 'editor' },
        create: {
          id: 'role_editor',
          name: 'editor',
          displayName: 'Editor',
          description: 'Content Editor with write access',
          color: '#3b82f6',
          isActive: true
        },
        update: {
          displayName: 'Editor',
          description: 'Content Editor with write access',
          color: '#3b82f6',
          isActive: true
        }
      })
    ])
    console.log(`✅ Created ${roles.length} roles`)

    // 2. Create Permissions
    console.log('🔐 Creating permissions...')
    const permissions = await Promise.all([
      prisma.permission.upsert({
        where: { name: 'users.read' },
        create: {
          id: 'perm_users_read',
          name: 'users.read',
          displayName: 'Read Users',
          description: 'View user list and details',
          category: 'users'
        },
        update: {
          displayName: 'Read Users',
          description: 'View user list and details',
          category: 'users'
        }
      }),
      prisma.permission.upsert({
        where: { name: 'users.write' },
        create: {
          id: 'perm_users_write', 
          name: 'users.write',
          displayName: 'Write Users',
          description: 'Create and edit users',
          category: 'users'
        },
        update: {
          displayName: 'Write Users',
          description: 'Create and edit users',
          category: 'users'
        }
      }),
      prisma.permission.upsert({
        where: { name: 'users.delete' },
        create: {
          id: 'perm_users_delete',
          name: 'users.delete',
          displayName: 'Delete Users',
          description: 'Delete users',
          category: 'users'
        },
        update: {
          displayName: 'Delete Users',
          description: 'Delete users',
          category: 'users'
        }
      })
    ])
    console.log(`✅ Created ${permissions.length} permissions`)

    // 3. Create Admin User
    console.log('👤 Creating admin user...')
    const adminPasswordHash = await bcrypt.hash('changeme123', 12)
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@liveyourdreams.online' },
      create: {
        id: 'admin_001',
        email: 'admin@liveyourdreams.online',
        password: adminPasswordHash,
        name: 'System Administrator',
        firstName: 'System',
        lastName: 'Administrator',
        isActive: true,
        isVerified: true,
        emailVerified: new Date()
      },
      update: {
        password: adminPasswordHash,
        isActive: true,
        isVerified: true,
        emailVerified: new Date()
      }
    })
    console.log(`✅ Admin user: ${adminUser.email}`)

    // 4. Create Demo User  
    console.log('👤 Creating demo user...')
    const demoPasswordHash = await bcrypt.hash('demo123', 12)
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@liveyourdreams.online' },
      create: {
        id: 'demo_001',
        email: 'demo@liveyourdreams.online',
        password: demoPasswordHash,
        name: 'Demo User',
        firstName: 'Demo',
        lastName: 'User',
        isActive: true,
        isVerified: true,
        emailVerified: new Date()
      },
      update: {
        password: demoPasswordHash,
        isActive: true,
        isVerified: true,
        emailVerified: new Date()
      }
    })
    console.log(`✅ Demo user: ${demoUser.email}`)

    // 5. Assign Admin Role to Admin User
    console.log('🔗 Assigning roles...')
    await prisma.userRole.upsert({
      where: { 
        userId_roleId: {
          userId: adminUser.id,
          roleId: roles[0].id
        }
      },
      create: {
        userId: adminUser.id,
        roleId: roles[0].id,
        assignedBy: 'system'
      },
      update: {
        assignedBy: 'system'
      }
    })

    // 6. Assign Editor Role to Demo User
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: demoUser.id,
          roleId: roles[1].id
        }
      },
      create: {
        userId: demoUser.id,
        roleId: roles[1].id,
        assignedBy: 'system'
      },
      update: {
        assignedBy: 'system'
      }
    })
    console.log('✅ User roles assigned')

    // 7. Assign Permissions to Admin Role
    console.log('🔐 Assigning permissions...')
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: roles[0].id,
            permissionId: permission.id
          }
        },
        create: {
          roleId: roles[0].id,
          permissionId: permission.id
        },
        update: {}
      })
    }
    console.log('✅ Admin permissions assigned')

    // 8. Verification
    console.log('🔍 Verifying setup...')
    const userCount = await prisma.user.count()
    const roleCount = await prisma.role.count()
    const permissionCount = await prisma.permission.count()
    
    console.log(`
🎉 PRODUCTION SETUP COMPLETE!

📊 Database Status:
   Users: ${userCount}
   Roles: ${roleCount}  
   Permissions: ${permissionCount}

🔑 Login Credentials:
   Admin: admin@liveyourdreams.online / changeme123
   Demo:  demo@liveyourdreams.online / demo123

🚀 Next Steps:
   1. Deploy to Vercel with DATABASE_URL set
   2. Test login at /admin/users
   3. Change admin password in production
`)

  } catch (error) {
    console.error('❌ Error setting up production:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupProduction()

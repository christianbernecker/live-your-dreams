import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting PostgreSQL database seed...')

  try {
    // Create roles
    console.log('📝 Creating roles...')
    const adminRole = await prisma.role.create({
      data: {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Full access to all features and settings.',
        color: '#dc2626', // Red
      },
    })

    const editorRole = await prisma.role.create({
      data: {
        name: 'editor',
        displayName: 'Editor',
        description: 'Can create and manage content but has limited access to settings.',
        color: '#2563eb', // Blue
      },
    })

    const viewerRole = await prisma.role.create({
      data: {
        name: 'viewer',
        displayName: 'Viewer',
        description: 'Read-only access to most content.',
        color: '#16a34a', // Green
      },
    })

    // Create permissions
    console.log('🛡️ Creating permissions...')
    const permissions = [
      // User Management
      { name: 'users:create', displayName: 'Create Users', description: 'Create new user accounts', category: 'User Management' },
      { name: 'users:read', displayName: 'View Users', description: 'View user accounts and profiles', category: 'User Management' },
      { name: 'users:update', displayName: 'Edit Users', description: 'Edit user accounts and profiles', category: 'User Management' },
      { name: 'users:delete', displayName: 'Delete Users', description: 'Delete user accounts', category: 'User Management' },
      
      // Role Management
      { name: 'roles:create', displayName: 'Create Roles', description: 'Create new roles', category: 'Role Management' },
      { name: 'roles:read', displayName: 'View Roles', description: 'View roles and permissions', category: 'Role Management' },
      { name: 'roles:update', displayName: 'Edit Roles', description: 'Edit roles and assign permissions', category: 'Role Management' },
      { name: 'roles:delete', displayName: 'Delete Roles', description: 'Delete roles', category: 'Role Management' },
      
      // Content Management
      { name: 'posts:create', displayName: 'Create Posts', description: 'Create new blog posts', category: 'Content Management' },
      { name: 'posts:read', displayName: 'View Posts', description: 'View blog posts', category: 'Content Management' },
      { name: 'posts:update', displayName: 'Edit Posts', description: 'Edit blog posts', category: 'Content Management' },
      { name: 'posts:delete', displayName: 'Delete Posts', description: 'Delete blog posts', category: 'Content Management' },
      { name: 'posts:publish', displayName: 'Publish Posts', description: 'Publish and unpublish posts', category: 'Content Management' },
      
      // Media Management
      { name: 'media:create', displayName: 'Upload Media', description: 'Upload images and files', category: 'Media Management' },
      { name: 'media:read', displayName: 'View Media', description: 'View media library', category: 'Media Management' },
      { name: 'media:update', displayName: 'Edit Media', description: 'Edit media metadata', category: 'Media Management' },
      { name: 'media:delete', displayName: 'Delete Media', description: 'Delete media files', category: 'Media Management' },
      
      // Settings
      { name: 'settings:read', displayName: 'View Settings', description: 'View system settings', category: 'Settings' },
      { name: 'settings:update', displayName: 'Update Settings', description: 'Update system settings', category: 'Settings' },
    ]

    const createdPermissions = await Promise.all(
      permissions.map(permission => 
        prisma.permission.create({ data: permission })
      )
    )

    // Assign permissions to roles
    console.log('🔗 Assigning permissions to roles...')
    
    // Admin gets all permissions
    await Promise.all(
      createdPermissions.map(permission =>
        prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        })
      )
    )

    // Editor gets content and media permissions
    const editorPermissions = createdPermissions.filter(p => 
      p.category === 'Content Management' || 
      p.category === 'Media Management' || 
      (p.category === 'Settings' && p.name === 'settings:read')
    )
    
    await Promise.all(
      editorPermissions.map(permission =>
        prisma.rolePermission.create({
          data: {
            roleId: editorRole.id,
            permissionId: permission.id,
          },
        })
      )
    )

    // Viewer gets read permissions only
    const viewerPermissions = createdPermissions.filter(p => 
      p.name.includes(':read')
    )
    
    await Promise.all(
      viewerPermissions.map(permission =>
        prisma.rolePermission.create({
          data: {
            roleId: viewerRole.id,
            permissionId: permission.id,
          },
        })
      )
    )

    // Create admin user with admin123 password
    console.log('👤 Creating admin user...')
    const hashedPassword = await bcrypt.hash('admin123', 12)
    
    const adminUser = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email: 'admin@liveyourdreams.online',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        isActive: true,
        isVerified: true,
        role: 'admin', // Legacy field
      },
    })

    // Assign admin role to admin user
    await prisma.userRole.create({
      data: {
        userId: adminUser.id,
        roleId: adminRole.id,
        assignedBy: adminUser.id,
      },
    })

    // Create categories
    console.log('📂 Creating categories...')
    const categories = [
      { name: 'Immobilien', slug: 'immobilien', description: 'Artikel über Immobilien und Investitionen', color: '#3b82f6' },
      { name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle und persönliche Entwicklung', color: '#10b981' },
      { name: 'Business', slug: 'business', description: 'Business und Unternehmertum', color: '#f59e0b' },
      { name: 'Technologie', slug: 'technologie', description: 'Technologie und Innovation', color: '#8b5cf6' },
    ]

    await Promise.all(
      categories.map(category =>
        prisma.category.create({ data: category })
      )
    )

    // Create tags
    console.log('🏷️ Creating tags...')
    const tags = [
      { name: 'Investment', slug: 'investment' },
      { name: 'Marketing', slug: 'marketing' },
      { name: 'SEO', slug: 'seo' },
      { name: 'Design', slug: 'design' },
      { name: 'Development', slug: 'development' },
      { name: 'Analytics', slug: 'analytics' },
    ]

    await Promise.all(
      tags.map(tag =>
        prisma.tag.create({ data: tag })
      )
    )

    console.log('✅ PostgreSQL database seeded successfully!')
    console.log('')
    console.log('🔐 LOGIN CREDENTIALS:')
    console.log('────────────────────────')
    console.log('Email: admin@liveyourdreams.online')
    console.log('Password: admin123')
    console.log('')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

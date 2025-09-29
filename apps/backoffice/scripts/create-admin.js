const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  console.log('🚀 Creating admin user...')
  
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('changeme123', 12)
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        id: 'admin_001',
        email: 'admin@liveyourdreams.online',
        password: hashedPassword,
        name: 'System Administrator',
        role: 'admin',
        isActive: true,
        isVerified: true,
      }
    })
    
    console.log('✅ Admin user created:', admin.email)
    
    // Create demo user  
    const demoPassword = await bcrypt.hash('demo123', 12)
    const demo = await prisma.user.create({
      data: {
        id: 'demo_001',
        email: 'demo@liveyourdreams.online',
        password: demoPassword,
        name: 'Demo User',
        role: 'user',
        isActive: true,
        isVerified: true,
      }
    })
    
    console.log('✅ Demo user created:', demo.email)
    
    // Create categories
    const categories = await prisma.category.createMany({
      data: [
        { id: 'cat_001', name: 'Immobilien', slug: 'immobilien', description: 'Artikel über Immobilien und Investments' },
        { id: 'cat_002', name: 'Lifestyle', slug: 'lifestyle', description: 'Lifestyle und Luxus Content' },
        { id: 'cat_003', name: 'Marktanalyse', slug: 'marktanalyse', description: 'Marktanalysen und Trends' },
      ],
      skipDuplicates: true
    })
    
    console.log('✅ Categories created:', categories.count)
    
    // Create tags
    const tags = await prisma.tag.createMany({
      data: [
        { id: 'tag_001', name: 'Investment', slug: 'investment' },
        { id: 'tag_002', name: 'Luxury', slug: 'luxury' },
        { id: 'tag_003', name: 'Dubai', slug: 'dubai' },
        { id: 'tag_004', name: 'München', slug: 'muenchen' },
      ],
      skipDuplicates: true
    })
    
    console.log('✅ Tags created:', tags.count)
    
    console.log('\n🎉 DATABASE SETUP COMPLETE!')
    console.log('\n📝 Login Credentials:')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('Admin: admin@liveyourdreams.online / changeme123')
    console.log('Demo:  demo@liveyourdreams.online / demo123')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    
  } catch (error) {
    if (error.code === 'P2002') {
      console.log('⚠️  Users already exist, skipping...')
    } else {
      console.error('Error:', error)
    }
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()


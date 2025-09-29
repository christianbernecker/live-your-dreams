import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count()
    
    // Test specific users
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@liveyourdreams.online' }
    })
    
    const demoUser = await prisma.user.findUnique({
      where: { email: 'demo@liveyourdreams.online' }
    })
    
    // Test password verification
    let adminPasswordValid = false
    let demoPasswordValid = false
    
    if (adminUser?.password) {
      adminPasswordValid = await bcrypt.compare('changeme123', adminUser.password)
    }
    
    if (demoUser?.password) {
      demoPasswordValid = await bcrypt.compare('demo123', demoUser.password)
    }
    
    return NextResponse.json({
      status: 'ok',
      environment: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      },
      database: {
        connected: true,
        userCount,
        adminExists: !!adminUser,
        demoExists: !!demoUser,
        adminPasswordValid,
        demoPasswordValid
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: (error as any).message,
      environment: {
        hasDatabase: !!process.env.DATABASE_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}


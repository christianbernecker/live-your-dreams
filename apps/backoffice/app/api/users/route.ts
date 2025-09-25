import { auth } from '@/lib/nextauth'
import { NextRequest, NextResponse } from 'next/server'

async function getUsersHandler(request: NextRequest, context: any): Promise<NextResponse> {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.includes('users.read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Initialize Prisma Client for server-side usage
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Map database fields to API response - simplified
      const mappedUsers = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        firstName: null,
        lastName: null,
        role: user.role,
        isActive: true,
        createdAt: user.createdAt?.toISOString(),
        lastLoginAt: null
      }))

      await prisma.$disconnect()
      
      return NextResponse.json(mappedUsers)
    } catch (error) {
      await prisma.$disconnect()
      throw error
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

async function createUserHandler(request: NextRequest, context: any): Promise<NextResponse> {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.includes('users.create')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // Basic validation (Zod will be added later)
    const { email, firstName, lastName, role, password } = body

    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json({ 
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields',
        details: { requiredFields: ['email', 'firstName', 'lastName', 'role', 'password'] }
      }, { status: 422 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'VALIDATION_ERROR',
        message: 'Invalid email address'
      }, { status: 422 })
    }

    // Password validation
    if (password.length < 8) {
      return NextResponse.json({ 
        error: 'VALIDATION_ERROR',
        message: 'Password must be at least 8 characters long'
      }, { status: 422 })
    }

    // Initialize Prisma Client and bcrypt
    const { PrismaClient } = await import('@prisma/client')
    const bcrypt = await import('bcryptjs')
    const prisma = new PrismaClient()

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user - simplified approach
      const newUser = await prisma.user.create({
        data: {
          email,
          role,
          password: hashedPassword,
          name: firstName && lastName ? `${firstName} ${lastName}` : firstName || email.split('@')[0]
        }
      })

      // Map response to match expected format
      const responseUser = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        firstName: firstName,
        lastName: lastName,
        role: newUser.role,
        isActive: true,
        createdAt: newUser.createdAt?.toISOString(),
        lastLoginAt: null
      }

      await prisma.$disconnect()
      
      return NextResponse.json(responseUser, { status: 201 })
    } catch (error) {
      await prisma.$disconnect()
      throw error
    }
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ 
      error: 'INTERNAL_ERROR',
      message: 'An error occurred while creating user',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

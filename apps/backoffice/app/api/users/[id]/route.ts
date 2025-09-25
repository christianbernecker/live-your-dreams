import { auth } from '@/lib/nextauth'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.includes('users.update')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = params.id
    const body = await request.json()

    // Initialize Prisma Client
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    try {
      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...body,
          updatedAt: new Date()
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      })

      await prisma.$disconnect()
      
      return NextResponse.json(updatedUser)
    } catch (error) {
      await prisma.$disconnect()
      throw error
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!session.user.permissions.includes('users.delete')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const userId = params.id

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete own account' }, { status: 400 })
    }

    // Initialize Prisma Client
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()

    try {
      // Delete user
      await prisma.user.delete({
        where: { id: userId }
      })

      await prisma.$disconnect()
      
      return NextResponse.json({ success: true })
    } catch (error) {
      await prisma.$disconnect()
      throw error
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

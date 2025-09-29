import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { PrismaClient } from '@prisma/client'
// import { auth } from '@/lib/auth' // Disabled for deployment

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  // TEMPORARILY DISABLED - Media model not available in current build
  // TODO: Re-enable after Production Database URL is configured
  return NextResponse.json(
    { error: 'Media upload temporarily disabled - Production database setup required' },
    { status: 503 }
  )
}

// Get media files
export async function GET() {
  // TEMPORARILY DISABLED - Media model not available in current build
  // TODO: Re-enable after Production Database URL is configured
  return NextResponse.json(
    { error: 'Media fetch temporarily disabled - Production database setup required' },
    { status: 503 }
  )
}

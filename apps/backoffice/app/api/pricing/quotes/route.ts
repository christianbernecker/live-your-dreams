import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { PricingCalculation } from '@/lib/pricing/calculator';

// Validation schema for quote creation
const CreateQuoteSchema = z.object({
  basePackage: z.object({
    tier: z.enum(['BASIC', 'PREMIUM', 'ENTERPRISE']),
    name: z.string(),
    price: z.number().min(0),
    features: z.array(z.string())
  }),
  modules: z.array(z.object({
    module: z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      category: z.enum(['MEDIA', 'LEGAL', 'MARKETING', 'SERVICE', 'TECHNICAL']),
      basePrice: z.number().min(0),
      icon: z.string(),
      estimatedDeliveryDays: z.number().min(0)
    }),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    totalPrice: z.number().min(0),
    notes: z.string().optional()
  })),
  adjustments: z.array(z.object({
    type: z.enum(['PROPERTY_TYPE', 'REGION', 'SIZE', 'VOLUME', 'LUXURY', 'DISCOUNT']),
    factor: z.number().min(0),
    amount: z.number(),
    description: z.string()
  })),
  subtotal: z.number().min(0),
  totalAdjustments: z.number(),
  tax: z.number().min(0),
  total: z.number().min(0),
  currency: z.literal('EUR'),
  validUntil: z.string().transform(str => new Date(str)),
  estimatedDelivery: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    unit: z.literal('days')
  })
});

/**
 * Pricing Quotes API
 * 
 * POST /api/pricing/quotes
 * Creates a new pricing quote
 * 
 * GET /api/pricing/quotes
 * Retrieves user's pricing quotes with pagination
 */

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const quoteData = CreateQuoteSchema.parse(body);

    // Generate quote number
    const quoteNumber = `LYD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Save quote to database
    const savedQuote = await prisma.$executeRaw`
      INSERT INTO quotes (
        id,
        quote_number,
        user_id,
        tier,
        quote_data,
        subtotal,
        tax,
        total,
        currency,
        valid_until,
        estimated_delivery_min,
        estimated_delivery_max,
        status,
        created_at,
        updated_at
      ) VALUES (
        gen_random_uuid(),
        ${quoteNumber},
        ${user.id},
        ${quoteData.basePackage.tier},
        ${JSON.stringify(quoteData)},
        ${quoteData.subtotal},
        ${quoteData.tax},
        ${quoteData.total},
        ${quoteData.currency},
        ${quoteData.validUntil},
        ${quoteData.estimatedDelivery.min},
        ${quoteData.estimatedDelivery.max},
        'DRAFT',
        NOW(),
        NOW()
      )
    `;

    return NextResponse.json({
      success: true,
      quoteNumber,
      message: 'Quote successfully created',
      quote: {
        ...quoteData,
        id: quoteNumber,
        status: 'DRAFT',
        createdAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Quote Creation Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const status = searchParams.get('status');
    const tier = searchParams.get('tier');
    const search = searchParams.get('search');

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = [`user_id = $1`];
    let queryParams: any[] = [user.id];
    let paramIndex = 2;

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (tier) {
      whereConditions.push(`tier = $${paramIndex}`);
      queryParams.push(tier);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(quote_number ILIKE $${paramIndex} OR quote_data::text ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM quotes 
      ${whereClause}
    `;
    
    const countResult = await prisma.$queryRawUnsafe(countQuery, ...queryParams);
    const total = parseInt((countResult as any)[0].count);

    // Get quotes
    const quotesQuery = `
      SELECT 
        quote_number,
        tier,
        subtotal,
        tax,
        total,
        currency,
        valid_until,
        estimated_delivery_min,
        estimated_delivery_max,
        status,
        created_at,
        updated_at,
        quote_data
      FROM quotes 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    queryParams.push(limit, offset);
    const quotes = await prisma.$queryRawUnsafe(quotesQuery, ...queryParams);

    return NextResponse.json({
      quotes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Quotes Retrieval Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Create quotes table if it doesn't exist
 * This would typically be done via a Prisma migration
 */
async function ensureQuotesTable() {
  try {
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS quotes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        quote_number VARCHAR(50) UNIQUE NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        tier VARCHAR(20) NOT NULL,
        quote_data JSONB NOT NULL,
        subtotal INTEGER NOT NULL,
        tax INTEGER NOT NULL,
        total INTEGER NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'EUR',
        valid_until TIMESTAMP,
        estimated_delivery_min INTEGER,
        estimated_delivery_max INTEGER,
        status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
        
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_quotes_user_id ON quotes(user_id);
      CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
      CREATE INDEX IF NOT EXISTS idx_quotes_tier ON quotes(tier);
      CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
    `;
  } catch (error) {
    console.error('Error creating quotes table:', error);
  }
}

// Ensure table exists on startup
ensureQuotesTable();

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CreatePropertySchema } from '@/lib/validations/property';
import { handle, ApiError } from '@/lib/api/error-handler';
import { ratelimitAuth } from '@/lib/api/rate-limit';

// GET /api/properties - List properties
export const GET = handle(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
  const status = searchParams.get('status');
  const city = searchParams.get('city');
  
  const where = {
    ...(status && { status: status as any }),
    ...(city && { city: { contains: city, mode: 'insensitive' as const } }),
  };
  
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { leads: true, media: true } }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.property.count({ where })
  ]);
  
  return NextResponse.json({
    properties,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// POST /api/properties - Create property
export const POST = handle(async (req: NextRequest) => {
  // Rate limiting for authenticated users
  const userId = req.headers.get('x-user-id') || 'anonymous';
  const { success } = await ratelimitAuth.limit(userId);
  if (!success) throw new ApiError(429, 'Too many requests');
  
  const json = await req.json();
  const validation = CreatePropertySchema.safeParse(json);
  
  if (!validation.success) {
    throw new ApiError(400, 'Invalid property data', validation.error.format());
  }
  
  const data = validation.data;
  
  // Convert price from Euro to cents
  const priceInCents = Math.round(data.price * 100);
  
  const property = await prisma.property.create({
    data: {
      ...data,
      price: priceInCents,
      createdBy: userId, // TODO: Get from auth session
      slug: `${data.city.toLowerCase()}-${Date.now()}` // TODO: Better slug generation
    },
    include: {
      user: { select: { name: true, email: true } }
    }
  });
  
  return NextResponse.json(property, { status: 201 });
});

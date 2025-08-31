import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { ratelimitIp } from '@/lib/api/rate-limit';
import { ApiError, handle } from '@/lib/api/error-handler';
import { redact } from '@/lib/log/redact';

const LeadSchema = z.object({
  propertyId: z.string().min(8),
  email: z.string().email(),
  phone: z.string().optional(),
  name: z.string().optional(),
  message: z.string().max(4000).optional(),
  source: z.string().default('MICROSITE'),
  gdprConsent: z.boolean().refine(val => val === true, 'DSGVO-Einwilligung erforderlich'),
});

// GET /api/leads - List leads
export const GET = handle(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
  const status = searchParams.get('status');
  const propertyId = searchParams.get('propertyId');
  
  const where = {
    ...(status && { status: status as any }),
    ...(propertyId && { propertyId }),
  };
  
  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: {
        property: { 
          select: { 
            title: true, 
            city: true, 
            postcode: true 
          } 
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where })
  ]);
  
  return NextResponse.json({
    leads,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

// POST /api/leads - Create lead (from microsite)
export const POST = handle(async (req: NextRequest) => {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
  const { success } = await ratelimitIp.limit(ip);
  if (!success) throw new ApiError(429, 'Too many requests');
  
  const json = await req.json();
  const validation = LeadSchema.safeParse(json);
  
  if (!validation.success) {
    throw new ApiError(400, 'Invalid lead data', validation.error.format());
  }
  
  const { propertyId, email, phone, name, message, source, gdprConsent } = validation.data;
  
  // Check if property exists
  const property = await prisma.property.findUnique({
    where: { id: propertyId }
  });
  
  if (!property) {
    throw new ApiError(404, 'Property not found');
  }
  
  // Create lead
  const lead = await prisma.lead.create({
    data: {
      propertyId,
      email,
      phone,
      name,
      message,
      source: source as any,
      gdprConsent,
      gdprConsentAt: gdprConsent ? new Date() : null,
      audit: { ip }
    },
    include: {
      property: { 
        select: { 
          title: true, 
          city: true, 
          postcode: true 
        } 
      }
    }
  });
  
  // Send notification email (mock for now)
  try {
    if (process.env.SMTP_HOST) {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 1025),
      });
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@liveyourdreams.local',
        to: process.env.SALES_MAIL || 'sales@liveyourdreams.local',
        subject: `Neuer Lead: ${property.city} ${property.postcode}`,
        text: JSON.stringify(redact({ propertyId, email, phone, name, message, ip }), null, 2)
      });
    }
  } catch (error) {
    console.error('Email notification failed:', error);
  }
  
  return NextResponse.json(lead, { status: 201 });
});

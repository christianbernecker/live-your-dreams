import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { 
  energyCertificateSchema,
  energyCertificatePublishSchema 
} from '@/lib/validations/energy-certificate';
import { rateLimit } from '@/lib/api/rate-limit';

/**
 * GET /api/properties/[id]/energy-certificate
 * 
 * Ruft die Energieausweis-Daten einer Immobilie ab
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate Limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Property ID validieren
    const propertyId = z.string().cuid().parse(params.id);

    // Energieausweis-Daten abrufen
    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        createdBy: session.user.id
      },
      select: {
        id: true,
        title: true,
        // Energieausweis-Felder
        energyType: true,
        energyValue: true,
        energyClass: true,
        energyCarrier: true,
        energyCertType: true,
        energyCertIssueYear: true,
        energyCertValidUntil: true,
        heatingConsumption: true,
        hotWaterConsumption: true,
        consumptionYears: true,
        // Metadaten
        status: true,
        published: true,
        updatedAt: true
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Vollständigkeitsstatus berechnen
    const isComplete = energyCertificatePublishSchema.safeParse({
      energyType: property.energyType,
      energyValue: property.energyValue,
      energyClass: property.energyClass,
      energyCarrier: property.energyCarrier,
      energyCertType: property.energyCertType,
      energyCertIssueYear: property.energyCertIssueYear,
      energyCertValidUntil: property.energyCertValidUntil,
      heatingConsumption: property.heatingConsumption,
      hotWaterConsumption: property.hotWaterConsumption,
      consumptionYears: property.consumptionYears,
    }).success;

    return NextResponse.json({
      ...property,
      isComplete,
      canPublish: isComplete && property.energyCertValidUntil && 
                 property.energyCertValidUntil > new Date()
    });

  } catch (error) {
    console.error('GET /api/properties/[id]/energy-certificate error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid property ID', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/properties/[id]/energy-certificate
 * 
 * Aktualisiert die Energieausweis-Daten einer Immobilie
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate Limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Property ID und Request Body validieren
    const propertyId = z.string().cuid().parse(params.id);
    const body = await request.json();
    
    // Query Parameter für Validierungsmodus
    const { searchParams } = new URL(request.url);
    const validateForPublish = searchParams.get('validateForPublish') === 'true';
    
    // Energieausweis-Daten validieren
    const validationSchema = validateForPublish 
      ? energyCertificatePublishSchema 
      : energyCertificateSchema;
      
    const validatedData = validationSchema.parse(body);

    // Property existiert und gehört User?
    const existingProperty = await db.property.findFirst({
      where: {
        id: propertyId,
        createdBy: session.user.id
      },
      select: { id: true, title: true, status: true }
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Energieausweis-Daten aktualisieren
    const updatedProperty = await db.property.update({
      where: { id: propertyId },
      data: {
        energyType: validatedData.energyType,
        energyValue: validatedData.energyValue,
        energyClass: validatedData.energyClass,
        energyCarrier: validatedData.energyCarrier,
        energyCertType: validatedData.energyCertType,
        energyCertIssueYear: validatedData.energyCertIssueYear,
        energyCertValidUntil: validatedData.energyCertValidUntil,
        heatingConsumption: validatedData.heatingConsumption,
        hotWaterConsumption: validatedData.hotWaterConsumption,
        consumptionYears: validatedData.consumptionYears,
        updatedAt: new Date()
      },
      select: {
        id: true,
        title: true,
        energyType: true,
        energyValue: true,
        energyClass: true,
        energyCarrier: true,
        energyCertType: true,
        energyCertIssueYear: true,
        energyCertValidUntil: true,
        heatingConsumption: true,
        hotWaterConsumption: true,
        consumptionYears: true,
        status: true,
        updatedAt: true
      }
    });

    // Erfolgs-Response
    return NextResponse.json({
      message: 'Energieausweis erfolgreich aktualisiert',
      property: updatedProperty,
      isComplete: validateForPublish, // Wenn Publish-Validierung erfolgreich war
      canPublish: validateForPublish && validatedData.energyCertValidUntil > new Date()
    });

  } catch (error) {
    console.error('PUT /api/properties/[id]/energy-certificate error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validierung fehlgeschlagen', 
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
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

/**
 * POST /api/properties/[id]/energy-certificate/validate
 * 
 * Validiert Energieausweis-Daten für Veröffentlichung (ohne Speichern)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate Limiting
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Authentifizierung prüfen
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Publish-Validierung durchführen
    const validationResult = energyCertificatePublishSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json({
        valid: false,
        errors: validationResult.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message
        })),
        canPublish: false
      });
    }
    
    // Zusätzliche Gültigkeitsprüfung
    const canPublish = validationResult.data.energyCertValidUntil > new Date();
    
    return NextResponse.json({
      valid: true,
      errors: [],
      canPublish,
      message: canPublish 
        ? 'Energieausweis ist vollständig und gültig für Veröffentlichung'
        : 'Energieausweis ist vollständig, aber abgelaufen'
    });

  } catch (error) {
    console.error('POST /api/properties/[id]/energy-certificate/validate error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

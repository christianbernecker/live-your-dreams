import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { rateLimit } from '@/lib/api/rate-limit';

/**
 * Export Request Schema
 */
const exportRequestSchema = z.object({
  format: z.enum(['json', 'csv']).default('json'),
  includeMedia: z.boolean().default(false)
});

/**
 * POST /api/gdpr/export
 * 
 * DSGVO Art. 15 - Recht auf Auskunft
 * Exportiert alle personenbezogenen Daten des Users
 */
export async function POST(request: NextRequest) {
  try {
    // Strenge Rate Limiting für GDPR Requests
    const rateLimitResult = await rateLimit(request, { max: 3, window: 3600 }); // 3 per hour
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Zu viele Export-Anfragen. Bitte warten Sie eine Stunde.' },
        { status: 429 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { format, includeMedia } = exportRequestSchema.parse(body);

    // Alle User-Daten sammeln
    const userData = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        properties: {
          include: {
            media: includeMedia,
            rooms: true,
            leads: {
              select: {
                id: true,
                email: true,
                name: true,
                message: true,
                source: true,
                status: true,
                createdAt: true,
                gdprConsent: true,
                gdprConsentAt: true
              }
            },
            listings: true
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json(
        { error: 'User nicht gefunden' },
        { status: 404 }
      );
    }

    // GDPR-konforme Datenstruktur
    const gdprExport = {
      exportInfo: {
        requestedAt: new Date().toISOString(),
        requestedBy: session.user.email,
        format: format,
        includeMedia: includeMedia,
        legalBasis: 'DSGVO Art. 15 - Recht auf Auskunft',
        processingPurpose: 'Immobilienvermittlung und Kundenbetreuung'
      },
      
      // Persönliche Daten (Art. 4 Nr. 1 DSGVO)
      personalData: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        avatar: userData.avatar,
        role: userData.role,
        totpEnabled: userData.totpEnabled,
        lastLoginAt: userData.lastLoginAt,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      },
      
      // Immobiliendaten
      properties: userData.properties.map(property => ({
        id: property.id,
        title: property.title,
        description: property.description,
        type: property.type,
        status: property.status,
        city: property.city,
        postcode: property.postcode,
        address: property.address,
        price: property.price,
        livingArea: property.livingArea,
        totalArea: property.totalArea,
        roomCount: property.roomCount,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        buildYear: property.buildYear,
        
        // Energieausweis-Daten
        energyType: property.energyType,
        energyValue: property.energyValue,
        energyClass: property.energyClass,
        energyCarrier: property.energyCarrier,
        energyCertType: property.energyCertType,
        energyCertIssueYear: property.energyCertIssueYear,
        energyCertValidUntil: property.energyCertValidUntil,
        
        published: property.published,
        publishedAt: property.publishedAt,
        slug: property.slug,
        micrositeUrl: property.micrositeUrl,
        createdAt: property.createdAt,
        updatedAt: property.updatedAt,
        
        // Räume
        rooms: property.rooms.map(room => ({
          id: room.id,
          name: room.name,
          type: room.type,
          area: room.area,
          description: room.description,
          createdAt: room.createdAt,
          updatedAt: room.updatedAt
        })),
        
        // Medien (nur wenn explizit angefragt)
        ...(includeMedia && {
          media: property.media.map(media => ({
            id: media.id,
            filename: media.filename,
            originalName: media.originalName,
            mimeType: media.mimeType,
            size: media.size,
            s3Key: media.s3Key,
            s3Bucket: media.s3Bucket,
            cdnUrl: media.cdnUrl,
            width: media.width,
            height: media.height,
            alt: media.alt,
            caption: media.caption,
            processed: media.processed,
            createdAt: media.createdAt,
            updatedAt: media.updatedAt
          }))
        }),
        
        // Interessenten-Daten (anonymisiert wenn kein Consent)
        leads: property.leads.map(lead => ({
          id: lead.id,
          email: lead.gdprConsent ? lead.email : '[ANONYMISIERT]',
          name: lead.gdprConsent ? lead.name : '[ANONYMISIERT]',
          message: lead.gdprConsent ? lead.message : '[ANONYMISIERT]',
          source: lead.source,
          status: lead.status,
          createdAt: lead.createdAt,
          gdprConsent: lead.gdprConsent,
          gdprConsentAt: lead.gdprConsentAt
        })),
        
        // Portal-Listings
        listings: property.listings.map(listing => ({
          id: listing.id,
          platform: listing.platform,
          externalId: listing.externalId,
          status: listing.status,
          publishedAt: listing.publishedAt,
          lastSyncAt: listing.lastSyncAt,
          syncError: listing.syncError,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt
        }))
      })),
      
      // Verarbeitungsprotokoll
      processingRecord: {
        purposes: [
          'Immobilienvermittlung',
          'Kundenbetreuung', 
          'Lead-Management',
          'Marketing (mit Einverständnis)',
          'Vertragsabwicklung'
        ],
        legalBases: [
          'Art. 6 Abs. 1 lit. a DSGVO - Einwilligung',
          'Art. 6 Abs. 1 lit. b DSGVO - Vertragserfüllung',
          'Art. 6 Abs. 1 lit. f DSGVO - Berechtigte Interessen'
        ],
        categories: [
          'Kontaktdaten',
          'Immobiliendaten',
          'Nutzungsdaten',
          'Kommunikationsdaten'
        ],
        retentionPeriod: '3 Jahre nach Vertragsende bzw. letzter Aktivität',
        recipients: [
          'ImmobilienScout24 (bei Veröffentlichung)',
          'AWS (Hosting)',
          'Nodemailer (E-Mail-Versand)'
        ]
      },
      
      // Rechte des Betroffenen
      rights: {
        'art15': 'Recht auf Auskunft (diese Funktion)',
        'art16': 'Recht auf Berichtigung - verfügbar in den Kontoeinstellungen',
        'art17': 'Recht auf Löschung - verfügbar über Support oder API',
        'art18': 'Recht auf Einschränkung der Verarbeitung - verfügbar über Support',
        'art20': 'Recht auf Datenübertragbarkeit - diese Funktion',
        'art21': 'Widerspruchsrecht - verfügbar über Support',
        'art77': 'Beschwerderecht bei Aufsichtsbehörde - BayLDA'
      }
    };

    // CSV Export (vereinfacht)
    if (format === 'csv') {
      const csvData = [
        // Header
        [
          'Typ', 'ID', 'Feld', 'Wert', 'Erstellt', 'Aktualisiert'
        ],
        
        // Persönliche Daten
        ['User', userData.id, 'E-Mail', userData.email, userData.createdAt, userData.updatedAt],
        ['User', userData.id, 'Name', userData.name || '', userData.createdAt, userData.updatedAt],
        ['User', userData.id, 'Rolle', userData.role, userData.createdAt, userData.updatedAt],
        
        // Properties
        ...userData.properties.flatMap(property => [
          ['Property', property.id, 'Titel', property.title, property.createdAt, property.updatedAt],
          ['Property', property.id, 'Stadt', property.city, property.createdAt, property.updatedAt],
          ['Property', property.id, 'Preis', property.price.toString(), property.createdAt, property.updatedAt],
          ['Property', property.id, 'Status', property.status, property.createdAt, property.updatedAt]
        ])
      ];
      
      const csvContent = csvData.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      ).join('\n');
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="gdpr-export-${session.user.id}-${Date.now()}.csv"`
        }
      });
    }

    // JSON Export (Standard)
    return NextResponse.json(gdprExport, {
      headers: {
        'Content-Disposition': `attachment; filename="gdpr-export-${session.user.id}-${Date.now()}.json"`
      }
    });

  } catch (error) {
    console.error('GDPR export error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Parameter', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Datenexports' },
      { status: 500 }
    );
  }
}

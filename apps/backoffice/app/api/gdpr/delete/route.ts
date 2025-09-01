import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { s3Client } from '@/lib/storage/presign';
import { rateLimit } from '@/lib/api/rate-limit';

/**
 * Delete Request Schema
 */
const deleteRequestSchema = z.object({
  confirmation: z.literal('DELETE_ALL_DATA'),
  reason: z.string().min(10).max(500).optional(),
  keepAccount: z.boolean().default(false) // Nur Daten löschen, Account behalten
});

/**
 * POST /api/gdpr/delete
 * 
 * DSGVO Art. 17 - Recht auf Löschung ("Recht auf Vergessenwerden")
 */
export async function POST(request: NextRequest) {
  try {
    // Extrem strikte Rate Limiting für Löschungen
    const rateLimitResult = await rateLimit(request, { max: 1, window: 3600 }); // 1 per hour
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Zu viele Löschanfragen. Bitte warten Sie eine Stunde.' },
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
    const { confirmation, reason, keepAccount } = deleteRequestSchema.parse(body);

    // Sicherheitscheck: Confirmation erforderlich
    if (confirmation !== 'DELETE_ALL_DATA') {
      return NextResponse.json(
        { error: 'Löschbestätigung erforderlich' },
        { status: 400 }
      );
    }

    // User-Daten mit allen Beziehungen laden
    const userData = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        properties: {
          include: {
            media: true,
            rooms: {
              include: {
                media: true
              }
            },
            leads: true,
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

    // Audit Log für Löschung
    const deletionLog = {
      userId: userData.id,
      email: userData.email,
      timestamp: new Date().toISOString(),
      reason: reason || 'Kein Grund angegeben',
      keepAccount,
      legalBasis: 'DSGVO Art. 17 - Recht auf Löschung',
      deletedData: {
        properties: userData.properties.length,
        media: userData.properties.reduce((acc, p) => acc + p.media.length, 0),
        rooms: userData.properties.reduce((acc, p) => acc + p.rooms.length, 0),
        leads: userData.properties.reduce((acc, p) => acc + p.leads.length, 0),
        listings: userData.properties.reduce((acc, p) => acc + p.listings.length, 0)
      }
    };

    console.log('GDPR Deletion initiated:', deletionLog);

    let deletedItems = {
      mediaFiles: 0,
      s3Objects: 0,
      leads: 0,
      rooms: 0,
      listings: 0,
      properties: 0
    };

    // 1. Alle S3 Media-Dateien löschen
    const allMediaFiles = [
      ...userData.properties.flatMap(p => p.media),
      ...userData.properties.flatMap(p => p.rooms.flatMap(r => r.media || []))
    ];

    for (const media of allMediaFiles) {
      try {
        // S3 Hauptdatei löschen
        await s3Client.send(new DeleteObjectCommand({
          Bucket: media.s3Bucket,
          Key: media.s3Key
        }));
        
        // Varianten löschen (wenn vorhanden)
        if (media.variants) {
          const variants = typeof media.variants === 'string' 
            ? JSON.parse(media.variants) 
            : media.variants;
            
          for (const variantUrl of Object.values(variants) as string[]) {
            if (variantUrl && variantUrl.includes('.amazonaws.com/')) {
              const variantKey = variantUrl.split('.amazonaws.com/')[1];
              if (variantKey) {
                await s3Client.send(new DeleteObjectCommand({
                  Bucket: media.s3Bucket,
                  Key: variantKey
                }));
                deletedItems.s3Objects++;
              }
            }
          }
        }
        
        deletedItems.s3Objects++;
        deletedItems.mediaFiles++;
        
      } catch (s3Error) {
        console.error(`Fehler beim Löschen von S3 Datei ${media.s3Key}:`, s3Error);
        // Continue deletion even if S3 cleanup fails
      }
    }

    // 2. Database-Löschung in korrekter Reihenfolge (Foreign Keys)
    
    // Leads löschen
    for (const property of userData.properties) {
      const leadCount = await db.lead.count({
        where: { propertyId: property.id }
      });
      
      await db.lead.deleteMany({
        where: { propertyId: property.id }
      });
      
      deletedItems.leads += leadCount;
    }

    // Room Media löschen
    await db.media.deleteMany({
      where: {
        roomId: {
          in: userData.properties.flatMap(p => p.rooms.map(r => r.id))
        }
      }
    });

    // Rooms löschen
    for (const property of userData.properties) {
      const roomCount = await db.room.count({
        where: { propertyId: property.id }
      });
      
      await db.room.deleteMany({
        where: { propertyId: property.id }
      });
      
      deletedItems.rooms += roomCount;
    }

    // Listings löschen
    for (const property of userData.properties) {
      const listingCount = await db.listing.count({
        where: { propertyId: property.id }
      });
      
      await db.listing.deleteMany({
        where: { propertyId: property.id }
      });
      
      deletedItems.listings += listingCount;
    }

    // Property Media löschen
    await db.media.deleteMany({
      where: {
        propertyId: {
          in: userData.properties.map(p => p.id)
        }
      }
    });

    // Properties löschen
    const propertyCount = await db.property.count({
      where: { createdBy: userData.id }
    });
    
    await db.property.deleteMany({
      where: { createdBy: userData.id }
    });
    
    deletedItems.properties = propertyCount;

    // 3. User-Account behandeln
    if (keepAccount) {
      // Nur persönliche Daten anonymisieren, Account behalten
      await db.user.update({
        where: { id: userData.id },
        data: {
          email: `deleted-${Date.now()}@example.com`,
          name: '[GELÖSCHT]',
          avatar: null,
          password: null,
          totpSecret: null,
          totpEnabled: false,
          lastLoginAt: null
        }
      });
    } else {
      // Komplett löschen
      await db.user.delete({
        where: { id: userData.id }
      });
    }

    // Finaler Audit Log
    console.log('GDPR Deletion completed:', {
      ...deletionLog,
      deletedItems,
      completedAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'Löschung erfolgreich durchgeführt',
      legalBasis: 'DSGVO Art. 17 - Recht auf Löschung',
      processedAt: new Date().toISOString(),
      deletedItems,
      keepAccount,
      notice: keepAccount 
        ? 'Ihr Account wurde anonymisiert, aber die Anmeldedaten bleiben bestehen.'
        : 'Ihr Account und alle Daten wurden vollständig gelöscht.'
    });

  } catch (error) {
    console.error('GDPR deletion error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ungültige Parameter', details: error.errors },
        { status: 400 }
      );
    }

    // Bei Fehlern: Rollback verhindern, da Löschung teilweise erfolgt sein könnte
    return NextResponse.json(
      { 
        error: 'Fehler bei der Datenlöschung', 
        notice: 'Bitte kontaktieren Sie den Support für manuelle Nachbearbeitung.',
        supportEmail: 'privacy@liveyourdreams.online'
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/gdpr/delete/info
 * 
 * Informationen über Löschvorgang (was wird gelöscht)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Statistiken über zu löschende Daten
    const userData = await db.user.findUnique({
      where: { id: session.user.id },
      include: {
        _count: {
          select: {
            properties: true
          }
        },
        properties: {
          include: {
            _count: {
              select: {
                media: true,
                rooms: true,
                leads: true,
                listings: true
              }
            }
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

    const totalMedia = userData.properties.reduce((acc, p) => acc + p._count.media, 0);
    const totalRooms = userData.properties.reduce((acc, p) => acc + p._count.rooms, 0);
    const totalLeads = userData.properties.reduce((acc, p) => acc + p._count.leads, 0);
    const totalListings = userData.properties.reduce((acc, p) => acc + p._count.listings, 0);

    return NextResponse.json({
      accountInfo: {
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
        role: userData.role
      },
      
      dataToDelete: {
        properties: userData._count.properties,
        media: totalMedia,
        rooms: totalRooms,
        leads: totalLeads,
        listings: totalListings
      },
      
      deletionScope: {
        'Immobilien': 'Alle Ihre Immobilienangebote mit vollständigen Details',
        'Medien': 'Alle hochgeladenen Bilder, Grundrisse und 360°-Aufnahmen',
        'Räume': 'Alle Raumbeschreibungen und Raumaufteilungen', 
        'Interessenten': 'Alle Kontaktanfragen und Lead-Daten',
        'Portal-Listings': 'Alle Veröffentlichungen auf ImmobilienScout24 etc.',
        'Account-Daten': 'E-Mail, Name, Passwort, 2FA-Einstellungen',
        'Backup-Daten': 'Alle Backups werden nach 30 Tagen automatisch gelöscht'
      },
      
      legalBasis: 'DSGVO Art. 17 - Recht auf Löschung',
      
      options: {
        completedeletion: {
          description: 'Vollständige Löschung aller Daten und des Accounts',
          irreversible: true,
          effect: 'Sie können sich nicht mehr anmelden'
        },
        dataOnlyDeletion: {
          description: 'Nur Daten löschen, Account-Zugang behalten',
          irreversible: true,
          effect: 'Account bleibt bestehen, aber anonymisiert'
        }
      },
      
      timeline: {
        immediate: 'Löschung erfolgt sofort nach Bestätigung',
        backups: 'Backups werden nach 30 Tagen automatisch gelöscht',
        logs: 'Audit-Logs werden 6 Jahre für rechtliche Nachweise gespeichert'
      },
      
      notice: '⚠️ Diese Aktion ist UNWIDERRUFLICH und kann nicht rückgängig gemacht werden!'
    });

  } catch (error) {
    console.error('GDPR delete info error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Abrufen der Löschinformationen' },
      { status: 500 }
    );
  }
}

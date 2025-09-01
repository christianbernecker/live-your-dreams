import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { s3Client } from '@/lib/storage/presign';
import { rateLimit } from '@/lib/api/rate-limit';
import {
  validateUploadedFile,
  processImageVariants,
  extractImageMetadata,
  is360Image,
  generateSmartThumbnail,
  stripPersonalMetadata,
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_360_TYPES,
  SUPPORTED_FLOORPLAN_TYPES
} from '@/lib/media/image-processing';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES_PER_PROPERTY = 100;

/**
 * Media Upload Schema
 */
const mediaUploadSchema = z.object({
  files: z.array(z.object({
    filename: z.string().min(1).max(255),
    mimeType: z.string(),
    size: z.number().positive().max(MAX_FILE_SIZE),
    type: z.enum(['image', '360', 'floorplan', 'document']),
    roomId: z.string().cuid().optional()
  })).min(1).max(20) // Max 20 Files pro Request
});

/**
 * GET /api/properties/[id]/media
 * 
 * Ruft alle Medien einer Immobilie ab
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

    // Authentifizierung
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const propertyId = z.string().cuid().parse(params.id);

    // Property Berechtigung prüfen
    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        createdBy: session.user.id
      },
      select: { id: true, title: true }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Query Parameters
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const type = searchParams.get('type') as 'image' | '360' | 'floorplan' | 'document' | null;

    // Medien abrufen
    const media = await db.media.findMany({
      where: {
        propertyId,
        ...(roomId && { roomId }),
        ...(type && { 
          // Media Type wird als Tag im filename oder metadata gespeichert
          OR: [
            { filename: { contains: `_${type}_` } },
            { caption: { contains: type } }
          ]
        })
      },
      include: {
        room: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    // URLs generieren (falls CDN nicht verfügbar)
    const mediaWithUrls = media.map(item => ({
      ...item,
      url: item.cdnUrl || `https://${item.s3Bucket}.s3.eu-central-1.amazonaws.com/${item.s3Key}`,
      thumbnailUrl: item.variants?.['thumbnail'] || item.cdnUrl,
      type: detectMediaTypeFromFilename(item.filename)
    }));

    return NextResponse.json({
      media: mediaWithUrls,
      total: media.length,
      property: {
        id: property.id,
        title: property.title
      }
    });

  } catch (error) {
    console.error('GET /api/properties/[id]/media error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
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
 * POST /api/properties/[id]/media
 * 
 * Lädt neue Medien für eine Immobilie hoch
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate Limiting (strenger für Upload)
    const rateLimitResult = await rateLimit(request, { max: 10, window: 300 }); // 10 Requests per 5min
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Try again in a few minutes.' },
        { status: 429 }
      );
    }

    // Authentifizierung
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const propertyId = z.string().cuid().parse(params.id);

    // Property Berechtigung prüfen
    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        createdBy: session.user.id
      },
      select: { 
        id: true, 
        title: true,
        _count: { select: { media: true } }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Limits prüfen
    if (property._count.media >= MAX_FILES_PER_PROPERTY) {
      return NextResponse.json(
        { error: `Maximum ${MAX_FILES_PER_PROPERTY} Dateien pro Immobilie erreicht` },
        { status: 400 }
      );
    }

    // FormData parsen
    const formData = await request.formData();
    const files: File[] = [];
    
    // Alle Files sammeln
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file') && value instanceof File) {
        files.push(value);
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    // Room ID (optional)
    const roomId = formData.get('roomId') as string | null;

    const uploadResults: Array<{
      success: boolean;
      filename: string;
      mediaId?: string;
      error?: string;
      type?: string;
      s3Key?: string;
      cdnUrl?: string;
    }> = [];

    // Jede Datei verarbeiten
    for (const file of files) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Validierung
        const validation = await validateUploadedFile(
          buffer,
          file.name,
          MAX_FILE_SIZE,
          [...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_360_TYPES, ...SUPPORTED_FLOORPLAN_TYPES]
        );

        if (!validation.isValid) {
          uploadResults.push({
            success: false,
            filename: file.name,
            error: validation.error
          });
          continue;
        }

        // Media Type Detection
        let detectedType: 'image' | '360' | 'floorplan' | 'document' = 'image';
        let processedBuffer = buffer;

        if (validation.mimeType?.startsWith('image/')) {
          // EXIF-Daten entfernen (Datenschutz)
          processedBuffer = await stripPersonalMetadata(buffer);
          
          // Metadata extrahieren
          const metadata = await extractImageMetadata(processedBuffer);
          
          // 360° Detection
          if (is360Image(metadata)) {
            detectedType = '360';
          }
          // Floorplan Detection (große Bilder mit hohem Aspect Ratio)
          else if (metadata.width > 2000 && (metadata.width / metadata.height) > 1.2) {
            detectedType = 'floorplan';
          }
        } else if (validation.mimeType === 'application/pdf') {
          detectedType = 'document';
        }

        // S3 Key generieren
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'bin';
        const s3Key = `properties/${propertyId}/media/${detectedType}_${timestamp}_${randomId}.${fileExtension}`;

        // S3 Upload
        const uploadCommand = new PutObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: s3Key,
          Body: processedBuffer,
          ContentType: validation.mimeType,
          Metadata: {
            propertyId,
            userId: session.user.id,
            originalName: file.name,
            mediaType: detectedType,
            ...(roomId && { roomId })
          }
        });

        await s3Client.send(uploadCommand);

        // Image Processing (nur für Bilder)
        let variants = null;
        let thumbnailBuffer: Buffer | null = null;

        if (detectedType !== 'document' && validation.mimeType?.startsWith('image/')) {
          try {
            // Thumbnail generieren
            thumbnailBuffer = await generateSmartThumbnail(processedBuffer, 300, 200, 85);
            
            // Varianten für responsive Anzeige
            const processedImage = await processImageVariants(processedBuffer, {
              formats: ['jpeg', 'webp'],
              stripMetadata: true,
              preserveOrientation: true
            });

            variants = {
              thumbnail: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/properties/${propertyId}/media/thumb_${timestamp}_${randomId}.jpg`,
              medium: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/properties/${propertyId}/media/med_${timestamp}_${randomId}.jpg`,
              large: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/properties/${propertyId}/media/lg_${timestamp}_${randomId}.jpg`
            };

            // Thumbnail zu S3 uploaden
            if (thumbnailBuffer) {
              const thumbKey = `properties/${propertyId}/media/thumb_${timestamp}_${randomId}.jpg`;
              await s3Client.send(new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: thumbKey,
                Body: thumbnailBuffer,
                ContentType: 'image/jpeg'
              }));
            }

            // Medium & Large Varianten uploaden
            for (const [variantName, variantData] of Object.entries(processedImage.variants)) {
              const variantKey = `properties/${propertyId}/media/${variantName.slice(0, 3)}_${timestamp}_${randomId}.jpg`;
              await s3Client.send(new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME!,
                Key: variantKey,
                Body: variantData.buffer,
                ContentType: 'image/jpeg'
              }));
            }

          } catch (processingError) {
            console.error('Image processing error:', processingError);
            // Continue without variants
          }
        }

        // Metadata extrahieren
        let width: number | undefined;
        let height: number | undefined;

        if (validation.mimeType?.startsWith('image/')) {
          const imageMetadata = await extractImageMetadata(processedBuffer);
          width = imageMetadata.width;
          height = imageMetadata.height;
        }

        // Database Record erstellen
        const mediaRecord = await db.media.create({
          data: {
            filename: `${detectedType}_${timestamp}_${randomId}.${fileExtension}`,
            originalName: file.name,
            mimeType: validation.mimeType!,
            size: processedBuffer.length,
            s3Key,
            s3Bucket: process.env.AWS_S3_BUCKET_NAME!,
            cdnUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.eu-central-1.amazonaws.com/${s3Key}`,
            width,
            height,
            variants: variants ? JSON.parse(JSON.stringify(variants)) : null,
            processed: true,
            propertyId,
            roomId: roomId || null,
          }
        });

        uploadResults.push({
          success: true,
          filename: file.name,
          mediaId: mediaRecord.id,
          type: detectedType,
          s3Key,
          cdnUrl: mediaRecord.cdnUrl!
        });

      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        uploadResults.push({
          success: false,
          filename: file.name,
          error: error instanceof Error ? error.message : 'Upload failed'
        });
      }
    }

    // Erfolgs-Summary
    const successful = uploadResults.filter(r => r.success);
    const failed = uploadResults.filter(r => !r.success);

    return NextResponse.json({
      message: `${successful.length} von ${files.length} Dateien erfolgreich hochgeladen`,
      results: uploadResults,
      summary: {
        total: files.length,
        successful: successful.length,
        failed: failed.length
      }
    }, { status: successful.length > 0 ? 200 : 400 });

  } catch (error) {
    console.error('POST /api/properties/[id]/media error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/properties/[id]/media/[mediaId]
 * 
 * Löscht ein Media-Element
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const propertyId = z.string().cuid().parse(params.id);
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('mediaId');

    if (!mediaId) {
      return NextResponse.json(
        { error: 'Media ID required' },
        { status: 400 }
      );
    }

    // Media und Property Berechtigung prüfen
    const media = await db.media.findFirst({
      where: {
        id: mediaId,
        propertyId,
        property: {
          createdBy: session.user.id
        }
      }
    });

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // S3 Cleanup
    try {
      await s3Client.send(new DeleteObjectCommand({
        Bucket: media.s3Bucket,
        Key: media.s3Key
      }));

      // Varianten auch löschen
      if (media.variants) {
        const variants = typeof media.variants === 'string' 
          ? JSON.parse(media.variants) 
          : media.variants;
          
        for (const variantUrl of Object.values(variants) as string[]) {
          if (variantUrl) {
            const variantKey = variantUrl.split('.amazonaws.com/')[1];
            if (variantKey) {
              await s3Client.send(new DeleteObjectCommand({
                Bucket: media.s3Bucket,
                Key: variantKey
              }));
            }
          }
        }
      }
    } catch (s3Error) {
      console.error('S3 cleanup error:', s3Error);
      // Continue with database deletion even if S3 cleanup fails
    }

    // Database Record löschen
    await db.media.delete({
      where: { id: mediaId }
    });

    return NextResponse.json({
      message: 'Media erfolgreich gelöscht',
      mediaId
    });

  } catch (error) {
    console.error('DELETE /api/properties/[id]/media error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper: Media Type aus Filename ermitteln
 */
function detectMediaTypeFromFilename(filename: string): 'image' | '360' | 'floorplan' | 'document' {
  if (filename.includes('_360_')) return '360';
  if (filename.includes('_floorplan_')) return 'floorplan';
  if (filename.includes('.pdf')) return 'document';
  return 'image';
}

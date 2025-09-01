import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { IS24Client } from '@/lib/integrations/is24-client';
import { rateLimit } from '@/lib/api/rate-limit';

/**
 * Publish Request Schema
 */
const publishSchema = z.object({
  propertyId: z.string().cuid(),
  forceUpdate: z.boolean().default(false)
});

/**
 * POST /api/integrations/is24/publish
 * 
 * Published Property to ImmobilienScout24
 */
export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
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
    const { propertyId, forceUpdate } = publishSchema.parse(body);

    // Get property with all required data
    const property = await db.property.findFirst({
      where: {
        id: propertyId,
        createdBy: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
            // TODO: Add IS24 token fields
            // is24AccessToken: true,
            // is24RefreshToken: true,
            // is24TokenExpiresAt: true
          }
        },
        media: {
          where: { processed: true },
          orderBy: { createdAt: 'asc' },
          take: 20 // IS24 limit
        },
        listings: {
          where: { platform: 'IMMOSCOUT24' }
        }
      }
    });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if property is ready for publishing
    const missingFields = [];
    if (!property.energyType) missingFields.push('Energietyp');
    if (!property.energyValue) missingFields.push('Energiekennwert');
    if (!property.energyClass) missingFields.push('Effizienzklasse');
    if (!property.livingArea) missingFields.push('Wohnfläche');
    if (!property.roomCount) missingFields.push('Zimmeranzahl');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: 'Property incomplete for publishing',
          missingFields
        },
        { status: 400 }
      );
    }

    // Check IS24 connection
    // TODO: In production, get tokens from user record
    /*
    if (!property.user.is24AccessToken) {
      return NextResponse.json(
        { error: 'IS24 not connected. Please connect your ImmobilienScout24 account first.' },
        { status: 400 }
      );
    }
    */

    // For demo: Use environment variables or mock
    const mockAccessToken = process.env.IS24_DEMO_ACCESS_TOKEN || 'demo_token';
    const mockRefreshToken = process.env.IS24_DEMO_REFRESH_TOKEN || 'demo_refresh';

    // Create IS24 client
    const is24Client = new IS24Client(mockAccessToken, mockRefreshToken);

    try {
      // Check if already published
      const existingListing = property.listings.find(l => l.platform === 'IMMOSCOUT24');
      
      let is24PropertyId: string;
      let isUpdate = false;

      if (existingListing && existingListing.externalId && !forceUpdate) {
        return NextResponse.json(
          { 
            error: 'Property already published to IS24',
            externalId: existingListing.externalId,
            publishedAt: existingListing.publishedAt
          },
          { status: 409 }
        );
      } else if (existingListing && existingListing.externalId) {
        // Update existing property
        is24PropertyId = existingListing.externalId;
        isUpdate = true;
        
        await is24Client.updateProperty(is24PropertyId, {
          title: property.title,
          price: property.price,
          livingArea: property.livingArea,
          roomCount: property.roomCount,
          city: property.city,
          postcode: property.postcode,
          address: property.address,
          energyType: property.energyType,
          energyValue: property.energyValue,
          energyClass: property.energyClass,
          energyCarrier: property.energyCarrier,
          agentName: property.user.name,
          agentEmail: property.user.email
        });

      } else {
        // Create new property
        const result = await is24Client.publishProperty({
          title: property.title,
          price: property.price,
          livingArea: property.livingArea,
          roomCount: property.roomCount,
          city: property.city,
          postcode: property.postcode,
          address: property.address,
          energyType: property.energyType,
          energyValue: property.energyValue,
          energyClass: property.energyClass,
          energyCarrier: property.energyCarrier,
          agentName: property.user.name,
          agentEmail: property.user.email
        });
        
        is24PropertyId = result.id;
        isUpdate = false;
      }

      // Upload images (if any)
      if (property.media.length > 0) {
        const imagePromises = property.media.slice(0, 10).map(async (media) => {
          try {
            // Download image from CDN
            const imageResponse = await fetch(media.cdnUrl!);
            if (imageResponse.ok) {
              const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
              return {
                title: media.caption || media.originalName,
                imageData: imageBuffer
              };
            }
          } catch (err) {
            console.error(`Failed to download image ${media.id}:`, err);
          }
          return null;
        });

        const images = (await Promise.all(imagePromises)).filter(Boolean) as Array<{ title: string; imageData: Buffer }>;
        
        if (images.length > 0) {
          await is24Client.uploadPropertyImages(is24PropertyId, images);
        }
      }

      // Update or create listing record
      const listingData = {
        platform: 'IMMOSCOUT24' as const,
        externalId: is24PropertyId,
        status: 'PUBLISHED' as const,
        lastSyncAt: new Date(),
        publishedAt: new Date(),
        syncError: null,
        propertyId: property.id
      };

      if (existingListing) {
        await db.listing.update({
          where: { id: existingListing.id },
          data: listingData
        });
      } else {
        await db.listing.create({
          data: listingData
        });
      }

      // Update property publish status
      await db.property.update({
        where: { id: property.id },
        data: {
          published: true,
          publishedAt: new Date()
        }
      });

      return NextResponse.json({
        message: isUpdate ? 'Property updated on IS24 successfully' : 'Property published to IS24 successfully',
        externalId: is24PropertyId,
        isUpdate,
        imagesUploaded: property.media.length,
        publishedAt: new Date().toISOString()
      });

    } catch (is24Error) {
      console.error('IS24 API error:', is24Error);
      
      // Update listing with error
      const existingListing = property.listings.find(l => l.platform === 'IMMOSCOUT24');
      if (existingListing) {
        await db.listing.update({
          where: { id: existingListing.id },
          data: {
            status: 'ERROR',
            syncError: is24Error instanceof Error ? is24Error.message : 'Unknown error',
            lastSyncAt: new Date()
          }
        });
      }

      return NextResponse.json(
        { 
          error: 'IS24 publishing failed',
          details: is24Error instanceof Error ? is24Error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('POST /api/integrations/is24/publish error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
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
 * DELETE /api/integrations/is24/publish
 * 
 * Unpublish Property from ImmobilienScout24
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID required' },
        { status: 400 }
      );
    }

    // Get listing
    const listing = await db.listing.findFirst({
      where: {
        propertyId,
        platform: 'IMMOSCOUT24',
        property: {
          createdBy: session.user.id
        }
      },
      include: {
        property: {
          include: {
            user: true
          }
        }
      }
    });

    if (!listing || !listing.externalId) {
      return NextResponse.json(
        { error: 'Property not published on IS24' },
        { status: 404 }
      );
    }

    // Create IS24 client
    const mockAccessToken = process.env.IS24_DEMO_ACCESS_TOKEN || 'demo_token';
    const mockRefreshToken = process.env.IS24_DEMO_REFRESH_TOKEN || 'demo_refresh';
    const is24Client = new IS24Client(mockAccessToken, mockRefreshToken);

    try {
      // Delete from IS24
      await is24Client.deleteProperty(listing.externalId);

      // Delete listing record
      await db.listing.delete({
        where: { id: listing.id }
      });

      return NextResponse.json({
        message: 'Property unpublished from IS24 successfully'
      });

    } catch (is24Error) {
      console.error('IS24 deletion error:', is24Error);

      // Update listing with error
      await db.listing.update({
        where: { id: listing.id },
        data: {
          status: 'ERROR',
          syncError: is24Error instanceof Error ? is24Error.message : 'Deletion failed',
          lastSyncAt: new Date()
        }
      });

      return NextResponse.json(
        { 
          error: 'IS24 unpublishing failed',
          details: is24Error instanceof Error ? is24Error.message : 'Unknown error'
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('DELETE /api/integrations/is24/publish error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

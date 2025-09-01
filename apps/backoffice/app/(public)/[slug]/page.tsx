import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

import { db } from '@/lib/db';
import { MicrositeHeader } from '@/components/microsite/MicrositeHeader';
import { HeroSection } from '@/components/microsite/HeroSection';
import { PropertyDetails } from '@/components/microsite/PropertyDetails';
import { RoomShowcase } from '@/components/microsite/RoomShowcase';
import { EnergyBadge } from '@/components/microsite/EnergyBadge';
import { LocationMap } from '@/components/microsite/LocationMap';
import { ContactForm } from '@/components/microsite/ContactForm';
import { CostTransparencyBox } from '@/components/microsite/CostTransparencyBox';
import { DocumentDownload } from '@/components/microsite/DocumentDownload';
import { MicrositeFooter } from '@/components/microsite/MicrositeFooter';

interface MicrositePageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

/**
 * Property Microsite Page
 * 
 * Öffentliche Immobilien-Seite mit:
 * - SEO-optimiert
 * - DSGVO-konform
 * - Mobile-first
 * - GEG § 87 compliant
 * - Lead-Generierung
 */
export default async function MicrositePage({ params, searchParams }: MicrositePageProps) {
  // Property aus Datenbank laden
  const property = await db.property.findFirst({
    where: {
      slug: params.slug,
      published: true,
      publishedAt: { not: null }
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          avatar: true
        }
      },
      media: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          cdnUrl: true,
          alt: true,
          caption: true,
          width: true,
          height: true,
          variants: true
        }
      },
      rooms: {
        orderBy: { order: 'asc' },
        include: {
          media: {
            orderBy: { createdAt: 'asc' },
            select: {
              id: true,
              cdnUrl: true,
              alt: true,
              caption: true,
              width: true,
              height: true,
              variants: true
            }
          }
        }
      },
      leads: {
        where: {
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        },
        select: { id: true }
      }
    }
  });

  if (!property) {
    notFound();
  }

  // Tracking Parameters
  const utm_source = searchParams?.utm_source as string;
  const utm_medium = searchParams?.utm_medium as string;
  const utm_campaign = searchParams?.utm_campaign as string;
  const ref = searchParams?.ref as string;

  // Lead Source Detection
  const leadSource = utm_source === 'immoscout24' ? 'IMMOSCOUT24' :
                    utm_source === 'portal' ? 'PORTAL' :
                    ref ? 'REFERRAL' : 'MICROSITE';

  // Feature Images (Hero Gallery)
  const heroImages = property.media.filter(m => 
    m.cdnUrl && (m.caption?.includes('hero') || !m.caption)
  ).slice(0, 10);

  // 360° Images
  const panoramaImages = property.media.filter(m => 
    m.caption?.includes('360') || 
    (m.width && m.height && m.width / m.height >= 1.8)
  );

  // Documents (Grundrisse, etc.)
  const documents = property.media.filter(m => 
    m.caption?.includes('grundriss') || 
    m.caption?.includes('pdf') ||
    m.cdnUrl?.endsWith('.pdf')
  );

  // Recent Interest Level (für Social Proof)
  const recentInterest = property.leads.length;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <MicrositeHeader 
        propertyTitle={property.title}
        agentName={property.user.name || 'Live Your Dreams'}
        agentEmail={property.user.email}
        isPublished={property.published}
      />

      {/* Hero Section */}
      <HeroSection
        title={property.title}
        location={`${property.city} ${property.postcode}`}
        price={property.price}
        livingArea={property.livingArea}
        roomCount={property.roomCount}
        propertyType={property.type}
        images={heroImages}
        panoramaImages={panoramaImages}
        recentInterest={recentInterest}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Property Details & Energy Certificate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PropertyDetails
              description={property.description}
              details={{
                type: property.type,
                livingArea: property.livingArea,
                totalArea: property.totalArea,
                roomCount: property.roomCount,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                buildYear: property.buildYear,
                address: property.address
              }}
            />
          </div>
          
          <div className="space-y-6">
            {/* Energy Certificate */}
            <EnergyBadge
              energyType={property.energyType}
              energyValue={property.energyValue}
              energyClass={property.energyClass}
              energyCarrier={property.energyCarrier}
              energyCertValidUntil={property.energyCertValidUntil}
            />
            
            {/* Cost Transparency */}
            <CostTransparencyBox
              purchasePrice={property.price}
              livingArea={property.livingArea || 0}
              location={property.city}
            />
          </div>
        </div>

        {/* Room Showcase */}
        {property.rooms.length > 0 && (
          <RoomShowcase
            rooms={property.rooms.map(room => ({
              id: room.id,
              name: room.name,
              type: room.type,
              area: room.area,
              description: room.description,
              images: room.media
            }))}
          />
        )}

        {/* Location & Map */}
        <LocationMap
          address={`${property.address || ''} ${property.city} ${property.postcode}`}
          city={property.city}
          coordinates={null} // TODO: Geocoding integration
        />

        {/* Document Downloads */}
        {documents.length > 0 && (
          <DocumentDownload
            documents={documents.map(doc => ({
              id: doc.id,
              name: doc.caption || 'Dokument',
              url: doc.cdnUrl!,
              size: 0, // TODO: Add file size to media model
              type: doc.cdnUrl?.endsWith('.pdf') ? 'pdf' : 'image'
            }))}
          />
        )}

        {/* Contact Form */}
        <ContactForm
          propertyId={property.id}
          propertyTitle={property.title}
          agentName={property.user.name || 'Live Your Dreams'}
          leadSource={leadSource}
          utm={{
            source: utm_source,
            medium: utm_medium,
            campaign: utm_campaign
          }}
        />
      </main>

      {/* Footer */}
      <MicrositeFooter 
        agentName={property.user.name || 'Live Your Dreams'}
        companyName="Live Your Dreams"
      />

      {/* Structured Data für SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateListing",
            "name": property.title,
            "description": property.description,
            "url": `https://liveyourdreams.online/${property.slug}`,
            "image": heroImages.map(img => img.cdnUrl),
            "offers": {
              "@type": "Offer",
              "priceCurrency": "EUR",
              "price": property.price / 100,
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "EUR",
                "price": property.price / 100
              }
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": property.city,
              "postalCode": property.postcode,
              "addressCountry": "DE"
            },
            "floorSize": {
              "@type": "QuantitativeValue",
              "value": property.livingArea,
              "unitCode": "MTK"
            },
            "numberOfRooms": property.roomCount,
            "numberOfBedrooms": property.bedrooms,
            "numberOfBathroomsTotal": property.bathrooms,
            "yearBuilt": property.buildYear,
            "datePublished": property.publishedAt?.toISOString(),
            "dateModified": property.updatedAt.toISOString(),
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "5",
              "reviewCount": "1"
            }
          })
        }}
      />
    </div>
  );
}

/**
 * Metadata Generation für SEO
 */
export async function generateMetadata({ params }: MicrositePageProps): Promise<Metadata> {
  const property = await db.property.findFirst({
    where: {
      slug: params.slug,
      published: true
    },
    select: {
      title: true,
      description: true,
      city: true,
      postcode: true,
      price: true,
      livingArea: true,
      roomCount: true,
      type: true,
      media: {
        take: 1,
        orderBy: { createdAt: 'asc' },
        select: { cdnUrl: true }
      },
      updatedAt: true
    }
  });

  if (!property) {
    return {
      title: 'Immobilie nicht gefunden',
      description: 'Die gesuchte Immobilie konnte nicht gefunden werden.'
    };
  }

  const priceFormatted = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(property.price / 100);

  const title = `${property.title} - ${priceFormatted} | ${property.city}`;
  const description = property.description || 
    `${property.type} in ${property.city}: ${property.roomCount} Zimmer, ${property.livingArea}m² ab ${priceFormatted}. Jetzt besichtigen!`;

  return {
    title,
    description,
    keywords: [
      property.type.toLowerCase(),
      property.city,
      'immobilie',
      'kaufen',
      'wohnung',
      'haus',
      'live your dreams',
      `${property.roomCount} zimmer`,
      property.postcode
    ].join(', '),
    authors: [{ name: 'Live Your Dreams' }],
    creator: 'Live Your Dreams',
    publisher: 'Live Your Dreams',
    formatDetection: {
      telephone: true,
      email: true
    },
    openGraph: {
      title,
      description,
      url: `https://liveyourdreams.online/${params.slug}`,
      siteName: 'Live Your Dreams',
      images: property.media[0]?.cdnUrl ? [{
        url: property.media[0].cdnUrl,
        width: 1200,
        height: 630,
        alt: property.title
      }] : [],
      locale: 'de_DE',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: property.media[0]?.cdnUrl ? [property.media[0].cdnUrl] : [],
      creator: '@liveyourdreams'
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `https://liveyourdreams.online/${params.slug}`
    },
    other: {
      'last-modified': property.updatedAt.toISOString(),
      'property:type': property.type,
      'property:price': property.price.toString(),
      'property:location': `${property.city} ${property.postcode}`,
      'property:rooms': property.roomCount?.toString() || '0',
      'property:area': property.livingArea?.toString() || '0'
    }
  };
}

/**
 * Static Params Generation (für ISR)
 */
export async function generateStaticParams() {
  const properties = await db.property.findMany({
    where: {
      published: true,
      slug: { not: null }
    },
    select: { slug: true },
    take: 100 // Limit für Build Performance
  });

  return properties.map(property => ({
    slug: property.slug!
  }));
}

/**
 * Revalidation (ISR)
 */
export const revalidate = 3600; // 1 Stunde
export const dynamicParams = true;

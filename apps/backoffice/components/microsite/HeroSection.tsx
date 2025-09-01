'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  LdsButton,
  LdsBadge 
} from '@liveyourdreams/design-system-react';

import { Viewer360 } from '@/components/media/Viewer360';

interface HeroImage {
  id: string;
  cdnUrl: string;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
}

interface HeroSectionProps {
  title: string;
  location: string;
  price: number; // in cents
  livingArea?: number | null;
  roomCount?: number | null;
  propertyType: string;
  images: HeroImage[];
  panoramaImages: HeroImage[];
  recentInterest: number;
}

/**
 * HeroSection Component
 * 
 * Hauptbereich der Microsite mit:
 * - Image Gallery
 * - 360°-Viewer Integration
 * - Key Property Info
 * - Social Proof
 * - CTA Buttons
 */
export function HeroSection({
  title,
  location,
  price,
  livingArea,
  roomCount,
  propertyType,
  images,
  panoramaImages,
  recentInterest
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPanorama, setShowPanorama] = useState(false);
  const [selectedPanorama, setSelectedPanorama] = useState<HeroImage | null>(null);

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInCents / 100);
  };

  const getPropertyTypeLabel = (type: string) => {
    const labels = {
      WOHNUNG: '🏠 Eigentumswohnung',
      HAUS: '🏡 Einfamilienhaus',
      REIHENHAUS: '🏘️ Reihenhaus',
      DOPPELHAUS: '🏠 Doppelhaushälfte',
      MEHRFAMILIENHAUS: '🏢 Mehrfamilienhaus',
      GEWERBE: '🏢 Gewerbeimmobilie'
    };
    return labels[type as keyof typeof labels] || `🏠 ${type}`;
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact-form');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative">
      {/* Image Gallery */}
      <div className="relative h-[70vh] min-h-[500px] bg-gray-900">
        {images.length > 0 ? (
          <>
            {/* Main Image */}
            <div className="relative w-full h-full">
              <Image
                src={images[currentImageIndex].cdnUrl}
                alt={images[currentImageIndex].alt || title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
                quality={85}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
            </div>

            {/* Image Navigation */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === 0 ? images.length - 1 : prev - 1
                  )}
                >
                  ←
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  onClick={() => setCurrentImageIndex(prev => 
                    prev === images.length - 1 ? 0 : prev + 1
                  )}
                >
                  →
                </button>

                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 max-w-xs overflow-x-auto">
                {images.slice(0, 6).map((image, index) => (
                  <button
                    key={image.id}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex 
                        ? 'border-white' 
                        : 'border-white/30 hover:border-white/60'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={image.cdnUrl}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
                {images.length > 6 && (
                  <div className="flex items-center justify-center w-16 h-12 bg-black/50 text-white text-xs rounded-lg">
                    +{images.length - 6}
                  </div>
                )}
              </div>
            )}

            {/* 360° Button */}
            {panoramaImages.length > 0 && (
              <button
                className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                onClick={() => {
                  setSelectedPanorama(panoramaImages[0]);
                  setShowPanorama(true);
                }}
              >
                <span>🔄</span>
                <span>360° Tour</span>
              </button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-200 text-gray-500">
            <div className="text-center">
              <div className="text-6xl mb-4">🏠</div>
              <p className="text-lg">Bilder werden geladen...</p>
            </div>
          </div>
        )}
      </div>

      {/* Property Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-white space-y-4">
            {/* Social Proof */}
            {recentInterest > 0 && (
              <LdsBadge variant="warning">
                🔥 {recentInterest} Interessenten in den letzten 30 Tagen
              </LdsBadge>
            )}

            {/* Title & Location */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{title}</h1>
              <p className="text-xl text-white/90">📍 {location}</p>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap items-center gap-6 text-lg">
              <div className="flex items-center space-x-2">
                <span className="text-3xl font-bold text-yellow-400">
                  {formatPrice(price)}
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <span>{getPropertyTypeLabel(propertyType)}</span>
              </div>
              
              {roomCount && (
                <div className="flex items-center space-x-1">
                  <span>🛏️ {roomCount} Zimmer</span>
                </div>
              )}
              
              {livingArea && (
                <div className="flex items-center space-x-1">
                  <span>📐 {livingArea}m²</span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <LdsButton
                variant="primary"
                size="lg"
                onClick={scrollToContact}
                className="bg-blue-600 hover:bg-blue-700"
              >
                📞 Besichtigung vereinbaren
              </LdsButton>
              
              <LdsButton
                variant="outline"
                size="lg"
                onClick={scrollToContact}
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                📧 Informationen anfordern
              </LdsButton>
              
              {panoramaImages.length > 0 && (
                <LdsButton
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setSelectedPanorama(panoramaImages[0]);
                    setShowPanorama(true);
                  }}
                  className="bg-white/20 text-white hover:bg-white/30"
                >
                  🔄 360° Rundgang
                </LdsButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 360° Panorama Modal */}
      {showPanorama && selectedPanorama && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl mx-auto">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-10 bg-white/20 text-white p-2 rounded-full hover:bg-white/30 transition-colors"
              onClick={() => setShowPanorama(false)}
            >
              ✕
            </button>

            {/* 360° Viewer */}
            <div className="bg-white rounded-lg overflow-hidden">
              <Viewer360
                panoramaUrl={selectedPanorama.cdnUrl}
                height={600}
                autoLoad={true}
                showFullscreen={false}
                showZoomControls={true}
                showCompass={true}
                onError={() => {
                  console.error('360° viewer error');
                  setShowPanorama(false);
                }}
              />
            </div>

            {/* Panorama Navigation */}
            {panoramaImages.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {panoramaImages.map((panorama, index) => (
                  <button
                    key={panorama.id}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedPanorama.id === panorama.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                    onClick={() => setSelectedPanorama(panorama)}
                  >
                    360° {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

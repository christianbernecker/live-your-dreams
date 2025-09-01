import React from 'react';
import { LdsCard, LdsCardHeader, LdsCardTitle, LdsCardContent } from '@liveyourdreams/design-system-react';

interface LocationMapProps {
  address: string;
  city: string;
  coordinates?: { lat: number; lng: number } | null;
}

export function LocationMap({ address, city, coordinates }: LocationMapProps) {
  // Google Maps embed URL
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(address)}`;
  
  return (
    <LdsCard>
      <LdsCardHeader>
        <LdsCardTitle>📍 Lage & Umgebung</LdsCardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Entdecken Sie die Umgebung dieser Immobilie in {city}
        </p>
      </LdsCardHeader>
      <LdsCardContent>
        <div className="space-y-6">
          {/* Map Placeholder - In production, integrate with Google Maps or OpenStreetMap */}
          <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-600">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="font-medium">Interaktive Karte</p>
              <p className="text-sm">{address}</p>
              <p className="text-xs mt-2">Google Maps Integration folgt</p>
            </div>
          </div>

          {/* Location Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl mb-2">🚊</div>
              <div className="font-medium text-gray-900">Öffentliche Verkehrsmittel</div>
              <div className="text-sm text-gray-600 mt-1">
                Gute Anbindung an U-Bahn und Bus
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">🛒</div>
              <div className="font-medium text-gray-900">Einkaufsmöglichkeiten</div>
              <div className="text-sm text-gray-600 mt-1">
                Supermärkte und Geschäfte in der Nähe
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl mb-2">🏫</div>
              <div className="font-medium text-gray-900">Schulen & Kitas</div>
              <div className="text-sm text-gray-600 mt-1">
                Bildungseinrichtungen im Umkreis
              </div>
            </div>
          </div>
        </div>
      </LdsCardContent>
    </LdsCard>
  );
}

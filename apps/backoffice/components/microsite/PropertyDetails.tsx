import React from 'react';
import { LdsCard, LdsCardHeader, LdsCardTitle, LdsCardContent } from '@liveyourdreams/design-system-react';

interface PropertyDetailsProps {
  description?: string | null;
  details: {
    type: string;
    livingArea?: number | null;
    totalArea?: number | null;
    roomCount?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    buildYear?: number | null;
    address?: string | null;
  };
}

export function PropertyDetails({ description, details }: PropertyDetailsProps) {
  const formatArea = (area?: number | null) => area ? `${area}m²` : '-';
  const formatYear = (year?: number | null) => year ? year.toString() : '-';
  const formatRooms = (rooms?: number | null) => rooms ? rooms.toString() : '-';

  const getTypeLabel = (type: string) => {
    const labels = {
      WOHNUNG: 'Eigentumswohnung',
      HAUS: 'Einfamilienhaus', 
      REIHENHAUS: 'Reihenhaus',
      DOPPELHAUS: 'Doppelhaushälfte',
      MEHRFAMILIENHAUS: 'Mehrfamilienhaus',
      GEWERBE: 'Gewerbeimmobilie'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-8">
      {/* Description */}
      {description && (
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>Objektbeschreibung</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="prose max-w-none text-gray-700">
              {description.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </LdsCardContent>
        </LdsCard>
      )}

      {/* Key Details */}
      <LdsCard>
        <LdsCardHeader>
          <LdsCardTitle>Objektdaten</LdsCardTitle>
        </LdsCardHeader>
        <LdsCardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Immobilientyp</div>
              <div className="font-medium">{getTypeLabel(details.type)}</div>
            </div>
            
            <div>
              <div className="text-sm text-gray-600">Wohnfläche</div>
              <div className="font-medium">{formatArea(details.livingArea)}</div>
            </div>
            
            {details.totalArea && (
              <div>
                <div className="text-sm text-gray-600">Grundstücksfläche</div>
                <div className="font-medium">{formatArea(details.totalArea)}</div>
              </div>
            )}
            
            <div>
              <div className="text-sm text-gray-600">Zimmer</div>
              <div className="font-medium">{formatRooms(details.roomCount)}</div>
            </div>
            
            {details.bedrooms && (
              <div>
                <div className="text-sm text-gray-600">Schlafzimmer</div>
                <div className="font-medium">{formatRooms(details.bedrooms)}</div>
              </div>
            )}
            
            {details.bathrooms && (
              <div>
                <div className="text-sm text-gray-600">Badezimmer</div>
                <div className="font-medium">{formatRooms(details.bathrooms)}</div>
              </div>
            )}
            
            <div>
              <div className="text-sm text-gray-600">Baujahr</div>
              <div className="font-medium">{formatYear(details.buildYear)}</div>
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>
    </div>
  );
}

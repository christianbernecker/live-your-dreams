'use client';

import React from 'react';
import { LdsCard, LdsCardContent, LdsBadge } from '@liveyourdreams/design-system-react';

interface EnergyBadgeProps {
  energyType?: string | null;
  energyValue?: number | null;
  energyClass?: string | null;
  energyCarrier?: string | null;
  energyCertValidUntil?: Date | null;
}

/**
 * EnergyBadge Component
 * 
 * GEG § 87 konforme Energieausweis-Anzeige
 */
export function EnergyBadge({
  energyType,
  energyValue,
  energyClass,
  energyCarrier,
  energyCertValidUntil
}: EnergyBadgeProps) {
  if (!energyType || !energyValue || !energyClass) {
    return null; // Kein unvollständiger Energieausweis anzeigen
  }

  const getClassColor = (energyClass: string) => {
    const colorMap: Record<string, string> = {
      'A+': 'bg-green-700',
      'A': 'bg-green-600',
      'B': 'bg-green-500',
      'C': 'bg-yellow-500',
      'D': 'bg-yellow-600',
      'E': 'bg-orange-500',
      'F': 'bg-red-500',
      'G': 'bg-red-600',
      'H': 'bg-red-700'
    };
    return colorMap[energyClass] || 'bg-gray-500';
  };

  const isExpired = energyCertValidUntil && energyCertValidUntil <= new Date();

  return (
    <LdsCard>
      <LdsCardContent className="p-6">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            ⚡ Energieausweis
          </h3>
          
          {/* Energy Class Badge */}
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white text-2xl font-bold ${getClassColor(energyClass)}`}>
            {energyClass}
          </div>
          
          {/* Energy Value */}
          <div className="space-y-2">
            <div className="text-2xl font-bold text-gray-900">
              {energyValue} kWh/(m²·a)
            </div>
            <div className="text-sm text-gray-600">
              {energyType === 'Bedarf' ? 'Energiebedarf' : 'Energieverbrauch'}
            </div>
          </div>
          
          {/* Additional Info */}
          {energyCarrier && (
            <div className="text-sm text-gray-600">
              Energieträger: {energyCarrier}
            </div>
          )}
          
          {/* Validity */}
          {energyCertValidUntil && (
            <div className="pt-2 border-t">
              <LdsBadge variant={isExpired ? 'destructive' : 'success'}>
                {isExpired ? '⚠️ Abgelaufen' : '✅ Gültig bis'} {energyCertValidUntil.toLocaleDateString('de-DE')}
              </LdsBadge>
            </div>
          )}
          
          <div className="text-xs text-gray-500 pt-2">
            Pflichtangabe nach GEG § 87
          </div>
        </div>
      </LdsCardContent>
    </LdsCard>
  );
}

import React from 'react';
import { LdsCard, LdsCardHeader, LdsCardTitle, LdsCardContent } from '@liveyourdreams/design-system-react';

interface CostTransparencyBoxProps {
  purchasePrice: number; // in cents
  livingArea: number;
  location: string;
}

export function CostTransparencyBox({ purchasePrice, livingArea, location }: CostTransparencyBoxProps) {
  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(priceInCents / 100);
  };

  const pricePerSqm = livingArea > 0 ? Math.round((purchasePrice / 100) / livingArea) : 0;
  
  // Estimated costs (rough calculations for Munich area)
  const notaryFees = Math.round((purchasePrice / 100) * 0.015); // 1.5%
  const realEstateTax = Math.round((purchasePrice / 100) * 0.035); // 3.5%
  const landRegistryFees = Math.round((purchasePrice / 100) * 0.005); // 0.5%
  const brokerageFee = Math.round((purchasePrice / 100) * 0.0357); // 3.57% (incl. VAT)
  
  const totalAdditionalCosts = notaryFees + realEstateTax + landRegistryFees + brokerageFee;
  const totalCosts = (purchasePrice / 100) + totalAdditionalCosts;

  return (
    <LdsCard>
      <LdsCardHeader>
        <LdsCardTitle>💰 Kostenübersicht</LdsCardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Transparente Auflistung aller anfallenden Kosten
        </p>
      </LdsCardHeader>
      <LdsCardContent>
        <div className="space-y-4">
          {/* Main Price */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Kaufpreis</span>
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(purchasePrice)}
              </span>
            </div>
            {pricePerSqm > 0 && (
              <div className="text-sm text-gray-600 mt-1">
                ≈ {pricePerSqm.toLocaleString('de-DE')} €/m²
              </div>
            )}
          </div>

          {/* Additional Costs */}
          <div className="space-y-2 text-sm">
            <div className="font-medium text-gray-900 mb-2">Zusätzliche Kosten:</div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Notar & Grundbuch</span>
              <span>≈ {notaryFees.toLocaleString('de-DE')} €</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Grunderwerbsteuer</span>
              <span>≈ {realEstateTax.toLocaleString('de-DE')} €</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Maklerprovision</span>
              <span>≈ {brokerageFee.toLocaleString('de-DE')} €</span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-bold">
              <span>Gesamtkosten (ca.)</span>
              <span className="text-lg">{totalCosts.toLocaleString('de-DE')} €</span>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-gray-500 border-t pt-3">
            * Angaben ohne Gewähr. Tatsächliche Kosten können abweichen. 
            Grunderwerbsteuer variiert je nach Bundesland ({location}: 3,5%).
          </div>
        </div>
      </LdsCardContent>
    </LdsCard>
  );
}

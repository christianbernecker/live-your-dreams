'use client';

import React, { useState, useEffect } from 'react';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsCardContent,
  LdsButton,
  LdsSelect,
  LdsInput,
  LdsBadge
} from '@liveyourdreams/design-system-react';

import {
  calculatePricing,
  getRecommendedModules,
  formatPrice,
  BASE_PACKAGES,
  PRICING_MODULES,
  type PricingTier,
  type PropertyType,
  type Region,
  type PropertySpecs,
  type PricingCalculation,
  type PricingModule
} from '@/lib/pricing/calculator';

interface PricingCalculatorProps {
  propertyId?: string;
  onQuoteGenerated?: (quote: PricingCalculation) => void;
  embedded?: boolean;
}

/**
 * Interactive Pricing Calculator
 * 
 * Allows users to:
 * - Select base package (Basic, Premium, Enterprise)
 * - Configure property specifications
 * - Add/remove optional modules
 * - See real-time price updates
 * - Generate quotes
 */
export function PricingCalculator({
  propertyId,
  onQuoteGenerated,
  embedded = false
}: PricingCalculatorProps) {
  // Configuration state
  const [selectedTier, setSelectedTier] = useState<PricingTier>('PREMIUM');
  const [propertySpecs, setPropertySpecs] = useState<PropertySpecs>({
    type: 'WOHNUNG',
    livingArea: 85,
    totalArea: 100,
    roomCount: 3,
    region: 'MUENCHEN',
    luxuryClass: 'STANDARD'
  });
  const [selectedModules, setSelectedModules] = useState<{ moduleId: string; quantity: number }[]>([]);
  
  // Calculation state
  const [calculation, setCalculation] = useState<PricingCalculation | null>(null);
  const [recommendedModules, setRecommendedModules] = useState<PricingModule[]>([]);
  const [loading, setLoading] = useState(false);
  
  // UI state
  const [activeTab, setActiveTab] = useState<'packages' | 'modules' | 'details' | 'quote'>('packages');

  // Recalculate when inputs change
  useEffect(() => {
    const newCalculation = calculatePricing(selectedTier, selectedModules, propertySpecs);
    setCalculation(newCalculation);
    
    const recommended = getRecommendedModules(selectedTier, propertySpecs);
    setRecommendedModules(recommended);
  }, [selectedTier, selectedModules, propertySpecs]);

  const toggleModule = (moduleId: string, quantity = 1) => {
    setSelectedModules(prev => {
      const existing = prev.find(m => m.moduleId === moduleId);
      if (existing) {
        // Remove module
        return prev.filter(m => m.moduleId !== moduleId);
      } else {
        // Add module
        return [...prev, { moduleId, quantity }];
      }
    });
  };

  const updateModuleQuantity = (moduleId: string, quantity: number) => {
    if (quantity <= 0) {
      toggleModule(moduleId);
      return;
    }
    
    setSelectedModules(prev => 
      prev.map(m => m.moduleId === moduleId ? { ...m, quantity } : m)
    );
  };

  const isModuleSelected = (moduleId: string) => {
    return selectedModules.some(m => m.moduleId === moduleId);
  };

  const getModuleQuantity = (moduleId: string) => {
    return selectedModules.find(m => m.moduleId === moduleId)?.quantity || 1;
  };

  const generateQuote = async () => {
    if (!calculation) return;
    
    setLoading(true);
    try {
      // Here you would typically save the quote to the database
      // For now, we'll just call the callback
      onQuoteGenerated?.(calculation);
      setActiveTab('quote');
    } catch (error) {
      console.error('Failed to generate quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const addRecommendedModules = () => {
    const newModules = recommendedModules
      .filter(module => !isModuleSelected(module.id))
      .map(module => ({ moduleId: module.id, quantity: 1 }));
    
    setSelectedModules(prev => [...prev, ...newModules]);
  };

  if (!calculation) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">⏳</div>
        <p className="text-gray-600">Preise werden berechnet...</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${embedded ? '' : 'min-h-screen bg-gray-50 p-8'}`}>
      {!embedded && (
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💰 LYD Preiskalkulator
          </h1>
          <p className="text-gray-600">
            Konfigurieren Sie Ihr individuelles Immobilien-Marketing-Paket
          </p>
        </div>
      )}
      
      <div className={`${embedded ? '' : 'max-w-6xl mx-auto'} grid grid-cols-1 lg:grid-cols-3 gap-6`}>
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('packages')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'packages'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📦 Pakete
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'modules'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🧩 Module
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'details'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🏠 Details
            </button>
          </div>

          {/* Package Selection */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Wählen Sie Ihr Basis-Paket</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(BASE_PACKAGES).map(([tier, pkg]) => (
                  <LdsCard 
                    key={tier}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedTier === tier ? 'ring-2 ring-blue-500 shadow-md' : ''
                    }`}
                    onClick={() => setSelectedTier(tier as PricingTier)}
                  >
                    <LdsCardHeader>
                      <LdsCardTitle className="flex items-center justify-between">
                        <span>{pkg.name}</span>
                        {selectedTier === tier && <span className="text-blue-500">✓</span>}
                      </LdsCardTitle>
                    </LdsCardHeader>
                    <LdsCardContent>
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(pkg.price)}
                        </div>
                        <p className="text-sm text-gray-600">{pkg.description}</p>
                        
                        <div className="border-t pt-3">
                          <h4 className="font-semibold text-sm text-gray-900 mb-2">
                            Enthaltene Leistungen:
                          </h4>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {pkg.features.slice(0, 4).map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <span className="text-green-500 mr-1">✓</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                            {pkg.features.length > 4 && (
                              <li className="text-gray-400 italic">
                                + {pkg.features.length - 4} weitere Features
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </LdsCardContent>
                  </LdsCard>
                ))}
              </div>
              
              {recommendedModules.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-800">
                        💡 Empfohlene Zusatzmodule
                      </h4>
                      <p className="text-sm text-blue-700">
                        {recommendedModules.length} Module für Ihr {BASE_PACKAGES[selectedTier].name} Paket empfohlen
                      </p>
                    </div>
                    <LdsButton 
                      variant="outline" 
                      size="sm"
                      onClick={addRecommendedModules}
                    >
                      Alle hinzufügen
                    </LdsButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Module Selection */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Zusätzliche Module</h2>
                <LdsBadge variant="info">
                  {selectedModules.length} ausgewählt
                </LdsBadge>
              </div>

              {/* Group modules by category */}
              {['MEDIA', 'LEGAL', 'MARKETING', 'SERVICE', 'TECHNICAL'].map(category => {
                const categoryModules = PRICING_MODULES.filter(m => m.category === category);
                if (categoryModules.length === 0) return null;
                
                const categoryNames = {
                  MEDIA: '📷 Medien & Fotografie',
                  LEGAL: '⚖️ Rechtliche Services',
                  MARKETING: '📱 Marketing & Werbung',
                  SERVICE: '🎧 Service & Support',
                  TECHNICAL: '⚙️ Technische Erweiterungen'
                };

                return (
                  <div key={category} className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      {categoryNames[category as keyof typeof categoryNames]}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categoryModules.map(module => {
                        const isSelected = isModuleSelected(module.id);
                        const quantity = getModuleQuantity(module.id);
                        const isRecommended = recommendedModules.some(r => r.id === module.id);
                        const isRequired = module.requiredForTier?.includes(selectedTier);
                        
                        return (
                          <LdsCard 
                            key={module.id}
                            className={`transition-all ${
                              isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-md'
                            }`}
                          >
                            <LdsCardContent>
                              <div className="space-y-3">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-2xl">{module.icon}</span>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">
                                        {module.name}
                                      </h4>
                                      {isRecommended && (
                                        <LdsBadge variant="warning" size="sm">
                                          Empfohlen
                                        </LdsBadge>
                                      )}
                                      {isRequired && (
                                        <LdsBadge variant="success" size="sm">
                                          Enthalten
                                        </LdsBadge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-gray-900">
                                      {formatPrice(module.basePrice)}
                                    </div>
                                    {module.pricePerM2 && (
                                      <div className="text-xs text-gray-500">
                                        + {formatPrice(module.pricePerM2)}/m²
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <p className="text-sm text-gray-600">
                                  {module.description}
                                </p>
                                
                                <div className="text-xs text-gray-500">
                                  ⏱️ {module.estimatedDeliveryDays} Werktage
                                  {module.externalProvider && (
                                    <span className="ml-2">• {module.externalProvider}</span>
                                  )}
                                </div>
                                
                                {/* Features list */}
                                <div className="border-t pt-2">
                                  <ul className="text-xs text-gray-600 space-y-1">
                                    {module.features.slice(0, 3).map((feature, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <span className="text-green-500 mr-1">✓</span>
                                        <span>{feature}</span>
                                      </li>
                                    ))}
                                    {module.features.length > 3 && (
                                      <li className="text-gray-400 italic">
                                        + {module.features.length - 3} weitere
                                      </li>
                                    )}
                                  </ul>
                                </div>
                                
                                {/* Action buttons */}
                                <div className="flex items-center justify-between pt-2 border-t">
                                  <div className="flex items-center space-x-2">
                                    {isSelected && !module.oneTime && (
                                      <>
                                        <button
                                          onClick={() => updateModuleQuantity(module.id, quantity - 1)}
                                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm"
                                        >
                                          −
                                        </button>
                                        <span className="text-sm font-medium">{quantity}</span>
                                        <button
                                          onClick={() => updateModuleQuantity(module.id, quantity + 1)}
                                          className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm"
                                        >
                                          +
                                        </button>
                                      </>
                                    )}
                                  </div>
                                  
                                  <LdsButton
                                    variant={isSelected ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => toggleModule(module.id)}
                                    disabled={isRequired}
                                  >
                                    {isRequired ? 'Enthalten' : 
                                     isSelected ? 'Entfernen' : 'Hinzufügen'}
                                  </LdsButton>
                                </div>
                              </div>
                            </LdsCardContent>
                          </LdsCard>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Property Details */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Objekt-Spezifikationen</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LdsCard>
                  <LdsCardHeader>
                    <LdsCardTitle>🏠 Grunddaten</LdsCardTitle>
                  </LdsCardHeader>
                  <LdsCardContent>
                    <div className="space-y-4">
                      <LdsSelect
                        label="Objektart"
                        value={propertySpecs.type}
                        onChange={(e) => setPropertySpecs(prev => ({ 
                          ...prev, 
                          type: e.target.value as PropertyType 
                        }))}
                        options={[
                          { value: 'WOHNUNG', label: '🏠 Wohnung' },
                          { value: 'HAUS', label: '🏡 Haus' },
                          { value: 'REIHENHAUS', label: '🏘️ Reihenhaus' },
                          { value: 'DOPPELHAUS', label: '🏠 Doppelhaus' },
                          { value: 'MEHRFAMILIENHAUS', label: '🏢 Mehrfamilienhaus' },
                          { value: 'GEWERBE', label: '🏪 Gewerbe' }
                        ]}
                      />
                      
                      <LdsInput
                        type="number"
                        label="Wohnfläche (m²)"
                        value={propertySpecs.livingArea?.toString() || ''}
                        onChange={(e) => setPropertySpecs(prev => ({ 
                          ...prev, 
                          livingArea: parseFloat(e.target.value) || undefined
                        }))}
                        placeholder="85"
                      />
                      
                      <LdsInput
                        type="number"
                        label="Gesamtfläche (m²)"
                        value={propertySpecs.totalArea?.toString() || ''}
                        onChange={(e) => setPropertySpecs(prev => ({ 
                          ...prev, 
                          totalArea: parseFloat(e.target.value) || undefined
                        }))}
                        placeholder="100"
                      />
                      
                      <LdsInput
                        type="number"
                        label="Anzahl Zimmer"
                        value={propertySpecs.roomCount?.toString() || ''}
                        onChange={(e) => setPropertySpecs(prev => ({ 
                          ...prev, 
                          roomCount: parseFloat(e.target.value) || undefined
                        }))}
                        placeholder="3.5"
                        step="0.5"
                      />
                    </div>
                  </LdsCardContent>
                </LdsCard>
                
                <LdsCard>
                  <LdsCardHeader>
                    <LdsCardTitle>📍 Standort & Kategorie</LdsCardTitle>
                  </LdsCardHeader>
                  <LdsCardContent>
                    <div className="space-y-4">
                      <LdsSelect
                        label="Region"
                        value={propertySpecs.region}
                        onChange={(e) => setPropertySpecs(prev => ({ 
                          ...prev, 
                          region: e.target.value as Region
                        }))}
                        options={[
                          { value: 'MUENCHEN', label: '🏛️ München (+15%)' },
                          { value: 'BAYERN', label: '🥨 Bayern (+5%)' },
                          { value: 'DEUTSCHLAND', label: '🇩🇪 Deutschland (Standard)' },
                          { value: 'EUROPA', label: '🇪🇺 Europa (+20%)' }
                        ]}
                      />
                      
                      <LdsSelect
                        label="Ausstattungskategorie"
                        value={propertySpecs.luxuryClass || 'STANDARD'}
                        onChange={(e) => setPropertySpecs(prev => ({ 
                          ...prev, 
                          luxuryClass: e.target.value as PropertySpecs['luxuryClass']
                        }))}
                        options={[
                          { value: 'STANDARD', label: '⚪ Standard' },
                          { value: 'PREMIUM', label: '🥈 Premium (+10%)' },
                          { value: 'LUXURY', label: '🥇 Luxus (+25%)' }
                        ]}
                      />
                    </div>
                  </LdsCardContent>
                </LdsCard>
              </div>
              
              {/* Pricing Impact Preview */}
              <LdsCard>
                <LdsCardHeader>
                  <LdsCardTitle>💡 Preiseinfluss der Spezifikationen</LdsCardTitle>
                </LdsCardHeader>
                <LdsCardContent>
                  <div className="space-y-3">
                    {calculation.adjustments.map((adjustment, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{adjustment.description}</span>
                        <span className={`font-medium ${
                          adjustment.amount > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {adjustment.amount > 0 ? '+' : ''}{formatPrice(adjustment.amount)}
                          <span className="text-gray-500 ml-1">
                            ({adjustment.factor > 1 ? '+' : ''}{((adjustment.factor - 1) * 100).toFixed(0)}%)
                          </span>
                        </span>
                      </div>
                    ))}
                    {calculation.adjustments.length === 0 && (
                      <p className="text-gray-500 italic">Keine zusätzlichen Anpassungen</p>
                    )}
                  </div>
                </LdsCardContent>
              </LdsCard>
            </div>
          )}
        </div>

        {/* Price Summary Panel */}
        <div className="space-y-6">
          <LdsCard className="sticky top-4">
            <LdsCardHeader>
              <LdsCardTitle>📊 Kostenübersicht</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="space-y-4">
                {/* Base Package */}
                <div className="flex justify-between items-start pb-3 border-b">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {calculation.basePackage.name}
                    </h4>
                    <p className="text-sm text-gray-600">Basis-Paket</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {formatPrice(calculation.basePackage.price)}
                    </div>
                  </div>
                </div>

                {/* Selected Modules */}
                {calculation.modules.map((module, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {module.module.name}
                        {module.quantity > 1 && (
                          <span className="text-gray-500 ml-1">×{module.quantity}</span>
                        )}
                      </h5>
                      {module.notes && (
                        <p className="text-xs text-gray-500">{module.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        {formatPrice(module.totalPrice)}
                      </div>
                      {module.quantity > 1 && (
                        <div className="text-xs text-gray-500">
                          {formatPrice(module.unitPrice)} je Stück
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Adjustments */}
                {calculation.adjustments.length > 0 && (
                  <div className="border-t pt-3 space-y-2">
                    {calculation.adjustments.map((adjustment, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-600">{adjustment.description}</span>
                        <span className={`font-medium ${
                          adjustment.amount > 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {adjustment.amount > 0 ? '+' : ''}{formatPrice(adjustment.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Totals */}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Zwischensumme</span>
                    <span className="font-medium">{formatPrice(calculation.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">MwSt. (19%)</span>
                    <span className="font-medium">{formatPrice(calculation.tax)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Gesamtpreis</span>
                    <span className="text-blue-600">{formatPrice(calculation.total)}</span>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-2">🚚</span>
                    <span>
                      Lieferzeit: {calculation.estimatedDelivery.min}-{calculation.estimatedDelivery.max} Werktage
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <span className="mr-2">⏰</span>
                    <span>
                      Angebot gültig bis: {calculation.validUntil.toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4 border-t">
                  <LdsButton
                    onClick={generateQuote}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? 'Erstelle Angebot...' : '📄 Angebot erstellen'}
                  </LdsButton>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <LdsButton variant="outline" size="sm" className="text-xs">
                      💾 Speichern
                    </LdsButton>
                    <LdsButton variant="outline" size="sm" className="text-xs">
                      📧 Per E-Mail
                    </LdsButton>
                  </div>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Quick Actions */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>⚡ Schnellaktionen</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="space-y-3">
                <LdsButton
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTier('BASIC')}
                  className="w-full justify-start"
                >
                  💰 Basis-Paket wählen
                </LdsButton>
                <LdsButton
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTier('PREMIUM')}
                  className="w-full justify-start"
                >
                  ⭐ Premium-Paket wählen
                </LdsButton>
                <LdsButton
                  variant="outline"
                  size="sm"
                  onClick={addRecommendedModules}
                  className="w-full justify-start"
                >
                  🎯 Empfohlene Module hinzufügen
                </LdsButton>
              </div>
            </LdsCardContent>
          </LdsCard>
        </div>
      </div>
    </div>
  );
}

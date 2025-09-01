'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PricingCalculator } from '@/components/pricing/PricingCalculator';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsCardContent,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

import type { PricingCalculation } from '@/lib/pricing/calculator';

/**
 * LYD Pricing Page
 * 
 * Main page for the pricing calculator with:
 * - Interactive pricing configuration
 * - Quote generation and management
 * - Pricing history and templates
 * - Integration with property management
 */
export default function PricingPage() {
  const [generatedQuote, setGeneratedQuote] = useState<PricingCalculation | null>(null);
  const [showQuoteSuccess, setShowQuoteSuccess] = useState(false);

  const handleQuoteGenerated = async (quote: PricingCalculation) => {
    try {
      // Save quote to database
      const response = await fetch('/api/pricing/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quote)
      });

      if (response.ok) {
        const savedQuote = await response.json();
        setGeneratedQuote(savedQuote);
        setShowQuoteSuccess(true);
        
        // Hide success message after 5 seconds
        setTimeout(() => setShowQuoteSuccess(false), 5000);
      }
    } catch (error) {
      console.error('Failed to save quote:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                💰 LYD Preiskalkulator
              </h1>
              <p className="text-gray-600 mt-1">
                Erstellen Sie maßgeschneiderte Angebote für Ihre Immobilien-Marketing-Services
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Link href="/pricing/quotes">
                <LdsButton variant="outline">
                  📄 Gespeicherte Angebote
                </LdsButton>
              </Link>
              <Link href="/pricing/templates">
                <LdsButton variant="outline">
                  📋 Vorlagen
                </LdsButton>
              </Link>
            </div>
          </div>

          {/* Success Message */}
          {showQuoteSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="text-green-600 text-xl mr-3">✅</div>
                <div>
                  <h4 className="font-semibold text-green-800">Angebot erfolgreich erstellt!</h4>
                  <p className="text-green-700 text-sm">
                    Das Angebot wurde gespeichert und kann jetzt versendet oder bearbeitet werden.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Basis-Paket</p>
                    <p className="text-2xl font-bold text-gray-900">999€</p>
                    <p className="text-xs text-gray-500">Ab Preis</p>
                  </div>
                  <div className="text-3xl">📦</div>
                </div>
              </LdsCardContent>
            </LdsCard>
            
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Premium-Paket</p>
                    <p className="text-2xl font-bold text-gray-900">1.799€</p>
                    <p className="text-xs text-gray-500">Empfohlen</p>
                  </div>
                  <div className="text-3xl">⭐</div>
                </div>
              </LdsCardContent>
            </LdsCard>
            
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Enterprise-Paket</p>
                    <p className="text-2xl font-bold text-gray-900">3.499€</p>
                    <p className="text-xs text-gray-500">Vollservice</p>
                  </div>
                  <div className="text-3xl">🚀</div>
                </div>
              </LdsCardContent>
            </LdsCard>
            
            <LdsCard>
              <LdsCardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Zusatz-Module</p>
                    <p className="text-2xl font-bold text-gray-900">15+</p>
                    <p className="text-xs text-gray-500">Verfügbar</p>
                  </div>
                  <div className="text-3xl">🧩</div>
                </div>
              </LdsCardContent>
            </LdsCard>
          </div>

          {/* Pricing Calculator */}
          <PricingCalculator
            onQuoteGenerated={handleQuoteGenerated}
          />

          {/* Featured Modules */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🌟 Beliebte Zusatzmodule</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">📷</span>
                    <div>
                      <h4 className="font-semibold">Professionelle Fotografie</h4>
                      <p className="text-sm text-gray-600">Ab 450€</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Hochwertige Immobilienfotografie durch zertifizierte Fotografen
                  </p>
                  <LdsBadge variant="warning" size="sm" className="mt-2">
                    Meist gewählt
                  </LdsBadge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <h4 className="font-semibold">360°-Rundgang</h4>
                      <p className="text-sm text-gray-600">Ab 399€</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Interaktiver virtueller Rundgang durch die Immobilie
                  </p>
                  <LdsBadge variant="success" size="sm" className="mt-2">
                    Empfohlen
                  </LdsBadge>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">⚖️</span>
                    <div>
                      <h4 className="font-semibold">Rechtliche Prüfung</h4>
                      <p className="text-sm text-gray-600">Ab 899€</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Umfassende rechtliche Überprüfung aller Unterlagen
                  </p>
                  <LdsBadge variant="info" size="sm" className="mt-2">
                    Premium
                  </LdsBadge>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Why Choose LYD */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>✨ Warum LYD Live Your Dreams?</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">🎯 Unsere Vorteile</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Transparente Preisgestaltung ohne versteckte Kosten</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Modulares System - Sie zahlen nur was Sie brauchen</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Professionelle Partner-Netzwerke (TÜV, Anwälte, Fotografen)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>DSGVO-konforme Abwicklung und Datenschutz</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Schnelle Bearbeitung und kurze Lieferzeiten</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">🏆 Service-Qualität</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Kundenzufriedenheit</span>
                      <span className="font-semibold text-green-600">98%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Durchschnittliche Lieferzeit</span>
                      <span className="font-semibold text-blue-600">5-7 Tage</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Erfolgreiche Projekte</span>
                      <span className="font-semibold text-purple-600">500+</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Partner-Netzwerk</span>
                      <span className="font-semibold text-orange-600">50+</span>
                    </div>
                  </div>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>

          {/* Contact & Support */}
          <LdsCard>
            <LdsCardHeader>
              <LdsCardTitle>🤝 Haben Sie Fragen?</LdsCardTitle>
            </LdsCardHeader>
            <LdsCardContent>
              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  Unser Expertenteam steht Ihnen gerne für eine persönliche Beratung zur Verfügung.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl mb-2">📞</div>
                    <h4 className="font-semibold">Telefonberatung</h4>
                    <p className="text-sm text-gray-600">Mo-Fr: 9-18 Uhr</p>
                    <p className="text-sm text-blue-600">+49 89 123 456 789</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">📧</div>
                    <h4 className="font-semibold">E-Mail Support</h4>
                    <p className="text-sm text-gray-600">Antwort innerhalb 24h</p>
                    <p className="text-sm text-blue-600">pricing@lyd.com</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <h4 className="font-semibold">Live Chat</h4>
                    <p className="text-sm text-gray-600">Sofortige Hilfe</p>
                    <p className="text-sm text-blue-600">Online verfügbar</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <LdsButton variant="outline">
                    📞 Rückruf anfordern
                  </LdsButton>
                  <LdsButton>
                    💬 Live Chat starten
                  </LdsButton>
                </div>
              </div>
            </LdsCardContent>
          </LdsCard>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  LdsCard,
  LdsCardHeader,
  LdsCardTitle,
  LdsCardContent,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

/**
 * Cookie Categories
 */
type CookieCategory = 'necessary' | 'analytics' | 'marketing' | 'preferences';

interface CookieConsent {
  necessary: boolean;    // Always true, cannot be disabled
  analytics: boolean;    // Google Analytics, etc.
  marketing: boolean;    // Facebook Pixel, Google Ads
  preferences: boolean;  // UI preferences, language
}

interface ConsentManagerProps {
  /**
   * Callback when consent is saved
   */
  onConsentChange?: (consent: CookieConsent) => void;
  
  /**
   * Show as banner (first visit) or settings modal
   */
  mode?: 'banner' | 'settings';
  
  /**
   * Force show even if consent already given
   */
  forceShow?: boolean;
}

/**
 * Cookie Details Configuration
 */
const COOKIE_CATEGORIES = {
  necessary: {
    title: 'Notwendige Cookies',
    description: 'Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.',
    cookies: [
      {
        name: 'next-auth.session-token',
        purpose: 'Benutzeranmeldung',
        duration: '30 Tage',
        provider: 'Live Your Dreams'
      },
      {
        name: 'next-auth.csrf-token',
        purpose: 'Sicherheit gegen CSRF-Angriffe',
        duration: 'Session',
        provider: 'Live Your Dreams'
      }
    ]
  },
  
  analytics: {
    title: 'Analyse-Cookies',
    description: 'Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren.',
    cookies: [
      {
        name: '_ga',
        purpose: 'Google Analytics - Benutzeridentifikation',
        duration: '2 Jahre',
        provider: 'Google'
      },
      {
        name: '_ga_*',
        purpose: 'Google Analytics - Session-Daten',
        duration: '2 Jahre',
        provider: 'Google'
      }
    ]
  },
  
  marketing: {
    title: 'Marketing-Cookies',
    description: 'Diese Cookies werden für Werbung und Conversion-Tracking verwendet.',
    cookies: [
      {
        name: '_fbp',
        purpose: 'Facebook Pixel - Conversion-Tracking',
        duration: '3 Monate',
        provider: 'Meta/Facebook'
      },
      {
        name: '_gcl_au',
        purpose: 'Google Ads - Conversion-Tracking',
        duration: '90 Tage',
        provider: 'Google'
      }
    ]
  },
  
  preferences: {
    title: 'Präferenz-Cookies',
    description: 'Diese Cookies speichern Ihre Einstellungen und Präferenzen.',
    cookies: [
      {
        name: 'lyd_theme',
        purpose: 'Dark/Light Mode Einstellung',
        duration: '1 Jahr',
        provider: 'Live Your Dreams'
      },
      {
        name: 'lyd_language',
        purpose: 'Sprach-Präferenz',
        duration: '1 Jahr',
        provider: 'Live Your Dreams'
      }
    ]
  }
} as const;

/**
 * ConsentManager Component
 * 
 * DSGVO-konformer Cookie Consent Manager mit:
 * - Granulare Kontrolle über Cookie-Kategorien
 * - Detaillierte Cookie-Informationen
 * - Einfaches Opt-Out
 * - Consent-Protokollierung
 */
export function ConsentManager({
  onConsentChange,
  mode = 'banner',
  forceShow = false
}: ConsentManagerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  /**
   * Load existing consent from localStorage
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedConsent = localStorage.getItem('lyd_cookie_consent');
    const consentTimestamp = localStorage.getItem('lyd_consent_timestamp');
    
    if (savedConsent && consentTimestamp && !forceShow) {
      // Check if consent is still valid (12 months)
      const consentAge = Date.now() - parseInt(consentTimestamp);
      const isValid = consentAge < 365 * 24 * 60 * 60 * 1000; // 1 year
      
      if (isValid) {
        const parsedConsent = JSON.parse(savedConsent);
        setConsent(parsedConsent);
        applyConsent(parsedConsent);
        return;
      }
    }
    
    // Show consent manager if no valid consent
    setIsVisible(true);
  }, [forceShow]);

  /**
   * Apply consent to actual tracking scripts
   */
  const applyConsent = (consentData: CookieConsent) => {
    if (typeof window === 'undefined') return;

    // Google Analytics
    if (consentData.analytics) {
      // Enable Google Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('consent', 'update', {
          analytics_storage: 'granted'
        });
      }
    } else {
      // Disable Google Analytics
      if (typeof window.gtag !== 'undefined') {
        window.gtag('consent', 'update', {
          analytics_storage: 'denied'
        });
      }
      
      // Remove existing GA cookies
      document.cookie.split(";").forEach(cookie => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name.startsWith('_ga')) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        }
      });
    }

    // Facebook Pixel
    if (consentData.marketing) {
      // Enable Facebook Pixel
      if (typeof window.fbq !== 'undefined') {
        window.fbq('consent', 'grant');
      }
    } else {
      // Disable Facebook Pixel
      if (typeof window.fbq !== 'undefined') {
        window.fbq('consent', 'revoke');
      }
      
      // Remove existing Facebook cookies
      document.cookie = '_fbp=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      document.cookie = '_fbc=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    }

    // Marketing Cookies (Google Ads)
    if (typeof window.gtag !== 'undefined') {
      window.gtag('consent', 'update', {
        ad_storage: consentData.marketing ? 'granted' : 'denied',
        ad_user_data: consentData.marketing ? 'granted' : 'denied',
        ad_personalization: consentData.marketing ? 'granted' : 'denied'
      });
    }
  };

  /**
   * Save consent choice
   */
  const saveConsent = (consentData: CookieConsent, source: 'accept_all' | 'accept_selected' | 'reject_all') => {
    if (typeof window === 'undefined') return;

    // Save to localStorage
    localStorage.setItem('lyd_cookie_consent', JSON.stringify(consentData));
    localStorage.setItem('lyd_consent_timestamp', Date.now().toString());
    localStorage.setItem('lyd_consent_source', source);

    // Apply consent
    applyConsent(consentData);

    // Update state
    setConsent(consentData);
    setIsVisible(false);

    // Callback
    onConsentChange?.(consentData);

    // Log consent (for GDPR compliance)
    console.log('Cookie consent saved:', {
      consent: consentData,
      source,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    });
  };

  /**
   * Accept all cookies
   */
  const acceptAll = () => {
    const allConsent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    saveConsent(allConsent, 'accept_all');
  };

  /**
   * Reject all optional cookies
   */
  const rejectAll = () => {
    const minimalConsent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    saveConsent(minimalConsent, 'reject_all');
  };

  /**
   * Save individual selections
   */
  const saveSelectedConsent = () => {
    saveConsent(consent, 'accept_selected');
  };

  /**
   * Toggle category consent
   */
  const toggleCategory = (category: CookieCategory) => {
    if (category === 'necessary') return; // Cannot disable necessary cookies
    
    setConsent(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!isVisible && mode === 'banner') return null;

  /**
   * Banner Mode (first visit)
   */
  if (mode === 'banner') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🍪 Cookie-Einstellungen
              </h3>
              <p className="text-gray-600 text-sm">
                Wir verwenden Cookies, um Ihnen die bestmögliche Erfahrung auf unserer Website zu bieten. 
                Notwendige Cookies sind immer aktiv. Sie können optional weitere Kategorien aktivieren.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <LdsButton
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(true)}
              >
                ⚙️ Einstellungen
              </LdsButton>
              
              <LdsButton
                variant="outline"
                size="sm"
                onClick={rejectAll}
              >
                ❌ Ablehnen
              </LdsButton>
              
              <LdsButton
                variant="primary"
                size="sm"
                onClick={acceptAll}
              >
                ✅ Alle akzeptieren
              </LdsButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Settings Mode (detailed view)
   */
  return (
    <>
      {/* Backdrop */}
      {(showDetails || mode === 'settings') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-90vh overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Cookie-Einstellungen
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Introduction */}
              <div>
                <p className="text-gray-600">
                  Diese Website verwendet Cookies und ähnliche Technologien, um Ihnen 
                  die bestmögliche Nutzererfahrung zu bieten. Sie können die Verwendung 
                  von Cookies kategorieweise steuern.
                </p>
              </div>

              {/* Cookie Categories */}
              {Object.entries(COOKIE_CATEGORIES).map(([categoryKey, categoryData]) => {
                const category = categoryKey as CookieCategory;
                const isEnabled = consent[category];
                const isNecessary = category === 'necessary';
                
                return (
                  <LdsCard key={category}>
                    <LdsCardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <LdsCardTitle>{categoryData.title}</LdsCardTitle>
                            <LdsBadge variant={isEnabled ? 'success' : 'default'}>
                              {isEnabled ? 'Aktiv' : 'Inaktiv'}
                            </LdsBadge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {categoryData.description}
                          </p>
                        </div>
                        
                        <div className="ml-4">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => toggleCategory(category)}
                              disabled={isNecessary}
                              className="sr-only"
                            />
                            <div className={`
                              relative w-12 h-6 rounded-full transition-colors
                              ${isEnabled ? 'bg-blue-600' : 'bg-gray-300'}
                              ${isNecessary ? 'opacity-50' : 'hover:opacity-80'}
                            `}>
                              <div className={`
                                absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                                ${isEnabled ? 'transform translate-x-6' : ''}
                              `} />
                            </div>
                          </label>
                        </div>
                      </div>
                    </LdsCardHeader>
                    
                    <LdsCardContent>
                      <div className="space-y-3">
                        {categoryData.cookies.map((cookie, index) => (
                          <div key={index} className="border rounded-lg p-3 text-sm">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              <div>
                                <span className="font-medium text-gray-700">Name:</span>
                                <br />
                                <code className="text-xs bg-gray-100 px-1 rounded">
                                  {cookie.name}
                                </code>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Zweck:</span>
                                <br />
                                <span className="text-gray-600">{cookie.purpose}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Gültigkeitsdauer:</span>
                                <br />
                                <span className="text-gray-600">{cookie.duration}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Anbieter:</span>
                                <br />
                                <span className="text-gray-600">{cookie.provider}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </LdsCardContent>
                  </LdsCard>
                );
              })}

              {/* Legal Information */}
              <div className="bg-blue-50 p-4 rounded-lg text-sm">
                <h4 className="font-semibold text-blue-900 mb-2">
                  📋 Rechtliche Grundlagen
                </h4>
                <ul className="text-blue-800 space-y-1">
                  <li>• <strong>DSGVO Art. 6 Abs. 1 lit. a:</strong> Einwilligung für Marketing und Analytics</li>
                  <li>• <strong>DSGVO Art. 6 Abs. 1 lit. f:</strong> Berechtigte Interessen für notwendige Cookies</li>
                  <li>• <strong>§ 25 TTDSG:</strong> Einwilligung für nicht-notwendige Cookies</li>
                  <li>• <strong>Widerruf:</strong> Jederzeit über diese Einstellungen möglich</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <LdsButton
                  variant="outline"
                  onClick={rejectAll}
                  className="flex-1"
                >
                  ❌ Alle ablehnen
                </LdsButton>
                
                <LdsButton
                  variant="primary"
                  onClick={saveSelectedConsent}
                  className="flex-1"
                >
                  💾 Auswahl speichern
                </LdsButton>
                
                <LdsButton
                  variant="primary"
                  onClick={acceptAll}
                  className="flex-1"
                >
                  ✅ Alle akzeptieren
                </LdsButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

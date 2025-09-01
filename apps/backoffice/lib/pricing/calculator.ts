/**
 * LYD Pricing Calculator
 * 
 * Flexible pricing system supporting:
 * - Base packages (Basis, Premium, Enterprise)
 * - Additional modules (Photography, Legal, Marketing)
 * - Property type multipliers
 * - Regional pricing adjustments
 * - Volume discounts
 */

export type PropertyType = 'WOHNUNG' | 'HAUS' | 'REIHENHAUS' | 'DOPPELHAUS' | 'MEHRFAMILIENHAUS' | 'GEWERBE';
export type PricingTier = 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
export type Region = 'MUENCHEN' | 'BAYERN' | 'DEUTSCHLAND' | 'EUROPA';

export interface PricingModule {
  id: string;
  name: string;
  description: string;
  category: 'MEDIA' | 'LEGAL' | 'MARKETING' | 'SERVICE' | 'TECHNICAL';
  basePrice: number; // in cents
  pricePerM2?: number; // optional per-sqm pricing
  oneTime: boolean;
  recommended: boolean;
  requiredForTier?: PricingTier[];
  icon: string;
  estimatedDeliveryDays: number;
  externalProvider?: string;
  features: string[];
}

export interface PropertySpecs {
  type: PropertyType;
  livingArea?: number;
  totalArea?: number;
  roomCount?: number;
  region: Region;
  luxuryClass?: 'STANDARD' | 'PREMIUM' | 'LUXURY';
}

export interface PricingCalculation {
  basePackage: {
    tier: PricingTier;
    name: string;
    price: number;
    features: string[];
  };
  modules: Array<{
    module: PricingModule;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
  }>;
  adjustments: Array<{
    type: 'PROPERTY_TYPE' | 'REGION' | 'SIZE' | 'VOLUME' | 'LUXURY' | 'DISCOUNT';
    factor: number;
    amount: number;
    description: string;
  }>;
  subtotal: number;
  totalAdjustments: number;
  tax: number;
  total: number;
  currency: 'EUR';
  validUntil: Date;
  estimatedDelivery: {
    min: number;
    max: number;
    unit: 'days';
  };
}

// Base package definitions
export const BASE_PACKAGES: Record<PricingTier, {
  name: string;
  price: number;
  features: string[];
  description: string;
}> = {
  BASIC: {
    name: 'LYD Basis',
    price: 99900, // 999.00 EUR
    description: 'Grundausstattung für den digitalen Immobilienverkauf',
    features: [
      'Responsive Microsite mit eigenem Design',
      'Professionelle Immobilien-Präsentation',
      'Grundriss-Upload und -Anzeige',
      'Kontaktformular mit Lead-Management',
      'DSGVO-konforme Datenverarbeitung',
      'Energieausweis-Integration (GEG § 87)',
      'Mobile Optimierung',
      'SEO-Grundoptimierung',
      '30 Tage kostenloser Support'
    ]
  },
  PREMIUM: {
    name: 'LYD Premium',
    price: 179900, // 1799.00 EUR
    description: 'Erweiterte Funktionen für anspruchsvolle Immobilienpräsentationen',
    features: [
      'Alle Basis-Features',
      '360°-Rundgang Integration',
      'Professionelle Immobilienfotografie (bis 20 Bilder)',
      'Virtual Staging für 2 Räume',
      'Social Media Paket (Facebook, Instagram)',
      'ImmobilienScout24 Premium-Integration',
      'Advanced Analytics & Reporting',
      'Custom Domain (optional)',
      '90 Tage Premium Support',
      'Nachbearbeitung inklusive'
    ]
  },
  ENTERPRISE: {
    name: 'LYD Enterprise',
    price: 349900, // 3499.00 EUR
    description: 'Vollservice-Lösung für hochwertige Immobilienprojekte',
    features: [
      'Alle Premium-Features',
      'Professioneller Drohneneinsatz',
      'Architekturfotografie (bis 50 Bilder)',
      'Virtual Staging für alle Räume',
      'Print-Marketing Materialien',
      'TÜV-geprüfte Immobiliendokumentation',
      'Rechtliche Prüfung durch Immobilienexperten',
      'Multi-Portal-Publishing (alle großen Portale)',
      'Persönlicher Account Manager',
      '12 Monate Premium Support',
      'Prioritäts-Bearbeitung'
    ]
  }
};

// Available pricing modules
export const PRICING_MODULES: PricingModule[] = [
  // Media & Photography
  {
    id: 'PROF_PHOTOGRAPHY',
    name: 'Professionelle Fotografie',
    description: 'Hochwertige Immobilienfotografie durch zertifizierte Fotografen',
    category: 'MEDIA',
    basePrice: 45000, // 450 EUR
    pricePerM2: 300, // 3 EUR pro m²
    oneTime: true,
    recommended: true,
    icon: '📷',
    estimatedDeliveryDays: 3,
    externalProvider: 'LYD Photography Partner',
    features: [
      'Bis zu 25 hochauflösende Fotos',
      'HDR-Bearbeitung für optimale Lichtverhältnisse',
      'Weitwinkel-Aufnahmen für größere Raumwirkung',
      'Professionelle Nachbearbeitung',
      'Lieferung in verschiedenen Größen und Formaten'
    ]
  },
  {
    id: 'DRONE_PHOTOGRAPHY',
    name: 'Drohnenfotografie',
    description: 'Luftaufnahmen für beeindruckende Perspektiven',
    category: 'MEDIA',
    basePrice: 25000, // 250 EUR
    oneTime: true,
    recommended: false,
    requiredForTier: ['ENTERPRISE'],
    icon: '🚁',
    estimatedDeliveryDays: 2,
    externalProvider: 'LYD Drone Services',
    features: [
      '5-10 Luftaufnahmen aus verschiedenen Perspektiven',
      '4K-Video-Überflug (30 Sekunden)',
      'Umgebungsaufnahmen',
      'Professionelle Pilotenlizenz'
    ]
  },
  {
    id: 'VIRTUAL_360',
    name: '360°-Rundgang',
    description: 'Interaktiver virtueller Rundgang durch die Immobilie',
    category: 'MEDIA',
    basePrice: 39900, // 399 EUR
    pricePerM2: 200, // 2 EUR pro m² für größere Objekte
    oneTime: true,
    recommended: true,
    icon: '🌐',
    estimatedDeliveryDays: 5,
    features: [
      'Vollsphärische 360°-Aufnahmen aller Räume',
      'Interaktive Navigation',
      'Hotspot-Integration für zusätzliche Informationen',
      'Mobile und VR-Kompatibilität',
      'Einbettung in Microsite'
    ]
  },
  {
    id: 'VIRTUAL_STAGING',
    name: 'Virtual Staging',
    description: 'Digitale Möblierung leerer Räume',
    category: 'MEDIA',
    basePrice: 15000, // 150 EUR pro Raum
    oneTime: true,
    recommended: true,
    icon: '🏠',
    estimatedDeliveryDays: 3,
    features: [
      'Realistische Möblierung und Dekoration',
      'Verschiedene Einrichtungsstile wählbar',
      'Hochwertige 3D-Rendering-Qualität',
      'Optimiert für bessere Verkaufschancen'
    ]
  },

  // Legal & Compliance
  {
    id: 'LEGAL_REVIEW',
    name: 'Rechtliche Prüfung',
    description: 'Umfassende rechtliche Überprüfung aller Unterlagen',
    category: 'LEGAL',
    basePrice: 89900, // 899 EUR
    oneTime: true,
    recommended: true,
    requiredForTier: ['ENTERPRISE'],
    icon: '⚖️',
    estimatedDeliveryDays: 7,
    externalProvider: 'Partnerkanzlei für Immobilienrecht',
    features: [
      'Prüfung aller Verkaufsunterlagen',
      'Grundbuch-Analyse',
      'Energieausweis-Validierung',
      'Vertragsreview',
      'Rechtsgutachten (5 Seiten)',
      'Haftungsübernahme bis 50.000 EUR'
    ]
  },
  {
    id: 'TUV_INSPECTION',
    name: 'TÜV-Gebäudecheck',
    description: 'Professionelle Gebäudeinspektion durch TÜV-zertifizierte Experten',
    category: 'LEGAL',
    basePrice: 129900, // 1299 EUR
    pricePerM2: 500, // 5 EUR pro m² für größere Objekte
    oneTime: true,
    recommended: true,
    icon: '🔍',
    estimatedDeliveryDays: 10,
    externalProvider: 'TÜV Süd / TÜV Nord',
    features: [
      'Vollständige Gebäudeinspektion',
      'Prüfung der Bausubstanz',
      'Energieeffizienz-Bewertung',
      'Sicherheitscheck (Elektrik, Gas, Wasser)',
      'Offizielles TÜV-Zertifikat',
      'Digitaler Prüfbericht (15-20 Seiten)'
    ]
  },

  // Marketing Services
  {
    id: 'SOCIAL_MEDIA',
    name: 'Social Media Marketing',
    description: 'Professionelle Bewerbung auf Facebook, Instagram und Co.',
    category: 'MARKETING',
    basePrice: 29900, // 299 EUR
    oneTime: true,
    recommended: false,
    icon: '📱',
    estimatedDeliveryDays: 2,
    features: [
      'Facebook und Instagram Kampagne',
      'Professionelle Post-Erstellung',
      '30 Tage Laufzeit',
      'Zielgruppen-Targeting',
      'Performance-Reporting'
    ]
  },
  {
    id: 'PRINT_MATERIALS',
    name: 'Print-Marketing',
    description: 'Hochwertige Druckmaterialien für die Immobilienpräsentation',
    category: 'MARKETING',
    basePrice: 19900, // 199 EUR
    oneTime: true,
    recommended: false,
    requiredForTier: ['ENTERPRISE'],
    icon: '🖨️',
    estimatedDeliveryDays: 5,
    features: [
      '50 Premium-Exposés (A4, 4-seitig)',
      '10 großformatige Poster (A3)',
      'Professioneller Druck auf Qualitätspapier',
      'Logobranding optional',
      'Expressversand inklusive'
    ]
  },

  // Technical Services
  {
    id: 'CUSTOM_DOMAIN',
    name: 'Eigene Domain',
    description: 'Personalisierte Webadresse für die Microsite',
    category: 'TECHNICAL',
    basePrice: 9900, // 99 EUR pro Jahr
    oneTime: false,
    recommended: false,
    icon: '🌐',
    estimatedDeliveryDays: 1,
    features: [
      'Eigene Domain-Registrierung',
      'SSL-Zertifikat inklusive',
      'DNS-Management',
      'E-Mail-Weiterleitung (optional)',
      '12 Monate Laufzeit'
    ]
  },
  {
    id: 'PREMIUM_SUPPORT',
    name: 'Premium Support',
    description: 'Erweiterte Betreuung und priorisierter Support',
    category: 'SERVICE',
    basePrice: 19900, // 199 EUR für 6 Monate
    oneTime: false,
    recommended: false,
    icon: '🎧',
    estimatedDeliveryDays: 0,
    features: [
      'Direkter Kontakt zum Account Manager',
      'Telefon-Support (Mo-Fr, 8-18 Uhr)',
      'Prioritäre Bearbeitung von Anfragen',
      'Monatliche Leistungsberichte',
      '6 Monate Laufzeit'
    ]
  }
];

// Property type multipliers
const PROPERTY_TYPE_MULTIPLIERS: Record<PropertyType, number> = {
  WOHNUNG: 1.0,
  HAUS: 1.15,
  REIHENHAUS: 1.1,
  DOPPELHAUS: 1.2,
  MEHRFAMILIENHAUS: 1.3,
  GEWERBE: 1.4
};

// Regional pricing adjustments
const REGION_MULTIPLIERS: Record<Region, number> = {
  MUENCHEN: 1.15, // München premium
  BAYERN: 1.05,   // Bayern standard
  DEUTSCHLAND: 1.0, // Base pricing
  EUROPA: 1.2     // International premium
};

/**
 * Calculate pricing for a property and selected modules
 */
export function calculatePricing(
  tier: PricingTier,
  selectedModules: Array<{ moduleId: string; quantity?: number }>,
  propertySpecs: PropertySpecs
): PricingCalculation {
  const basePackage = BASE_PACKAGES[tier];
  let subtotal = basePackage.price;
  
  const modules: PricingCalculation['modules'] = [];
  const adjustments: PricingCalculation['adjustments'] = [];
  
  // Calculate module costs
  for (const selected of selectedModules) {
    const module = PRICING_MODULES.find(m => m.id === selected.moduleId);
    if (!module) continue;
    
    const quantity = selected.quantity || 1;
    let unitPrice = module.basePrice;
    
    // Add per-sqm pricing if applicable
    if (module.pricePerM2 && propertySpecs.livingArea) {
      const areaPrice = module.pricePerM2 * propertySpecs.livingArea;
      unitPrice += areaPrice;
    }
    
    const totalPrice = unitPrice * quantity;
    
    modules.push({
      module,
      quantity,
      unitPrice,
      totalPrice,
      notes: module.pricePerM2 && propertySpecs.livingArea 
        ? `Inkl. ${(module.pricePerM2 / 100).toFixed(2)}€/m² für ${propertySpecs.livingArea}m²`
        : undefined
    });
    
    subtotal += totalPrice;
  }
  
  // Property type adjustment
  const propertyMultiplier = PROPERTY_TYPE_MULTIPLIERS[propertySpecs.type];
  if (propertyMultiplier !== 1.0) {
    const adjustment = subtotal * (propertyMultiplier - 1);
    adjustments.push({
      type: 'PROPERTY_TYPE',
      factor: propertyMultiplier,
      amount: adjustment,
      description: `Objektart-Zuschlag: ${propertySpecs.type}`
    });
    subtotal += adjustment;
  }
  
  // Regional adjustment
  const regionMultiplier = REGION_MULTIPLIERS[propertySpecs.region];
  if (regionMultiplier !== 1.0) {
    const adjustment = subtotal * (regionMultiplier - 1);
    adjustments.push({
      type: 'REGION',
      factor: regionMultiplier,
      amount: adjustment,
      description: `Regionale Anpassung: ${propertySpecs.region}`
    });
    subtotal += adjustment;
  }
  
  // Luxury class adjustment
  if (propertySpecs.luxuryClass === 'LUXURY') {
    const adjustment = subtotal * 0.25; // 25% premium for luxury properties
    adjustments.push({
      type: 'LUXURY',
      factor: 1.25,
      amount: adjustment,
      description: 'Luxusimmobilien-Zuschlag'
    });
    subtotal += adjustment;
  } else if (propertySpecs.luxuryClass === 'PREMIUM') {
    const adjustment = subtotal * 0.1; // 10% premium
    adjustments.push({
      type: 'LUXURY',
      factor: 1.1,
      amount: adjustment,
      description: 'Premium-Objektzuschlag'
    });
    subtotal += adjustment;
  }
  
  // Size-based adjustments for very large properties
  if (propertySpecs.livingArea && propertySpecs.livingArea > 300) {
    const adjustment = subtotal * 0.15; // 15% surcharge for 300m²+
    adjustments.push({
      type: 'SIZE',
      factor: 1.15,
      amount: adjustment,
      description: `Großobjekt-Zuschlag (>${propertySpecs.livingArea}m²)`
    });
    subtotal += adjustment;
  }
  
  // Calculate tax (19% VAT)
  const tax = subtotal * 0.19;
  const total = subtotal + tax;
  const totalAdjustments = adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  
  // Calculate estimated delivery time
  const deliveryDays = modules.length > 0 
    ? Math.max(...modules.map(m => m.module.estimatedDeliveryDays))
    : 7; // Base package delivery
  
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 30); // 30 days validity
  
  return {
    basePackage: {
      tier,
      name: basePackage.name,
      price: basePackage.price,
      features: basePackage.features
    },
    modules,
    adjustments,
    subtotal,
    totalAdjustments,
    tax,
    total,
    currency: 'EUR',
    validUntil,
    estimatedDelivery: {
      min: deliveryDays,
      max: deliveryDays + 3,
      unit: 'days'
    }
  };
}

/**
 * Get recommendations based on property specs and tier
 */
export function getRecommendedModules(
  tier: PricingTier,
  propertySpecs: PropertySpecs
): PricingModule[] {
  const recommended = PRICING_MODULES.filter(module => {
    // Always include tier-required modules
    if (module.requiredForTier?.includes(tier)) return true;
    
    // Include recommended modules for appropriate tiers
    if (module.recommended) {
      if (tier === 'BASIC' && ['VIRTUAL_360', 'PROF_PHOTOGRAPHY'].includes(module.id)) {
        return true;
      }
      if (tier === 'PREMIUM' && !['TUV_INSPECTION', 'LEGAL_REVIEW'].includes(module.id)) {
        return true;
      }
      if (tier === 'ENTERPRISE') return true;
    }
    
    return false;
  });
  
  // Add property-specific recommendations
  if (propertySpecs.type === 'GEWERBE') {
    const legalModule = PRICING_MODULES.find(m => m.id === 'LEGAL_REVIEW');
    if (legalModule && !recommended.includes(legalModule)) {
      recommended.push(legalModule);
    }
  }
  
  if (propertySpecs.luxuryClass === 'LUXURY') {
    const droneModule = PRICING_MODULES.find(m => m.id === 'DRONE_PHOTOGRAPHY');
    if (droneModule && !recommended.includes(droneModule)) {
      recommended.push(droneModule);
    }
  }
  
  return recommended;
}

/**
 * Format price in EUR with proper locale
 */
export function formatPrice(priceInCents: number, locale = 'de-DE'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(priceInCents / 100);
}

/**
 * Get volume discount for multiple properties
 */
export function calculateVolumeDiscount(propertyCount: number): number {
  if (propertyCount >= 10) return 0.2; // 20% for 10+
  if (propertyCount >= 5) return 0.15; // 15% for 5-9
  if (propertyCount >= 3) return 0.1;  // 10% for 3-4
  return 0; // No discount for 1-2
}

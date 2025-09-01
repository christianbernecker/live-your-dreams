import { z } from 'zod';

/**
 * GEG § 87 Energieausweis Validierung
 * 
 * Pflichtangaben für Verkaufs-/Vermietungsanzeigen:
 * - Energietyp (Verbrauch/Bedarf)
 * - Energiekennwert in kWh/(m²·a)
 * - Effizienzklasse (A+ bis H)
 * - Energieträger
 * - Art des Energieausweises
 * - Ausstellungsjahr
 * - Gültigkeit
 */

// Erlaubte Effizienzklassen nach EnEV/GEG
export const ENERGY_CLASSES = [
  'A+', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'
] as const;

// Standard Energieträger
export const ENERGY_CARRIERS = [
  'Fernwärme',
  'Gas', 
  'Öl',
  'Strom',
  'Holz/Pellets',
  'Wärmepumpe',
  'Solar',
  'Kohle',
  'Sonstiger'
] as const;

/**
 * Energieausweis Validierung Schema
 * Validiert alle GEG § 87 Pflichtangaben
 */
export const energyCertificateSchema = z.object({
  // Basis-Pflichtangaben (immer erforderlich)
  energyType: z.enum(['Verbrauch', 'Bedarf'], {
    required_error: 'Energietyp ist eine Pflichtangabe gemäß GEG § 87',
    invalid_type_error: 'Energietyp muss "Verbrauch" oder "Bedarf" sein'
  }),
  
  energyValue: z.number()
    .positive('Energiekennwert muss positiv sein')
    .max(1000, 'Energiekennwert scheint unrealistisch hoch (>1000 kWh/m²·a)')
    .refine(val => val > 0, 'Energiekennwert ist Pflicht gemäß GEG § 87'),
  
  energyClass: z.enum(ENERGY_CLASSES, {
    required_error: 'Effizienzklasse ist Pflicht gemäß GEG § 87',
    invalid_type_error: 'Ungültige Effizienzklasse'
  }),
  
  energyCarrier: z.enum(ENERGY_CARRIERS, {
    required_error: 'Energieträger ist Pflicht gemäß GEG § 87'
  }),
  
  // Erweiterte Pflichtangaben
  energyCertType: z.enum(['Wohnung', 'Nichtwohngebäude'], {
    required_error: 'Art des Energieausweises ist erforderlich'
  }),
  
  energyCertIssueYear: z.number()
    .int('Ausstellungsjahr muss eine ganze Zahl sein')
    .min(2008, 'Energieausweise vor 2008 sind nicht mehr gültig')
    .max(new Date().getFullYear(), 'Ausstellungsjahr kann nicht in der Zukunft liegen'),
  
  energyCertValidUntil: z.date()
    .refine(date => date > new Date(), 'Energieausweis ist abgelaufen'),
  
  // Verbrauchsausweis spezifische Felder (bedingt erforderlich)
  heatingConsumption: z.number()
    .positive('Heizenergieverbrauch muss positiv sein')
    .optional(),
  
  hotWaterConsumption: z.number()
    .positive('Warmwasserverbrauch muss positiv sein') 
    .optional(),
  
  consumptionYears: z.string()
    .regex(/^\d{4}-\d{4}$/, 'Format: "2019-2021"')
    .optional()
    
}).superRefine((data, ctx) => {
  // Verbrauchsausweis: Zusätzliche Validierung
  if (data.energyType === 'Verbrauch') {
    if (!data.heatingConsumption) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Heizenergieverbrauch ist bei Verbrauchsausweisen Pflicht',
        path: ['heatingConsumption']
      });
    }
    
    if (!data.consumptionYears) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom, 
        message: 'Referenzzeitraum ist bei Verbrauchsausweisen Pflicht',
        path: ['consumptionYears']
      });
    }
    
    // Plausibilitätsprüfung Energiekennwert
    if (data.energyValue && data.heatingConsumption) {
      const totalConsumption = data.heatingConsumption + (data.hotWaterConsumption || 0);
      
      if (Math.abs(data.energyValue - totalConsumption) > 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Energiekennwert weicht stark von Einzelverbräuchen ab. Bitte prüfen.',
          path: ['energyValue']
        });
      }
    }
  }
  
  // Bedarfsausweis: Spezifische Validierung
  if (data.energyType === 'Bedarf') {
    // Bedarfsausweise haben typischerweise niedrigere Werte
    if (data.energyValue && data.energyValue > 400) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sehr hoher Energiebedarf. Bitte Eingabe prüfen.',
        path: ['energyValue']
      });
    }
  }
  
  // Gültigkeitsdatum vs Ausstellungsjahr
  if (data.energyCertValidUntil && data.energyCertIssueYear) {
    const issueDate = new Date(data.energyCertIssueYear, 0, 1);
    const maxValidUntil = new Date(data.energyCertIssueYear + 10, 0, 1); // 10 Jahre gültig
    
    if (data.energyCertValidUntil > maxValidUntil) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Energieausweise sind maximal 10 Jahre gültig',
        path: ['energyCertValidUntil']
      });
    }
  }
});

/**
 * Typ für validierten Energieausweis
 */
export type EnergyCertificate = z.infer<typeof energyCertificateSchema>;

/**
 * Partielle Validierung für Entwürfe
 * Erlaubt das Speichern unvollständiger Daten
 */
export const energyCertificateDraftSchema = energyCertificateSchema.deepPartial();

/**
 * Validierung für Veröffentlichung
 * Alle Pflichtfelder müssen vorhanden sein
 */
export const energyCertificatePublishSchema = energyCertificateSchema.required({
  energyType: true,
  energyValue: true, 
  energyClass: true,
  energyCarrier: true,
  energyCertType: true,
  energyCertIssueYear: true,
  energyCertValidUntil: true
});

/**
 * Helper: Berechne Effizienzklasse aus Energiekennwert
 * Orientiert an EnEV/GEG Grenzwerten für Wohngebäude
 */
export function calculateEnergyClass(energyValue: number, buildingType: 'Wohnung' | 'Nichtwohngebäude' = 'Wohnung'): typeof ENERGY_CLASSES[number] {
  if (buildingType === 'Nichtwohngebäude') {
    // Vereinfachte Klassifizierung für Nichtwohngebäude
    if (energyValue <= 50) return 'A+';
    if (energyValue <= 75) return 'A';
    if (energyValue <= 100) return 'B';
    if (energyValue <= 130) return 'C';
    if (energyValue <= 160) return 'D';
    if (energyValue <= 200) return 'E';
    if (energyValue <= 250) return 'F';
    if (energyValue <= 300) return 'G';
    return 'H';
  }
  
  // Wohngebäude (Standard-Klassifizierung)
  if (energyValue <= 30) return 'A+';
  if (energyValue <= 50) return 'A';
  if (energyValue <= 75) return 'B';
  if (energyValue <= 100) return 'C';
  if (energyValue <= 130) return 'D';
  if (energyValue <= 160) return 'E';
  if (energyValue <= 200) return 'F';
  if (energyValue <= 250) return 'G';
  return 'H';
}

/**
 * Helper: Prüfe ob Energieausweis noch gültig ist
 */
export function isEnergyCertificateValid(validUntil: Date): boolean {
  return validUntil > new Date();
}

/**
 * Helper: Berechne verbleibende Gültigkeitsdauer
 */
export function getValidityPeriod(validUntil: Date): { years: number; months: number; isExpired: boolean } {
  const now = new Date();
  const isExpired = validUntil <= now;
  
  if (isExpired) {
    return { years: 0, months: 0, isExpired: true };
  }
  
  const diffMs = validUntil.getTime() - now.getTime();
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  
  return { years, months, isExpired: false };
}

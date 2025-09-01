'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  LdsCard,
  LdsCardHeader,
  LdsCardTitle,
  LdsCardContent,
  LdsButton,
  LdsInput,
  LdsSelect,
  LdsBadge
} from '@liveyourdreams/design-system-react';

/**
 * Lead Qualification Schema
 */
const leadQualificationSchema = z.object({
  // Finanzielle Qualifikation
  budget: z.number().min(0).max(10000000).optional(),
  financing: z.enum(['CASH', 'MORTGAGE', 'MIXED', 'UNKNOWN']).default('UNKNOWN'),
  preApproved: z.boolean().default(false),
  
  // Timeline & Urgency
  timeframe: z.enum(['IMMEDIATE', 'WEEKS', 'MONTHS', 'YEAR_PLUS', 'UNKNOWN']).default('UNKNOWN'),
  urgency: z.number().min(1).max(5).default(3),
  
  // Requirements
  mustHaveFeatures: z.array(z.string()).default([]),
  niceToHaveFeatures: z.array(z.string()).default([]),
  dealBreakers: z.array(z.string()).default([]),
  
  // Decision Making
  decisionMaker: z.boolean().default(false),
  additionalParties: z.string().optional(),
  
  // Communication Preferences
  preferredContact: z.enum(['EMAIL', 'PHONE', 'WHATSAPP', 'MEETING']).default('EMAIL'),
  bestTimeToCall: z.string().optional(),
  
  // Lead Source Quality
  referralSource: z.string().optional(),
  previousInteractions: z.boolean().default(false),
  
  // Notes & Assessment
  notes: z.string().max(1000).optional(),
  internalNotes: z.string().max(1000).optional()
});

type LeadQualificationData = z.infer<typeof leadQualificationSchema>;

interface LeadQualificationProps {
  leadId: string;
  leadName: string;
  leadEmail: string;
  propertyTitle: string;
  propertyPrice: number;
  existingQualification?: Partial<LeadQualificationData>;
  onSave: (qualification: LeadQualificationData, score: number) => Promise<void>;
  onCancel: () => void;
}

/**
 * Available Features für Must-Have/Nice-To-Have
 */
const AVAILABLE_FEATURES = [
  'Balkon/Terrasse',
  'Garten',
  'Garage/Stellplatz',
  'Lift',
  'Keller',
  'Dachboden',
  'Fußbodenheizung',
  'Moderne Küche',
  'Renoviert',
  'Energieeffizient',
  'Zentrale Lage',
  'Ruhige Lage',
  'Nahverkehrsanbindung',
  'Schulen in der Nähe',
  'Einkaufsmöglichkeiten'
];

/**
 * LeadQualification Component
 * 
 * Erweiterte Lead-Qualifizierung mit:
 * - Finanzielle Bewertung
 * - Timeline-Assessment
 * - Feature-Matching
 * - Automatischem Scoring
 * - Decision-Maker Identifikation
 */
export function LeadQualification({
  leadId,
  leadName,
  leadEmail,
  propertyTitle,
  propertyPrice,
  existingQualification,
  onSave,
  onCancel
}: LeadQualificationProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<LeadQualificationData>({
    resolver: zodResolver(leadQualificationSchema),
    defaultValues: {
      budget: existingQualification?.budget || undefined,
      financing: existingQualification?.financing || 'UNKNOWN',
      preApproved: existingQualification?.preApproved || false,
      timeframe: existingQualification?.timeframe || 'UNKNOWN',
      urgency: existingQualification?.urgency || 3,
      mustHaveFeatures: existingQualification?.mustHaveFeatures || [],
      niceToHaveFeatures: existingQualification?.niceToHaveFeatures || [],
      dealBreakers: existingQualification?.dealBreakers || [],
      decisionMaker: existingQualification?.decisionMaker || false,
      preferredContact: existingQualification?.preferredContact || 'EMAIL',
      notes: existingQualification?.notes || '',
      internalNotes: existingQualification?.internalNotes || ''
    }
  });

  const watchedValues = watch();

  /**
   * Calculate Lead Score (0-100)
   */
  const calculateLeadScore = (data: LeadQualificationData): number => {
    let score = 0;
    
    // Budget Score (0-30 points)
    if (data.budget) {
      if (data.budget >= propertyPrice * 0.9) score += 30; // Can afford property
      else if (data.budget >= propertyPrice * 0.8) score += 25;
      else if (data.budget >= propertyPrice * 0.7) score += 20;
      else if (data.budget >= propertyPrice * 0.6) score += 15;
      else if (data.budget >= propertyPrice * 0.5) score += 10;
      else score += 5;
    } else {
      score += 10; // Neutral if budget unknown
    }
    
    // Financing Score (0-15 points)
    switch (data.financing) {
      case 'CASH': score += 15; break;
      case 'MORTGAGE': score += data.preApproved ? 15 : 10; break;
      case 'MIXED': score += data.preApproved ? 12 : 8; break;
      default: score += 5; break;
    }
    
    // Timeline Score (0-20 points)
    switch (data.timeframe) {
      case 'IMMEDIATE': score += 20; break;
      case 'WEEKS': score += 18; break;
      case 'MONTHS': score += 15; break;
      case 'YEAR_PLUS': score += 10; break;
      default: score += 8; break;
    }
    
    // Urgency Score (0-10 points)
    score += data.urgency * 2;
    
    // Decision Maker Score (0-15 points)
    if (data.decisionMaker) score += 15;
    else score += 5;
    
    // Communication Preference Score (0-5 points)
    switch (data.preferredContact) {
      case 'PHONE': score += 5; break;
      case 'MEETING': score += 5; break;
      case 'WHATSAPP': score += 4; break;
      default: score += 3; break;
    }
    
    // Deal Breakers Penalty (0 to -10 points)
    score -= Math.min(data.dealBreakers.length * 2, 10);
    
    // Referral Bonus (0-5 points)
    if (data.referralSource && data.referralSource.trim()) score += 5;
    if (data.previousInteractions) score += 3;
    
    return Math.max(0, Math.min(100, score));
  };

  // Update score when form values change
  React.useEffect(() => {
    const score = calculateLeadScore(watchedValues);
    setCurrentScore(score);
  }, [watchedValues, propertyPrice]);

  /**
   * Get score color and label
   */
  const getScoreDisplay = (score: number) => {
    if (score >= 80) return { color: 'success', label: 'Hot Lead 🔥', description: 'Sehr hohes Potenzial' };
    if (score >= 60) return { color: 'warning', label: 'Warm Lead 🌡️', description: 'Gutes Potenzial' };
    if (score >= 40) return { color: 'info', label: 'Cool Lead ❄️', description: 'Mittleres Potenzial' };
    return { color: 'default', label: 'Cold Lead 🧊', description: 'Niedriges Potenzial' };
  };

  /**
   * Handle feature selection
   */
  const toggleFeature = (feature: string, category: 'mustHaveFeatures' | 'niceToHaveFeatures' | 'dealBreakers') => {
    const currentFeatures = watchedValues[category] || [];
    const isSelected = currentFeatures.includes(feature);
    
    if (isSelected) {
      setValue(category, currentFeatures.filter(f => f !== feature));
    } else {
      setValue(category, [...currentFeatures, feature]);
    }
  };

  /**
   * Submit form
   */
  const onSubmit = async (data: LeadQualificationData) => {
    setIsSubmitting(true);
    
    try {
      const score = calculateLeadScore(data);
      await onSave(data, score);
    } catch (error) {
      console.error('Qualification save error:', error);
      alert('Fehler beim Speichern der Qualifikation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scoreDisplay = getScoreDisplay(currentScore);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead-Qualifikation</h2>
          <p className="text-gray-600 mt-1">
            Bewerten Sie das Potenzial von <strong>{leadName}</strong> für <strong>{propertyTitle}</strong>
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">{currentScore}</div>
          <LdsBadge variant={scoreDisplay.color as any}>
            {scoreDisplay.label}
          </LdsBadge>
          <div className="text-xs text-gray-500 mt-1">{scoreDisplay.description}</div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Financial Qualification */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>💰 Finanzielle Qualifikation</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LdsInput
                type="number"
                label="Budget (EUR)"
                {...register('budget', { valueAsNumber: true })}
                error={errors.budget?.message}
                placeholder="z.B. 750000"
                helpText={`Immobilienpreis: ${(propertyPrice / 100).toLocaleString('de-DE')} €`}
              />
              
              <LdsSelect
                label="Finanzierung"
                {...register('financing')}
                options={[
                  { value: 'CASH', label: '💵 Barkauf' },
                  { value: 'MORTGAGE', label: '🏦 Hypothek/Kredit' },
                  { value: 'MIXED', label: '🔄 Gemischt' },
                  { value: 'UNKNOWN', label: '❓ Unbekannt' }
                ]}
              />
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="preApproved"
                  {...register('preApproved')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="preApproved" className="text-sm font-medium text-gray-700">
                  ✅ Finanzierung vorgeprüft
                </label>
              </div>
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Timeline & Urgency */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>⏰ Zeitrahmen & Dringlichkeit</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LdsSelect
                label="Kaufzeitrahmen"
                {...register('timeframe')}
                options={[
                  { value: 'IMMEDIATE', label: '🚨 Sofort (0-2 Wochen)' },
                  { value: 'WEEKS', label: '⚡ Sehr bald (2-8 Wochen)' },
                  { value: 'MONTHS', label: '📅 In den nächsten Monaten' },
                  { value: 'YEAR_PLUS', label: '📆 Über ein Jahr' },
                  { value: 'UNKNOWN', label: '❓ Unbekannt' }
                ]}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dringlichkeit (1-5)
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map(value => (
                    <label key={value} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        {...register('urgency', { valueAsNumber: true })}
                        value={value}
                        className="sr-only"
                      />
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                        ${watchedValues.urgency === value 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }
                      `}>
                        {value}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  1 = Niedrig, 5 = Sehr hoch
                </div>
              </div>
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Requirements */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>🎯 Anforderungen</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="space-y-6">
              {/* Must-Have Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Muss-Haben Features:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_FEATURES.map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watchedValues.mustHaveFeatures?.includes(feature) || false}
                        onChange={() => toggleFeature(feature, 'mustHaveFeatures')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nice-To-Have Features */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Wünschenswert:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_FEATURES.map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watchedValues.niceToHaveFeatures?.includes(feature) || false}
                        onChange={() => toggleFeature(feature, 'niceToHaveFeatures')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Deal Breakers */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Ausschlusskriterien:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {AVAILABLE_FEATURES.map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={watchedValues.dealBreakers?.includes(feature) || false}
                        onChange={() => toggleFeature(feature, 'dealBreakers')}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Decision Making */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>👤 Entscheidungsfindung</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="decisionMaker"
                  {...register('decisionMaker')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="decisionMaker" className="text-sm font-medium text-gray-700">
                  👑 Ist Entscheidungsträger
                </label>
              </div>
              
              <LdsInput
                label="Weitere beteiligte Personen"
                {...register('additionalParties')}
                placeholder="z.B. Ehepartner, Familie, Berater..."
                helpText="Wer ist sonst noch in die Entscheidung involviert?"
              />
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Communication Preferences */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>📞 Kommunikation</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LdsSelect
                label="Bevorzugter Kontaktweg"
                {...register('preferredContact')}
                options={[
                  { value: 'EMAIL', label: '📧 E-Mail' },
                  { value: 'PHONE', label: '📞 Telefon' },
                  { value: 'WHATSAPP', label: '💬 WhatsApp' },
                  { value: 'MEETING', label: '🤝 Persönliches Treffen' }
                ]}
              />
              
              <LdsInput
                label="Beste Anrufzeit"
                {...register('bestTimeToCall')}
                placeholder="z.B. Werktags 9-17 Uhr"
              />
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Additional Information */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>📝 Zusätzliche Informationen</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="space-y-4">
              <LdsInput
                label="Empfehlungsquelle"
                {...register('referralSource')}
                placeholder="z.B. Freunde, Google, ImmobilienScout24..."
              />
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="previousInteractions"
                  {...register('previousInteractions')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="previousInteractions" className="text-sm font-medium text-gray-700">
                  🔄 Hatte bereits frühere Kontakte mit uns
                </label>
              </div>
              
              <LdsInput
                label="Öffentliche Notizen"
                {...register('notes')}
                multiline
                rows={3}
                placeholder="Notizen, die auch dem Interessenten zugänglich sind..."
                helpText="Diese Notizen können in E-Mails oder bei Terminen erwähnt werden"
              />
              
              <LdsInput
                label="Interne Notizen"
                {...register('internalNotes')}
                multiline
                rows={3}
                placeholder="Interne Bewertungen, Bedenken, Strategien..."
                helpText="Nur für das Team sichtbar"
              />
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <LdsButton
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            ❌ Abbrechen
          </LdsButton>
          
          <LdsButton
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? '💾 Speichere...' : '💾 Qualifikation speichern'}
          </LdsButton>
        </div>
      </form>
    </div>
  );
}

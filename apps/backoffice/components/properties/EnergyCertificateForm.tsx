'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  LdsInput,
  LdsSelect,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

import {
  energyCertificateSchema,
  energyCertificatePublishSchema,
  type EnergyCertificate,
  ENERGY_CLASSES,
  ENERGY_CARRIERS,
  calculateEnergyClass,
  getValidityPeriod
} from '@/lib/validations/energy-certificate';

interface EnergyCertificateFormProps {
  /**
   * Initiale Daten für das Formular
   */
  initialData?: Partial<EnergyCertificate>;
  
  /**
   * Callback beim Speichern
   */
  onSubmit: (data: EnergyCertificate) => void;
  
  /**
   * Ob das Formular für die Veröffentlichung validiert werden soll
   * (alle Pflichtfelder erforderlich)
   */
  validateForPublish?: boolean;
  
  /**
   * Readonly-Modus
   */
  readonly?: boolean;
}

/**
 * Energieausweis Formular Component
 * 
 * Implementiert alle GEG § 87 Pflichtangaben:
 * - Energietyp (Verbrauch/Bedarf)
 * - Energiekennwert
 * - Effizienzklasse
 * - Energieträger
 * - Ausstellungsdetails
 * - Bedingte Verbrauchsdaten
 */
export function EnergyCertificateForm({
  initialData = {},
  onSubmit,
  validateForPublish = false,
  readonly = false
}: EnergyCertificateFormProps) {
  const [showConsumptionFields, setShowConsumptionFields] = useState(
    initialData.energyType === 'Verbrauch'
  );
  
  const validationSchema = validateForPublish 
    ? energyCertificatePublishSchema 
    : energyCertificateSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues
  } = useForm<EnergyCertificate>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      energyType: 'Bedarf',
      energyCertType: 'Wohnung',
      energyCertIssueYear: new Date().getFullYear() - 1,
      energyCertValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 9)),
      ...initialData
    }
  });

  // Watch für dynamische Felder
  const watchedEnergyType = watch('energyType');
  const watchedEnergyValue = watch('energyValue');
  const watchedCertType = watch('energyCertType');
  const watchedValidUntil = watch('energyCertValidUntil');

  // Zeige/Verstecke Verbrauchsfelder basierend auf Energietyp
  useEffect(() => {
    const isConsumptionBased = watchedEnergyType === 'Verbrauch';
    setShowConsumptionFields(isConsumptionBased);
  }, [watchedEnergyType]);

  // Auto-Berechnung der Effizienzklasse
  const handleEnergyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > 0) {
      const suggestedClass = calculateEnergyClass(value, watchedCertType);
      setValue('energyClass', suggestedClass);
    }
  };

  // Gültigkeitsprüfung
  const getValidityStatus = () => {
    if (!watchedValidUntil) return null;
    
    const { years, months, isExpired } = getValidityPeriod(watchedValidUntil);
    
    if (isExpired) {
      return { variant: 'destructive' as const, text: 'Abgelaufen' };
    } else if (years === 0 && months <= 6) {
      return { variant: 'warning' as const, text: `Läuft in ${months} Monaten ab` };
    } else if (years <= 1) {
      return { variant: 'warning' as const, text: `Noch ${years > 0 ? years + ' Jahr' + (years > 1 ? 'e' : '') + ' ' : ''}${months} Monat${months !== 1 ? 'e' : ''} gültig` };
    } else {
      return { variant: 'success' as const, text: `Noch ${years} Jahre gültig` };
    }
  };

  const validityStatus = getValidityStatus();

  const onFormSubmit = async (data: EnergyCertificate) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error('Error submitting energy certificate:', error);
      // TODO: Show error message to user
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Basis-Pflichtangaben */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Basis-Angaben (GEG § 87 Pflicht)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LdsSelect
            label="Energietyp *"
            {...register('energyType')}
            error={errors.energyType?.message}
            disabled={readonly}
            options={[
              { value: 'Bedarf', label: 'Bedarfsausweis' },
              { value: 'Verbrauch', label: 'Verbrauchsausweis' }
            ]}
            helpText="Steht auf dem Energieausweis vermerkt"
            required
          />
          
          <LdsSelect
            label="Art des Energieausweises *"
            {...register('energyCertType')}
            error={errors.energyCertType?.message}
            disabled={readonly}
            options={[
              { value: 'Wohnung', label: 'Wohngebäude' },
              { value: 'Nichtwohngebäude', label: 'Nichtwohngebäude' }
            ]}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <LdsInput
              type="number"
              label="Energiekennwert *"
              {...register('energyValue', { valueAsNumber: true })}
              onChange={handleEnergyValueChange}
              error={errors.energyValue?.message}
              disabled={readonly}
              placeholder="z.B. 125.5"
              step="0.1"
              min="0"
              max="1000"
              unit="kWh/(m²·a)"
              helpText="Hauptwert aus dem Energieausweis"
              required
            />
          </div>
          
          <LdsSelect
            label="Effizienzklasse *"
            {...register('energyClass')}
            error={errors.energyClass?.message}
            disabled={readonly}
            options={ENERGY_CLASSES.map(cls => ({ value: cls, label: cls }))}
            helpText="Wird automatisch berechnet, kann überschrieben werden"
            required
          />
        </div>

        <LdsSelect
          label="Wesentlicher Energieträger *"
          {...register('energyCarrier')}
          error={errors.energyCarrier?.message}
          disabled={readonly}
          options={ENERGY_CARRIERS.map(carrier => ({ value: carrier, label: carrier }))}
          helpText="Hauptenergiequelle für Heizung/Warmwasser"
          required
        />
      </div>

      {/* Ausstellungsdetails */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900">Ausstellungsdetails</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <LdsInput
            type="number"
            label="Ausstellungsjahr *"
            {...register('energyCertIssueYear', { valueAsNumber: true })}
            error={errors.energyCertIssueYear?.message}
            disabled={readonly}
            min={2008}
            max={new Date().getFullYear()}
            helpText="Jahr der Energieausweis-Erstellung"
            required
          />
          
          <div>
            <LdsInput
              type="date"
              label="Gültig bis *"
              {...register('energyCertValidUntil', { valueAsDate: true })}
              error={errors.energyCertValidUntil?.message}
              disabled={readonly}
              helpText="10 Jahre ab Ausstellungsdatum"
              required
            />
            {validityStatus && (
              <div className="mt-1">
                <LdsBadge variant={validityStatus.variant}>
                  {validityStatus.text}
                </LdsBadge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Verbrauchsausweis-spezifische Felder */}
      {showConsumptionFields && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900">
            Verbrauchsdaten (nur Verbrauchsausweis)
          </h3>
          <p className="text-sm text-gray-600">
            Diese Angaben sind bei Verbrauchsausweisen zusätzlich erforderlich.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <LdsInput
              type="number"
              label="Heizenergieverbrauch *"
              {...register('heatingConsumption', { valueAsNumber: true })}
              error={errors.heatingConsumption?.message}
              disabled={readonly}
              placeholder="z.B. 110.0"
              step="0.1"
              min="0"
              unit="kWh/(m²·a)"
              required={watchedEnergyType === 'Verbrauch'}
            />
            
            <LdsInput
              type="number"
              label="Warmwasserverbrauch"
              {...register('hotWaterConsumption', { valueAsNumber: true })}
              error={errors.hotWaterConsumption?.message}
              disabled={readonly}
              placeholder="z.B. 15.5"
              step="0.1"
              min="0"
              unit="kWh/(m²·a)"
              helpText="Optional, falls separat ausgewiesen"
            />
            
            <LdsInput
              type="text"
              label="Referenzzeitraum *"
              {...register('consumptionYears')}
              error={errors.consumptionYears?.message}
              disabled={readonly}
              placeholder="2019-2021"
              pattern="^\d{4}-\d{4}$"
              helpText="Format: JJJJ-JJJJ"
              required={watchedEnergyType === 'Verbrauch'}
            />
          </div>
        </div>
      )}

      {/* Hinweise und Aktionen */}
      <div className="space-y-4 border-t pt-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">📋 GEG § 87 Hinweis:</p>
            <p>
              Alle markierten Felder (*) sind gesetzliche Pflichtangaben und müssen vor der 
              Veröffentlichung vollständig ausgefüllt werden. Unvollständige Angaben können 
              zu Bußgeldern führen.
            </p>
          </div>
        </div>

        {!readonly && (
          <div className="flex justify-end space-x-3">
            <LdsButton
              type="button"
              variant="outline"
              onClick={() => {
                // Reset to defaults
                const currentValues = getValues();
                Object.keys(currentValues).forEach(key => {
                  setValue(key as keyof EnergyCertificate, undefined as any);
                });
              }}
            >
              Zurücksetzen
            </LdsButton>
            
            <LdsButton
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Speichere...' : 'Energieausweis speichern'}
            </LdsButton>
          </div>
        )}
      </div>
    </form>
  );
}

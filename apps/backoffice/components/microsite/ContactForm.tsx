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
  LdsInput,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

/**
 * Lead Form Schema (DSGVO-konform)
 */
const leadFormSchema = z.object({
  name: z.string()
    .min(2, 'Name muss mindestens 2 Zeichen lang sein')
    .max(100, 'Name darf maximal 100 Zeichen lang sein'),
  
  email: z.string()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
    .max(255, 'E-Mail-Adresse ist zu lang'),
  
  phone: z.string()
    .min(10, 'Telefonnummer muss mindestens 10 Zeichen lang sein')
    .max(20, 'Telefonnummer darf maximal 20 Zeichen lang sein')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Ungültiges Telefonnummer-Format')
    .optional()
    .or(z.literal('')),
  
  message: z.string()
    .max(1000, 'Nachricht darf maximal 1000 Zeichen lang sein')
    .optional(),
  
  gdprConsent: z.boolean()
    .refine(val => val === true, 'Einverständnis zur Datenschutzerklärung ist erforderlich'),
  
  marketingConsent: z.boolean().optional(),
  
  viewingRequest: z.boolean().optional()
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface ContactFormProps {
  propertyId: string;
  propertyTitle: string;
  agentName: string;
  leadSource: 'MICROSITE' | 'IMMOSCOUT24' | 'PORTAL' | 'REFERRAL';
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}

/**
 * ContactForm Component
 * 
 * DSGVO-konforme Lead-Generierung mit:
 * - Opt-In Verfahren
 * - Transparente Datenverwendung
 * - Tracking-Integration
 * - Success/Error Handling
 */
export function ContactForm({
  propertyId,
  propertyTitle,
  agentName,
  leadSource,
  utm = {}
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'form' | 'confirmation' | 'success'>('form');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      gdprConsent: false,
      marketingConsent: false,
      viewingRequest: true
    }
  });

  const watchViewingRequest = watch('viewingRequest');
  const watchGdprConsent = watch('gdprConsent');

  /**
   * Form Submit Handler
   */
  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Lead an Backend senden
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId,
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          message: data.message || null,
          source: leadSource,
          gdprConsent: data.gdprConsent,
          marketingConsent: data.marketingConsent || false,
          viewingRequest: data.viewingRequest || false,
          
          // Tracking Metadata
          metadata: {
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            utm: utm,
            timestamp: new Date().toISOString(),
            url: window.location.href
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Senden der Anfrage');
      }

      const result = await response.json();
      
      // Conversion Tracking
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID', // TODO: Google Ads Conversion ID
          transaction_id: result.leadId,
          value: 1.0,
          currency: 'EUR'
        });
      }

      // Facebook Pixel Tracking
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'Lead', {
          content_name: propertyTitle,
          content_ids: [propertyId],
          value: 1,
          currency: 'EUR'
        });
      }

      setIsSuccess(true);
      setStep('success');
      reset();

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';
      setError(errorMessage);
      console.error('Lead submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Success State
   */
  if (step === 'success') {
    return (
      <section id="contact-form" className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h2 className="text-3xl font-bold text-green-900 mb-4">
            Vielen Dank für Ihr Interesse!
          </h2>
          <p className="text-lg text-green-700 mb-6">
            Ihre Anfrage wurde erfolgreich übermittelt. {agentName} wird sich innerhalb der nächsten 24 Stunden bei Ihnen melden.
          </p>
          
          {watchViewingRequest && (
            <LdsBadge variant="success" className="mb-6">
              📅 Besichtigungstermin angefragt
            </LdsBadge>
          )}

          <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Nächste Schritte:</h3>
            <ul className="text-sm text-gray-700 space-y-2 text-left">
              <li>✉️ Sie erhalten eine Bestätigungsmail</li>
              <li>📞 {agentName} kontaktiert Sie für Details</li>
              {watchViewingRequest && (
                <li>🏠 Besichtigungstermin wird koordiniert</li>
              )}
              <li>📋 Unterlagen werden bereitgestellt</li>
            </ul>
          </div>

          <div className="mt-8">
            <LdsButton
              variant="outline"
              onClick={() => {
                setStep('form');
                setIsSuccess(false);
              }}
            >
              Weitere Anfrage stellen
            </LdsButton>
          </div>
        </div>
      </section>
    );
  }

  /**
   * Main Form
   */
  return (
    <section id="contact-form" className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Interesse an dieser Immobilie?
          </h2>
          <p className="text-lg text-gray-600">
            Kontaktieren Sie {agentName} für weitere Informationen oder eine Besichtigung.
          </p>
        </div>

        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>Kostenlose Beratung anfragen</LdsCardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Alle Felder mit * sind Pflichtfelder. Ihre Daten werden vertraulich behandelt.
            </p>
          </LdsCardHeader>
          
          <LdsCardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Kontaktdaten</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LdsInput
                    label="Name *"
                    {...register('name')}
                    error={errors.name?.message}
                    placeholder="Ihr vollständiger Name"
                    disabled={isSubmitting}
                    required
                  />
                  
                  <LdsInput
                    type="email"
                    label="E-Mail-Adresse *"
                    {...register('email')}
                    error={errors.email?.message}
                    placeholder="ihre@email.de"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <LdsInput
                  type="tel"
                  label="Telefonnummer"
                  {...register('phone')}
                  error={errors.phone?.message}
                  placeholder="+49 123 456789 (optional)"
                  disabled={isSubmitting}
                  helpText="Für schnelle Rückfragen (optional)"
                />
              </div>

              {/* Request Type */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Art der Anfrage</h3>
                
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('viewingRequest')}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <div>
                      <span className="font-medium text-gray-900">
                        📅 Besichtigungstermin vereinbaren
                      </span>
                      <p className="text-sm text-gray-600">
                        Persönliche Besichtigung vor Ort mit {agentName}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Nachricht</h3>
                
                <LdsInput
                  label="Ihre Nachricht (optional)"
                  {...register('message')}
                  error={errors.message?.message}
                  placeholder="Teilen Sie uns mit, was Sie über diese Immobilie wissen möchten..."
                  multiline
                  rows={4}
                  disabled={isSubmitting}
                  helpText="Max. 1000 Zeichen"
                />
              </div>

              {/* GDPR Consent */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900">Datenschutz</h3>
                
                <div className="space-y-3">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('gdprConsent')}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                      required
                    />
                    <div>
                      <span className="font-medium text-gray-900">
                        Datenschutzerklärung akzeptieren *
                      </span>
                      <p className="text-sm text-gray-600">
                        Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage 
                        gespeichert werden. Details in der{' '}
                        <a href="/datenschutz" className="text-blue-600 hover:underline">
                          Datenschutzerklärung
                        </a>.
                      </p>
                    </div>
                  </label>
                  {errors.gdprConsent && (
                    <p className="text-sm text-red-600 ml-7">
                      {errors.gdprConsent.message}
                    </p>
                  )}

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('marketingConsent')}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isSubmitting}
                    />
                    <div>
                      <span className="font-medium text-gray-900">
                        Newsletter abonnieren (optional)
                      </span>
                      <p className="text-sm text-gray-600">
                        Informationen über neue Immobilien und Marktentwicklungen erhalten.
                        Jederzeit kündbar.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600">❌</span>
                    <span className="text-red-800 font-medium">Fehler</span>
                  </div>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <LdsButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting || !watchGdprConsent}
                  className="min-w-48"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      📧 Anfrage senden
                    </>
                  )}
                </LdsButton>
              </div>

              {/* Trust Signals */}
              <div className="border-t pt-6 text-center">
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span>🔒</span>
                    <span>SSL-verschlüsselt</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>🇩🇪</span>
                    <span>DSGVO-konform</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📞</span>
                    <span>24h Rückmeldung</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>✅</span>
                    <span>Kostenfrei & unverbindlich</span>
                  </div>
                </div>
              </div>
            </form>
          </LdsCardContent>
        </LdsCard>
      </div>
    </section>
  );
}

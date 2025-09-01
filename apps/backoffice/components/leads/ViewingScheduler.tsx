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
 * Viewing Types
 */
type ViewingType = 'INDIVIDUAL' | 'GROUP' | 'VIRTUAL' | 'OPEN_HOUSE';
type ViewingStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

/**
 * Viewing Schema
 */
const viewingSchema = z.object({
  type: z.enum(['INDIVIDUAL', 'GROUP', 'VIRTUAL', 'OPEN_HOUSE']).default('INDIVIDUAL'),
  dateTime: z.string().min(1, 'Datum und Zeit sind erforderlich'),
  duration: z.number().min(15).max(180).default(60), // Minutes
  location: z.string().min(1, 'Standort ist erforderlich'),
  notes: z.string().max(500).optional(),
  
  // Attendees
  attendees: z.array(z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional(),
    relation: z.enum(['PRIMARY', 'PARTNER', 'AGENT', 'FAMILY', 'OTHER']).default('PRIMARY')
  })).min(1, 'Mindestens ein Teilnehmer erforderlich'),
  
  // Agent Assignment
  assignedAgent: z.string().min(1, 'Agent ist erforderlich'),
  
  // Special Requirements
  accessibility: z.boolean().default(false),
  childFriendly: z.boolean().default(false),
  keyHandover: z.boolean().default(false),
  parking: z.boolean().default(false),
  
  // Follow-up
  followUpPlanned: z.boolean().default(true),
  followUpDate: z.string().optional(),
  
  // Internal
  preparationNotes: z.string().max(1000).optional(),
  expectedQuestions: z.array(z.string()).default([])
});

type ViewingData = z.infer<typeof viewingSchema>;

interface ViewingSchedulerProps {
  leadId: string;
  leadName: string;
  leadEmail: string;
  propertyId: string;
  propertyTitle: string;
  propertyAddress: string;
  existingViewing?: {
    id: string;
    status: ViewingStatus;
    data: Partial<ViewingData>;
  };
  availableAgents: Array<{
    id: string;
    name: string;
    email: string;
    specialties?: string[];
  }>;
  onSchedule: (viewing: ViewingData) => Promise<void>;
  onCancel: () => void;
}

/**
 * ViewingScheduler Component
 * 
 * Besichtigungstermin-Verwaltung mit:
 * - Verschiedene Besichtigungstypen
 * - Multi-Attendee Support
 * - Agent-Assignment
 * - Spezielle Anforderungen
 * - Follow-up Planning
 */
export function ViewingScheduler({
  leadId,
  leadName,
  leadEmail,
  propertyId,
  propertyTitle,
  propertyAddress,
  existingViewing,
  availableAgents,
  onSchedule,
  onCancel
}: ViewingSchedulerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ViewingData>({
    resolver: zodResolver(viewingSchema),
    defaultValues: {
      type: existingViewing?.data.type || 'INDIVIDUAL',
      duration: existingViewing?.data.duration || 60,
      location: existingViewing?.data.location || propertyAddress,
      attendees: existingViewing?.data.attendees || [{
        name: leadName,
        email: leadEmail,
        relation: 'PRIMARY'
      }],
      assignedAgent: existingViewing?.data.assignedAgent || availableAgents[0]?.id,
      accessibility: existingViewing?.data.accessibility || false,
      childFriendly: existingViewing?.data.childFriendly || false,
      keyHandover: existingViewing?.data.keyHandover || false,
      parking: existingViewing?.data.parking || false,
      followUpPlanned: existingViewing?.data.followUpPlanned || true,
      expectedQuestions: existingViewing?.data.expectedQuestions || []
    }
  });

  const watchedType = watch('type');
  const watchedDateTime = watch('dateTime');
  const watchedDuration = watch('duration');

  /**
   * Get viewing type details
   */
  const getViewingTypeInfo = (type: ViewingType) => {
    switch (type) {
      case 'INDIVIDUAL':
        return {
          icon: '👤',
          label: 'Einzelbesichtigung',
          description: 'Persönliche 1-zu-1 Besichtigung',
          duration: 60,
          maxAttendees: 4
        };
      case 'GROUP':
        return {
          icon: '👥',
          label: 'Gruppenbesichtigung',
          description: 'Mehrere Interessenten gleichzeitig',
          duration: 45,
          maxAttendees: 10
        };
      case 'VIRTUAL':
        return {
          icon: '💻',
          label: 'Virtuelle Besichtigung',
          description: 'Online-Rundgang per Video',
          duration: 30,
          maxAttendees: 8
        };
      case 'OPEN_HOUSE':
        return {
          icon: '🏠',
          label: 'Tag der offenen Tür',
          description: 'Offene Besichtigung für alle',
          duration: 120,
          maxAttendees: 50
        };
    }
  };

  /**
   * Add attendee
   */
  const addAttendee = () => {
    const currentAttendees = watch('attendees') || [];
    const typeInfo = getViewingTypeInfo(watchedType);
    
    if (currentAttendees.length >= typeInfo.maxAttendees) {
      alert(`Maximal ${typeInfo.maxAttendees} Teilnehmer für ${typeInfo.label}`);
      return;
    }
    
    setValue('attendees', [
      ...currentAttendees,
      { name: '', email: '', relation: 'OTHER' }
    ]);
    setAttendeeCount(prev => prev + 1);
  };

  /**
   * Remove attendee
   */
  const removeAttendee = (index: number) => {
    const currentAttendees = watch('attendees') || [];
    if (currentAttendees.length <= 1) return; // Keep at least one
    
    setValue('attendees', currentAttendees.filter((_, i) => i !== index));
    setAttendeeCount(prev => prev - 1);
  };

  /**
   * Get next available time slots
   */
  const getAvailableTimeSlots = () => {
    const now = new Date();
    const slots = [];
    
    for (let i = 1; i <= 14; i++) { // Next 14 days
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Skip weekends for individual viewings
      if (watchedType === 'INDIVIDUAL' && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }
      
      // Morning slots
      const morning = new Date(date);
      morning.setHours(10, 0, 0, 0);
      slots.push({
        value: morning.toISOString().slice(0, 16),
        label: `${morning.toLocaleDateString('de-DE')} - 10:00 (Vormittag)`
      });
      
      // Afternoon slots
      const afternoon = new Date(date);
      afternoon.setHours(14, 0, 0, 0);
      slots.push({
        value: afternoon.toISOString().slice(0, 16),
        label: `${afternoon.toLocaleDateString('de-DE')} - 14:00 (Nachmittag)`
      });
      
      // Evening slots
      if (watchedType !== 'VIRTUAL') {
        const evening = new Date(date);
        evening.setHours(17, 0, 0, 0);
        slots.push({
          value: evening.toISOString().slice(0, 16),
          label: `${evening.toLocaleDateString('de-DE')} - 17:00 (Abend)`
        });
      }
    }
    
    return slots;
  };

  /**
   * Submit form
   */
  const onSubmit = async (data: ViewingData) => {
    setIsSubmitting(true);
    
    try {
      // Validate datetime is in future
      const viewingDate = new Date(data.dateTime);
      if (viewingDate <= new Date()) {
        alert('Besichtigungstermin muss in der Zukunft liegen');
        return;
      }
      
      await onSchedule(data);
    } catch (error) {
      console.error('Viewing scheduling error:', error);
      alert('Fehler beim Planen der Besichtigung');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeInfo = getViewingTypeInfo(watchedType);
  const attendees = watch('attendees') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Besichtigung planen</h2>
        <p className="text-gray-600 mt-1">
          Termin für <strong>{leadName}</strong> - <strong>{propertyTitle}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Viewing Type */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>🎯 Besichtigungsart</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {(['INDIVIDUAL', 'GROUP', 'VIRTUAL', 'OPEN_HOUSE'] as ViewingType[]).map(type => {
                const info = getViewingTypeInfo(type);
                const isSelected = watchedType === type;
                
                return (
                  <label key={type} className="cursor-pointer">
                    <input
                      type="radio"
                      {...register('type')}
                      value={type}
                      className="sr-only"
                    />
                    <div className={`
                      border-2 rounded-lg p-4 text-center transition-all
                      ${isSelected 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}>
                      <div className="text-3xl mb-2">{info.icon}</div>
                      <div className="font-medium text-gray-900">{info.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{info.description}</div>
                      <div className="text-xs text-gray-500 mt-2">
                        ~{info.duration}min, max {info.maxAttendees} Personen
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
            
            {/* Auto-adjust duration based on type */}
            {watchedDuration !== typeInfo.duration && (
              <div className="mt-3">
                <LdsButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setValue('duration', typeInfo.duration)}
                >
                  ⏱️ Empfohlene Dauer verwenden ({typeInfo.duration}min)
                </LdsButton>
              </div>
            )}
          </LdsCardContent>
        </LdsCard>

        {/* Date, Time & Duration */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>📅 Termin & Dauer</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Datum & Uhrzeit
                </label>
                <input
                  type="datetime-local"
                  {...register('dateTime')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.dateTime && (
                  <p className="text-red-600 text-sm mt-1">{errors.dateTime.message}</p>
                )}
                
                {/* Quick Select */}
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">Schnellauswahl:</label>
                  <select
                    onChange={(e) => e.target.value && setValue('dateTime', e.target.value)}
                    className="text-xs border border-gray-200 rounded px-2 py-1"
                  >
                    <option value="">Verfügbare Termine...</option>
                    {getAvailableTimeSlots().slice(0, 10).map(slot => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <LdsInput
                type="number"
                label="Dauer (Minuten)"
                {...register('duration', { valueAsNumber: true })}
                error={errors.duration?.message}
                min={15}
                max={180}
                step={15}
                helpText={`Empfohlen für ${typeInfo.label}: ${typeInfo.duration}min`}
              />
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Location */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>📍 Ort</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <LdsInput
              label="Besichtigungsort"
              {...register('location')}
              error={errors.location?.message}
              placeholder="Vollständige Adresse..."
              helpText={watchedType === 'VIRTUAL' ? 'Bei virtuellen Besichtigungen: Link zum Video-Call' : ''}
            />
          </LdsCardContent>
        </LdsCard>

        {/* Attendees */}
        <LdsCard>
          <LdsCardHeader>
            <div className="flex justify-between items-center">
              <LdsCardTitle>👥 Teilnehmer ({attendees.length}/{typeInfo.maxAttendees})</LdsCardTitle>
              <LdsButton
                type="button"
                variant="outline"
                size="sm"
                onClick={addAttendee}
                disabled={attendees.length >= typeInfo.maxAttendees}
              >
                ➕ Hinzufügen
              </LdsButton>
            </div>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="space-y-4">
              {attendees.map((attendee, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">
                      Teilnehmer {index + 1}
                      {attendee.relation === 'PRIMARY' && (
                        <LdsBadge variant="info" className="ml-2">Hauptinteressent</LdsBadge>
                      )}
                    </h4>
                    
                    {attendees.length > 1 && (
                      <LdsButton
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAttendee(index)}
                      >
                        ❌
                      </LdsButton>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <LdsInput
                      label="Name"
                      {...register(`attendees.${index}.name` as const)}
                      error={errors.attendees?.[index]?.name?.message}
                      placeholder="Vollständiger Name"
                    />
                    
                    <LdsInput
                      type="email"
                      label="E-Mail"
                      {...register(`attendees.${index}.email` as const)}
                      error={errors.attendees?.[index]?.email?.message}
                      placeholder="email@example.com"
                    />
                    
                    <LdsInput
                      label="Telefon (optional)"
                      {...register(`attendees.${index}.phone` as const)}
                      placeholder="+49 123 456789"
                    />
                  </div>
                  
                  <div className="mt-3">
                    <LdsSelect
                      label="Beziehung"
                      {...register(`attendees.${index}.relation` as const)}
                      options={[
                        { value: 'PRIMARY', label: '👤 Hauptinteressent' },
                        { value: 'PARTNER', label: '💑 Partner/Ehepartner' },
                        { value: 'FAMILY', label: '👨‍👩‍👧‍👦 Familie' },
                        { value: 'AGENT', label: '🤝 Vertreter/Agent' },
                        { value: 'OTHER', label: '👥 Sonstiges' }
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Agent Assignment */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>👨‍💼 Agent-Zuteilung</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <LdsSelect
              label="Zugeteilter Agent"
              {...register('assignedAgent')}
              error={errors.assignedAgent?.message}
              options={availableAgents.map(agent => ({
                value: agent.id,
                label: `${agent.name} (${agent.email})${agent.specialties ? ` - ${agent.specialties.join(', ')}` : ''}`
              }))}
            />
          </LdsCardContent>
        </LdsCard>

        {/* Special Requirements */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>♿ Besondere Anforderungen</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: 'accessibility', label: '♿ Barrierefreiheit erforderlich', description: 'Rollstuhlgerecht' },
                { key: 'childFriendly', label: '👶 Kinderfreundlich', description: 'Kinder kommen mit' },
                { key: 'keyHandover', label: '🔑 Schlüsselübergabe', description: 'Schlüssel sollen übergeben werden' },
                { key: 'parking', label: '🚗 Parkplatz erforderlich', description: 'Parkplatz für Besucher nötig' }
              ].map(item => (
                <label key={item.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register(item.key as any)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Follow-up Planning */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>📞 Nachfass-Planung</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('followUpPlanned')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="font-medium text-gray-900">
                  📅 Nachfass-Termin planen
                </span>
              </label>
              
              {watch('followUpPlanned') && (
                <div className="ml-7">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Geplanter Nachfass-Termin
                  </label>
                  <input
                    type="datetime-local"
                    {...register('followUpDate')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={watchedDateTime}
                  />
                </div>
              )}
            </div>
          </LdsCardContent>
        </LdsCard>

        {/* Preparation Notes */}
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>📝 Vorbereitung & Notizen</LdsCardTitle>
          </LdsCardHeader>
          <LdsCardContent>
            <div className="space-y-4">
              <LdsInput
                label="Vorbereitungsnotizen"
                {...register('preparationNotes')}
                multiline
                rows={3}
                placeholder="Was muss vor der Besichtigung vorbereitet werden?"
                helpText="Nur für das Team sichtbar"
              />
              
              <LdsInput
                label="Besichtigungsnotizen"
                {...register('notes')}
                multiline
                rows={3}
                placeholder="Besondere Punkte, die während der Besichtigung angesprochen werden sollen..."
                helpText="Diese Notizen können dem Teilnehmer gezeigt werden"
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Erwartete Fragen
                </label>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    Häufige Fragen bei {typeInfo.label}:
                  </div>
                  {[
                    'Nebenkosten im Detail?',
                    'Renovierungsarbeiten erlaubt?',
                    'Hausordnung und Regeln?',
                    'Nachbarschaft und Umgebung?',
                    'Parkmöglichkeiten?',
                    'Finanzierungsoptionen?'
                  ].map((question, index) => (
                    <label key={index} className="flex items-center space-x-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          const current = watch('expectedQuestions') || [];
                          if (e.target.checked) {
                            setValue('expectedQuestions', [...current, question]);
                          } else {
                            setValue('expectedQuestions', current.filter(q => q !== question));
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-gray-700">{question}</span>
                    </label>
                  ))}
                </div>
              </div>
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
            {isSubmitting ? '📅 Plane...' : '📅 Besichtigung planen'}
          </LdsButton>
        </div>
      </form>
    </div>
  );
}

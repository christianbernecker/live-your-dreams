'use client';

import React from 'react';
import { LdsBadge } from '@liveyourdreams/design-system-react';

interface TimelineEvent {
  id: string;
  type: 'LEAD_CREATED' | 'QUALIFIED' | 'VIEWING_SCHEDULED' | 'VIEWING_COMPLETED' | 
        'FOLLOW_UP' | 'OFFER_MADE' | 'DEAL_CLOSED' | 'DEAL_LOST' | 'NOTE_ADDED' | 'STATUS_CHANGED';
  title: string;
  description?: string;
  timestamp: Date;
  user?: {
    name: string;
    avatar?: string;
  };
  metadata?: {
    score?: number;
    amount?: number;
    status?: string;
    [key: string]: any;
  };
}

interface LeadTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

/**
 * LeadTimeline Component
 * 
 * Zeigt chronologischen Aktivitätsverlauf eines Leads
 */
export function LeadTimeline({ events, className = '' }: LeadTimelineProps) {
  /**
   * Get event icon and color
   */
  const getEventStyle = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'LEAD_CREATED':
        return { icon: '🎯', color: 'bg-blue-500', textColor: 'text-blue-700' };
      case 'QUALIFIED':
        return { icon: '⭐', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
      case 'VIEWING_SCHEDULED':
        return { icon: '📅', color: 'bg-green-500', textColor: 'text-green-700' };
      case 'VIEWING_COMPLETED':
        return { icon: '✅', color: 'bg-green-600', textColor: 'text-green-700' };
      case 'FOLLOW_UP':
        return { icon: '📞', color: 'bg-purple-500', textColor: 'text-purple-700' };
      case 'OFFER_MADE':
        return { icon: '💰', color: 'bg-orange-500', textColor: 'text-orange-700' };
      case 'DEAL_CLOSED':
        return { icon: '🎉', color: 'bg-emerald-500', textColor: 'text-emerald-700' };
      case 'DEAL_LOST':
        return { icon: '❌', color: 'bg-red-500', textColor: 'text-red-700' };
      case 'NOTE_ADDED':
        return { icon: '📝', color: 'bg-gray-500', textColor: 'text-gray-700' };
      case 'STATUS_CHANGED':
        return { icon: '🔄', color: 'bg-indigo-500', textColor: 'text-indigo-700' };
      default:
        return { icon: '📌', color: 'bg-gray-400', textColor: 'text-gray-600' };
    }
  };

  /**
   * Format relative time
   */
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 7) {
      return date.toLocaleDateString('de-DE');
    } else if (diffDays > 0) {
      return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;
    } else if (diffHours > 0) {
      return `vor ${diffHours} Stunde${diffHours > 1 ? 'n' : ''}`;
    } else if (diffMinutes > 0) {
      return `vor ${diffMinutes} Minute${diffMinutes > 1 ? 'n' : ''}`;
    } else {
      return 'gerade eben';
    }
  };

  if (events.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <div className="text-4xl mb-2">📊</div>
        <p>Noch keine Aktivitäten</p>
        <p className="text-sm mt-1">Der Aktivitätsverlauf wird hier angezeigt</p>
      </div>
    );
  }

  // Sort events by timestamp (newest first)
  const sortedEvents = [...events].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className={`space-y-0 ${className}`}>
      {sortedEvents.map((event, index) => {
        const style = getEventStyle(event.type);
        const isLast = index === sortedEvents.length - 1;

        return (
          <div key={event.id} className="relative">
            {/* Timeline Line */}
            {!isLast && (
              <div className="absolute left-6 top-12 bottom-0 w-px bg-gray-200" />
            )}

            {/* Event Item */}
            <div className="relative flex items-start space-x-4 pb-6">
              {/* Icon */}
              <div className={`flex-shrink-0 w-12 h-12 ${style.color} rounded-full flex items-center justify-center text-white font-medium text-sm`}>
                <span className="text-lg">{style.icon}</span>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${style.textColor}`}>
                      {event.title}
                    </h4>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {event.description}
                      </p>
                    )}

                    {/* Metadata */}
                    {event.metadata && Object.keys(event.metadata).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {event.metadata.score && (
                          <LdsBadge variant={event.metadata.score >= 80 ? 'success' : event.metadata.score >= 60 ? 'warning' : 'default'}>
                            Score: {event.metadata.score}
                          </LdsBadge>
                        )}
                        {event.metadata.amount && (
                          <LdsBadge variant="info">
                            {new Intl.NumberFormat('de-DE', {
                              style: 'currency',
                              currency: 'EUR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(event.metadata.amount / 100)}
                          </LdsBadge>
                        )}
                        {event.metadata.status && (
                          <LdsBadge variant="secondary">
                            {event.metadata.status}
                          </LdsBadge>
                        )}
                      </div>
                    )}

                    {/* User & Timestamp */}
                    <div className="flex items-center space-x-2 mt-3 text-xs text-gray-500">
                      {event.user && (
                        <>
                          {event.user.avatar ? (
                            <img
                              src={event.user.avatar}
                              alt={event.user.name}
                              className="w-4 h-4 rounded-full"
                            />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[10px]">
                              {event.user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span>{event.user.name}</span>
                          <span>•</span>
                        </>
                      )}
                      <time dateTime={event.timestamp.toISOString()}>
                        {formatRelativeTime(event.timestamp)}
                      </time>
                      <span>•</span>
                      <span>
                        {event.timestamp.toLocaleTimeString('de-DE', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Timeline End */}
      <div className="relative flex items-center space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-400 text-lg">🏁</span>
        </div>
        <div className="text-sm text-gray-500">
          Lead erstellt
        </div>
      </div>
    </div>
  );
}

/**
 * Helper function to create timeline events
 */
export const createTimelineEvent = (
  type: TimelineEvent['type'],
  title: string,
  description?: string,
  metadata?: TimelineEvent['metadata'],
  user?: TimelineEvent['user']
): Omit<TimelineEvent, 'id' | 'timestamp'> => ({
  type,
  title,
  description,
  metadata,
  user
});

/**
 * Mock timeline events for development/demo
 */
export const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    type: 'FOLLOW_UP',
    title: 'Telefon-Follow-up durchgeführt',
    description: 'Kunde ist sehr interessiert und möchte noch diese Woche besichtigen',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: { name: 'Max Mustermann' }
  },
  {
    id: '2',
    type: 'VIEWING_SCHEDULED',
    title: 'Besichtigung geplant',
    description: 'Einzelbesichtigung für Donnerstag 14:00 Uhr',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    user: { name: 'Anna Schmidt' },
    metadata: { status: 'CONFIRMED' }
  },
  {
    id: '3',
    type: 'QUALIFIED',
    title: 'Lead qualifiziert',
    description: 'Budget passt, Finanzierung geklärt, hohe Kaufbereitschaft',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    user: { name: 'Max Mustermann' },
    metadata: { score: 85 }
  },
  {
    id: '4',
    type: 'NOTE_ADDED',
    title: 'Notiz hinzugefügt',
    description: 'Kunde erwähnte Interesse an der Garage und dem Garten',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    user: { name: 'Anna Schmidt' }
  },
  {
    id: '5',
    type: 'LEAD_CREATED',
    title: 'Lead erstellt',
    description: 'Anfrage über ImmobilienScout24 eingegangen',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    metadata: { status: 'NEW' }
  }
];

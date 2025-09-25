'use client'

import React, { useState, useEffect } from 'react'

interface ActivityItem {
  id: string
  type: 'user' | 'post' | 'media' | 'system'
  action: string
  description: string
  timestamp: string
  user?: {
    name: string
    email: string
  }
  metadata?: Record<string, any>
}

interface RecentActivityProps {
  limit?: number
  className?: string
}

export default function RecentActivity({ limit = 10, className }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockActivities: ActivityItem[] = [
          {
            id: '1',
            type: 'user',
            action: 'Benutzer erstellt',
            description: 'Neuer Benutzer wurde registriert',
            timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
            user: { name: 'System', email: 'system@lyd.com' },
            metadata: { userId: 'user_123' }
          },
          {
            id: '2',
            type: 'post',
            action: 'Artikel veröffentlicht',
            description: 'Neuer Artikel "Immobilien Trends 2024" wurde veröffentlicht',
            timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
            user: { name: 'Admin User', email: 'admin@lyd.com' },
            metadata: { postId: 'post_456', title: 'Immobilien Trends 2024' }
          },
          {
            id: '3',
            type: 'media',
            action: 'Bilder hochgeladen',
            description: '5 neue Bilder wurden in die Medienbibliothek hochgeladen',
            timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
            user: { name: 'Editor', email: 'editor@lyd.com' },
            metadata: { count: 5, type: 'image' }
          },
          {
            id: '4',
            type: 'system',
            action: 'Backup erstellt',
            description: 'Automatisches Datenbank-Backup wurde erfolgreich erstellt',
            timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            user: { name: 'System', email: 'system@lyd.com' },
            metadata: { size: '245 MB', type: 'full' }
          },
          {
            id: '5',
            type: 'user',
            action: 'Login Fehlgeschlagen',
            description: 'Fehlgeschlagener Login-Versuch für admin@lyd.com',
            timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
            user: { name: 'Unknown', email: 'admin@lyd.com' },
            metadata: { ip: '192.168.1.100', attempts: 3 }
          },
          {
            id: '6',
            type: 'post',
            action: 'Artikel bearbeitet',
            description: 'Artikel "Lifestyle Guide" wurde aktualisiert',
            timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            user: { name: 'Editor', email: 'editor@lyd.com' },
            metadata: { postId: 'post_789', changes: ['title', 'content'] }
          }
        ].slice(0, limit)
        
        setActivities(mockActivities)
      } catch (error) {
        console.error('Failed to fetch activities:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [limit])

  const getActivityIcon = (type: ActivityItem['type']) => {
    const iconProps = { width: "16", height: "16", fill: "none", stroke: "currentColor", strokeWidth: 2 }
    
    switch (type) {
      case 'user':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'post':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'media':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'system':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
    }
  }

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user': return '#3b82f6'
      case 'post': return '#10b981'
      case 'media': return '#f59e0b'
      case 'system': return '#6b7280'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Gerade eben'
    if (diffInMinutes < 60) return `vor ${diffInMinutes} Min`
    if (diffInMinutes < 1440) return `vor ${Math.floor(diffInMinutes / 60)} Std`
    return `vor ${Math.floor(diffInMinutes / 1440)} Tagen`
  }

  if (loading) {
    return (
      <div className={className}>
        <div className="lyd-card" style={{ padding: 'var(--spacing-lg)' }}>
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            margin: '0 0 var(--spacing-lg) 0',
            fontFamily: 'var(--font-family-primary)'
          }}>
            Letzte Aktivitäten
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[...Array(5)].map((_, index) => (
              <div key={index} style={{
                height: '60px',
                backgroundColor: 'var(--lyd-accent)',
                borderRadius: '8px',
                animation: 'pulse 2s infinite'
              }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="lyd-card" style={{ padding: 'var(--spacing-lg)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 'var(--spacing-lg)'
        }}>
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            margin: 0,
            fontFamily: 'var(--font-family-primary)'
          }}>
            Letzte Aktivitäten
          </h3>
          
          <button className="lyd-button secondary small">
            Alle anzeigen
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {activities.map((activity, index) => (
            <div key={activity.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-md) 0',
              borderBottom: index < activities.length - 1 ? '1px solid var(--lyd-line)' : 'none'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                backgroundColor: `${getActivityColor(activity.type)}15`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: getActivityColor(activity.type),
                flexShrink: 0
              }}>
                {getActivityIcon(activity.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '2px'
                }}>
                  <p style={{
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    margin: 0,
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    {activity.action}
                  </p>
                  
                  <span style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--lyd-grey)',
                    fontFamily: 'var(--font-family-primary)',
                    flexShrink: 0,
                    marginLeft: 'var(--spacing-sm)'
                  }}>
                    {formatTimestamp(activity.timestamp)}
                  </span>
                </div>

                <p style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--lyd-grey)',
                  margin: '0 0 2px 0',
                  fontFamily: 'var(--font-family-primary)',
                  lineHeight: 1.4
                }}>
                  {activity.description}
                </p>

                {activity.user && (
                  <p style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--lyd-grey)',
                    margin: 0,
                    fontFamily: 'var(--font-family-primary)',
                    fontStyle: 'italic'
                  }}>
                    von {activity.user.name}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

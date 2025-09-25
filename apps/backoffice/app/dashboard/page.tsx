'use client'

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import DashboardMetrics from '@/components/dashboard/DashboardMetrics'
import RecentActivity from '@/components/dashboard/RecentActivity'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/')
      return
    }

    // Note: isActive check removed for simplified demo
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--lyd-text)',
          fontFamily: 'var(--font-family-primary)'
        }}>
          Laden...
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Übersicht über Ihre Immobilien-Plattform"
      userEmail={session.user.email ?? undefined}
    >
      {/* Dashboard Metrics */}
      <DashboardMetrics style={{ marginBottom: 'var(--spacing-xl)' }} />

      <div style={{
        display: 'grid',
        gap: 'var(--spacing-xl)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        marginBottom: 'var(--spacing-xl)'
      }}>
        {/* Recent Activity */}
        <RecentActivity limit={8} />

        {/* Quick Actions */}
        <div className="lyd-card" style={{ padding: 'var(--spacing-lg)' }}>
          <h3 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            margin: '0 0 var(--spacing-lg) 0',
            fontFamily: 'var(--font-family-primary)'
          }}>
            Schnellaktionen
          </h3>

          <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
            <button 
              className="lyd-button primary"
              onClick={() => router.push('/dashboard/posts/new')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Neuen Artikel erstellen
            </button>

            <button 
              className="lyd-button secondary"
              onClick={() => router.push('/dashboard/media')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Medien verwalten
            </button>

            <button 
              className="lyd-button secondary"
              onClick={() => router.push('/dashboard/users')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              Benutzer verwalten
            </button>

            <button 
              className="lyd-button secondary"
              onClick={() => router.push('/dashboard/settings')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)',
                width: '100%',
                justifyContent: 'flex-start'
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Einstellungen
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="lyd-card" style={{ padding: 'var(--spacing-lg)' }}>
        <h3 style={{
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--lyd-text)',
          margin: '0 0 var(--spacing-lg) 0',
          fontFamily: 'var(--font-family-primary)'
        }}>
          System Status
        </h3>

        <div style={{ 
          display: 'grid', 
          gap: 'var(--spacing-lg)',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }} />
            <div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Database
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: '#10b981',
                fontFamily: 'var(--font-family-primary)'
              }}>
                PostgreSQL Online
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }} />
            <div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                File Storage
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: '#10b981',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Vercel Blob Ready
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-sm)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: '#10b981',
              borderRadius: '50%'
            }} />
            <div>
              <div style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Design System
              </div>
              <div style={{
                fontSize: 'var(--font-size-xs)',
                color: '#10b981',
                fontFamily: 'var(--font-family-primary)'
              }}>
                V2 Integration Active
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
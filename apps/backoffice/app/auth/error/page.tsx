import Link from "next/link"
import { Suspense } from "react"

function AuthErrorContent() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--lyd-gradient-subtle, #fafafa)' }}>
      <div className="lyd-card elevated" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="lyd-card-header text-center">
          <div style={{ 
            fontSize: 'var(--font-size-lg)',
            color: 'var(--lyd-error)',
            marginBottom: 'var(--spacing-md)',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 'var(--font-weight-bold)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-sm)'
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Anmeldefehler
          </div>
          <p style={{ 
            color: 'var(--lyd-grey)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Bei der Anmeldung ist ein Fehler aufgetreten.
          </p>
        </div>

        <div className="lyd-card-body">
          {/* Kompakte Error-Info Box */}
          <div style={{
            backgroundColor: 'var(--lyd-error-bg, #fef2f2)',
            border: '1px solid var(--lyd-error-border, #fecaca)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-sm)'
          }}>
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="var(--lyd-error)" 
              strokeWidth="2"
              style={{ 
                flexShrink: 0,
                marginTop: '2px'
              }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 'var(--font-weight-medium)', 
                color: 'var(--lyd-error)',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Mögliche Ursachen:
              </div>
              <ul style={{ 
                margin: 0, 
                paddingLeft: 'var(--spacing-md)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--lyd-error)',
                fontFamily: 'var(--font-family-primary)',
                lineHeight: '1.5'
              }}>
                <li>Ungültige E-Mail-Adresse oder Passwort</li>
                <li>Account wurde deaktiviert</li>
                <li>Temporärer Serverfehler</li>
              </ul>
            </div>
          </div>

          {/* Design System Grid für Buttons (rechts ausgerichtet) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            gap: 'var(--spacing-md)',
            width: '100%',
            justifyContent: 'end'
          }}>
            <Link 
              href="/" 
              className="lyd-button primary"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12l8-8 8 8M6 10.5V19a1 1 0 001 1h3v-3a1 1 0 011-1h2a1 1 0 011 1v3h3a1 1 0 001-1v-8.5"/>
              </svg>
              Erneut versuchen
            </Link>
            <Link 
              href="/auth/forgot-password" 
              className="lyd-button secondary"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                whiteSpace: 'nowrap'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v18h-6M10 17l5-5-5-5M6 21V3"/>
              </svg>
              Passwort vergessen
            </Link>
          </div>
        </div>

        <div className="lyd-card-footer" style={{ textAlign: 'center' as const }}>
          <small style={{ 
            color: 'var(--lyd-grey)', 
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-xs)'
          }}>
            Bei wiederholten Problemen kontaktieren Sie den Support.
          </small>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div>Lädt...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}

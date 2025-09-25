import Link from "next/link"
import { Suspense } from "react"

function AuthErrorContent() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--lyd-gradient-subtle, #fafafa)' }}>
      <div className="lyd-card elevated" style={{ maxWidth: '500px', width: '100%' }}>
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
          {/* Design System Alert Component */}
          <div className="lyd-alert error" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <svg className="lyd-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="lyd-alert-content">
              <div className="lyd-alert-title">Mögliche Ursachen:</div>
              <div className="lyd-alert-message">
                <ul style={{ marginTop: 'var(--spacing-xs)', paddingLeft: 'var(--spacing-md)' }}>
                  <li>Ungültige E-Mail-Adresse oder Passwort</li>
                  <li>Account wurde deaktiviert</li>
                  <li>Temporärer Serverfehler</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <Link href="/" className="lyd-button primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v18h-6M10 17l5-5-5-5M6 21V3"/>
              </svg>
              Erneut anmelden
            </Link>
            <Link href="/auth/forgot-password" className="lyd-button secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              Passwort vergessen?
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

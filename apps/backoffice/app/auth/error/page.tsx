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
            fontWeight: 'var(--font-weight-bold)'
          }}>
            ⚠️ Anmeldefehler
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
          <div style={{
            backgroundColor: 'var(--lyd-error-bg, #fef2f2)',
            border: '1px solid var(--lyd-error-border, #fecaca)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-error)'
          }}>
            <strong>Mögliche Ursachen:</strong>
            <ul style={{ marginTop: 'var(--spacing-xs)', paddingLeft: 'var(--spacing-md)' }}>
              <li>Ungültige E-Mail-Adresse oder Passwort</li>
              <li>Account wurde deaktiviert</li>
              <li>Temporärer Serverfehler</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <Link href="/" className="lyd-button primary">
              Erneut anmelden
            </Link>
            <Link href="/auth/forgot-password" className="lyd-button secondary">
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

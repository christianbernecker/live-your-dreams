'use client'

import { useEffect } from 'react'
import logger from '@/lib/logger'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error
    logger.error('Global application error', {
      message: error.message,
      stack: error.stack,
      digest: error.digest
    })
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
            padding: '3rem',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            backgroundColor: 'white'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 2rem',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="32" height="32" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              margin: '0 0 1rem 0'
            }}>
              Kritischer Anwendungsfehler
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              margin: '0 0 2rem 0',
              lineHeight: 1.5
            }}>
              Die Anwendung ist auf einen kritischen Fehler gestoßen. 
              Unser Entwicklerteam wurde automatisch benachrichtigt.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={reset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Anwendung neu starten
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'transparent',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Zur Startseite
              </button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details style={{
                marginTop: '2rem',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                padding: '1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontFamily: 'monospace'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  Error Details (Development)
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  margin: 0,
                  color: '#dc2626'
                }}>
                  {error.message}
                  {'\n\n'}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}

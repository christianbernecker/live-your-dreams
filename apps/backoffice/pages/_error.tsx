import { NextPageContext } from 'next'

interface ErrorProps {
  statusCode?: number
}

/**
 * Custom Error Page (Pages Router Fallback)
 * 
 * Diese Seite wird für /404 und /500 Errors genutzt wenn sie über
 * den Pages Router aufgerufen werden. Sie nutzt KEIN Layout und
 * keinen SessionProvider, damit sie statisch pre-rendert werden kann.
 * 
 * Next.js generiert automatisch diese Routes auch im App Router Modus.
 */
function Error({ statusCode }: ErrorProps) {
  const title = statusCode === 404 
    ? 'Seite nicht gefunden' 
    : statusCode 
      ? `Server Error ${statusCode}` 
      : 'Client Error'

  const description = statusCode === 404
    ? 'Die angeforderte Seite existiert nicht.'
    : 'Es ist ein Fehler aufgetreten.'

  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{title} | LYD Backoffice</title>
        <style>{`
          :root {
            --lyd-primary: #3b82f6;
            --lyd-primary-light: rgba(59, 130, 246, 0.1);
            --lyd-error: #ef4444;
            --lyd-error-light: rgba(239, 68, 68, 0.1);
            --lyd-grey-900: #1f2937;
            --lyd-grey-700: #374151;
            --lyd-grey-500: #6b7280;
            --lyd-grey-200: #e5e7eb;
            --lyd-grey-50: #fafafa;
            --lyd-white: #ffffff;
          }
        `}</style>
      </head>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: 'var(--lyd-grey-50)'
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
            padding: '3rem',
            border: '1px solid var(--lyd-grey-200)',
            borderRadius: '12px',
            backgroundColor: 'var(--lyd-white)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}>
            {/* Icon */}
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 2rem',
              backgroundColor: statusCode === 404 ? 'var(--lyd-primary-light)' : 'var(--lyd-error-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg 
                width="32" 
                height="32" 
                fill="none" 
                stroke={statusCode === 404 ? 'var(--lyd-primary)' : 'var(--lyd-error)'} 
                viewBox="0 0 24 24"
              >
                {statusCode === 404 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
              </svg>
            </div>

            <h1 style={{
              fontSize: statusCode ? '3rem' : '2rem',
              fontWeight: 'bold',
              color: 'var(--lyd-grey-900)',
              margin: '0 0 0.5rem 0'
            }}>
              {statusCode || 'Error'}
            </h1>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--lyd-grey-700)',
              margin: '0 0 1rem 0'
            }}>
              {title}
            </h2>

            <p style={{
              fontSize: '1rem',
              color: 'var(--lyd-grey-500)',
              margin: '0 0 2rem 0',
              lineHeight: 1.6
            }}>
              {description}
            </p>

            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'var(--lyd-primary)',
                color: 'var(--lyd-white)',
                textDecoration: 'none',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
            >
              Zur Startseite
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error


export default function NotFound() {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>404 - Seite nicht gefunden | LYD Backoffice</title>
        <style>{`
          :root {
            --lyd-primary: #3b82f6;
            --lyd-primary-light: rgba(59, 130, 246, 0.1);
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
              backgroundColor: 'var(--lyd-primary-light)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="32" height="32" fill="none" stroke="var(--lyd-primary)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: 'var(--lyd-grey-900)',
              margin: '0 0 0.5rem 0'
            }}>
              404
            </h1>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: 'var(--lyd-grey-700)',
              margin: '0 0 1rem 0'
            }}>
              Seite nicht gefunden
            </h2>

            <p style={{
              fontSize: '1rem',
              color: 'var(--lyd-grey-500)',
              margin: '0 0 2rem 0',
              lineHeight: 1.6
            }}>
              Die angeforderte Seite existiert nicht oder wurde verschoben.
              Bitte überprüfen Sie die URL oder kehren Sie zur Startseite zurück.
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


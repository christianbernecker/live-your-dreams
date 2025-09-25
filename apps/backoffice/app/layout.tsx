import './globals.css'
import { ErrorBoundary } from './components/ErrorBoundary'

export const metadata = {
  title: 'Live Your Dreams - Backoffice',
  description: 'Exklusive Immobilienvermarktung - Backoffice System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000066" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body style={{ fontFamily: 'var(--font-family-primary)' }}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
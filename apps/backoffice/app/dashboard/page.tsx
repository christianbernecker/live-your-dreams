import { auth } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/")
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--lyd-gradient-subtle, #fafafa)' }}>
      {/* Header */}
      <header style={{ 
        background: 'white', 
        borderBottom: '1px solid var(--lyd-line)',
        padding: 'var(--spacing-md) var(--spacing-xl)'
      }}>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Image
              src="/lyd-logo-v3.svg"
              alt="Live Your Dreams"
              width={120}
              height={68}
              priority
            />
            <div>
              <h1 style={{ 
                fontSize: 'var(--font-size-lg)', 
                color: 'var(--lyd-deep-blue)',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 'var(--font-weight-bold)',
                margin: 0
              }}>
                Backoffice Dashboard
              </h1>
              <p style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--lyd-grey)',
                fontFamily: 'var(--font-family-primary)',
                margin: 0
              }}>
                Willkommen zurück, {session.user.name}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span style={{ 
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-grey)',
              fontFamily: 'var(--font-family-primary)'
            }}>
              {session.user.email}
            </span>
            <form action="/api/auth/signout" method="post">
              <button 
                type="submit" 
                className="lyd-button secondary small"
                style={{ fontFamily: 'var(--font-family-primary)' }}
              >
                Abmelden
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: 'var(--spacing-xl)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Stats */}
          <div className="lyd-card">
            <div className="lyd-card-header">
              <h3 style={{ 
                fontSize: 'var(--font-size-md)',
                color: 'var(--lyd-deep-blue)',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: 0
              }}>
                Übersicht
              </h3>
            </div>
            <div className="lyd-card-body">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--lyd-grey)', fontFamily: 'var(--font-family-primary)' }}>
                    Aktive Objekte
                  </span>
                  <span style={{ 
                    fontWeight: 'var(--font-weight-bold)', 
                    color: 'var(--lyd-primary)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    24
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--lyd-grey)', fontFamily: 'var(--font-family-primary)' }}>
                    Anfragen heute
                  </span>
                  <span style={{ 
                    fontWeight: 'var(--font-weight-bold)', 
                    color: 'var(--lyd-primary)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    7
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span style={{ color: 'var(--lyd-grey)', fontFamily: 'var(--font-family-primary)' }}>
                    Termine diese Woche
                  </span>
                  <span style={{ 
                    fontWeight: 'var(--font-weight-bold)', 
                    color: 'var(--lyd-primary)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    12
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lyd-card">
            <div className="lyd-card-header">
              <h3 style={{ 
                fontSize: 'var(--font-size-md)',
                color: 'var(--lyd-deep-blue)',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: 0
              }}>
                Schnellzugriff
              </h3>
            </div>
            <div className="lyd-card-body">
              <div className="space-y-3">
                <Link href="/properties/new" className="lyd-button primary large w-full">
                  Neues Objekt anlegen
                </Link>
                <Link href="/leads" className="lyd-button secondary large w-full">
                  Anfragen bearbeiten
                </Link>
                <Link href="/calendar" className="lyd-button secondary large w-full">
                  Terminkalender öffnen
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lyd-card">
            <div className="lyd-card-header">
              <h3 style={{ 
                fontSize: 'var(--font-size-md)',
                color: 'var(--lyd-deep-blue)',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: 0
              }}>
                Letzte Aktivitäten
              </h3>
            </div>
            <div className="lyd-card-body">
              <div className="space-y-3">
                <div style={{ 
                  padding: 'var(--spacing-sm)',
                  borderLeft: '3px solid var(--lyd-primary)',
                  backgroundColor: 'var(--lyd-bg-subtle, #f8fafc)'
                }}>
                  <div style={{ 
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Neue Anfrage erhalten
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--lyd-grey)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Vor 2 Stunden
                  </div>
                </div>
                <div style={{ 
                  padding: 'var(--spacing-sm)',
                  borderLeft: '3px solid var(--lyd-success)',
                  backgroundColor: 'var(--lyd-bg-subtle, #f8fafc)'
                }}>
                  <div style={{ 
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Objekt erfolgreich verkauft
                  </div>
                  <div style={{ 
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--lyd-grey)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Vor 1 Tag
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8">
          <div className="lyd-card">
            <div className="lyd-card-header">
              <h3 style={{ 
                fontSize: 'var(--font-size-md)',
                color: 'var(--lyd-deep-blue)',
                fontFamily: 'var(--font-family-primary)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: 0
              }}>
                System Status
              </h3>
            </div>
            <div className="lyd-card-body">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full bg-green-500"
                    style={{ backgroundColor: 'var(--lyd-success)' }}
                  ></div>
                  <span style={{ 
                    color: 'var(--lyd-text)', 
                    fontFamily: 'var(--font-family-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}>
                    Alle Systeme betriebsbereit
                  </span>
                </div>
                <span style={{ 
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--lyd-grey)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  Zuletzt geprüft: vor 5 Minuten
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

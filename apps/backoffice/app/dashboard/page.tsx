import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function DashboardPage() {
  // AUTHENTICATION DEAKTIVIERT FÜR DEVELOPMENT
  // const session = await auth();
  // if (!session?.user) {
  //   redirect("/");
  // }

  // Mock session für Development
  const session = {
    user: {
      email: "admin@liveyourdreams.online",
      name: "LYD Admin"
    }
  }

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Übersicht über Ihre Immobilien-Plattform"
      userEmail={session.user.email ?? undefined}
    >
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)'
      }}>
        {/* Properties Card */}
        <div className="lyd-card elevated" style={{
          background: 'linear-gradient(135deg, var(--lyd-primary) 0%, var(--lyd-royal-blue) 100%)',
          color: 'white',
          border: 'none'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-md)'
          }}>
            <div>
              <div style={{ 
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                24
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-sm)',
                opacity: 0.9
              }}>
                Aktive Immobilien
              </div>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
          </div>
          <div style={{ 
            fontSize: 'var(--font-size-xs)',
            opacity: 0.8,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5z"/>
            </svg>
            +12% seit letztem Monat
          </div>
        </div>

        {/* Leads Card */}
        <div className="lyd-card elevated">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-md)'
          }}>
            <div>
              <div style={{ 
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--lyd-success)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                127
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--lyd-grey)'
              }}>
                Neue Leads
              </div>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'var(--lyd-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--lyd-primary)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
          </div>
          <div style={{ 
            fontSize: 'var(--font-size-xs)',
            color: 'var(--lyd-success)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 14l5-5 5 5z"/>
            </svg>
            +24% seit letzter Woche
          </div>
        </div>

        {/* Revenue Card */}
        <div className="lyd-card elevated">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-md)'
          }}>
            <div>
              <div style={{ 
                fontSize: 'var(--font-size-3xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                €2.4M
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-sm)',
                color: 'var(--lyd-grey)'
              }}>
                Umsatz (Monat)
              </div>
            </div>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--lyd-warning)'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
          </div>
          <div style={{ 
            fontSize: 'var(--font-size-xs)',
            color: 'var(--lyd-warning)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)'
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
            -5% vs. Vormonat
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-2xl)'
      }}>
        {/* Recent Activity */}
        <div className="lyd-card elevated">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--spacing-lg)',
            paddingBottom: 'var(--spacing-md)',
            borderBottom: '1px solid var(--lyd-line)'
          }}>
            <h2 style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-text)',
              margin: 0,
              fontFamily: 'var(--font-family-primary)'
            }}>
              Aktuelle Aktivitäten
            </h2>
            <button className="lyd-button secondary small">
              Alle anzeigen
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {[
              { type: 'lead', user: 'Sarah Müller', action: 'Interesse an Villa in München', time: 'vor 2 Min.' },
              { type: 'property', user: 'Markus Weber', action: 'Penthouse hinzugefügt', time: 'vor 15 Min.' },
              { type: 'meeting', user: 'Anna Schmidt', action: 'Besichtigung geplant', time: 'vor 1 Std.' },
              { type: 'lead', user: 'Thomas Klein', action: 'Kontaktformular ausgefüllt', time: 'vor 2 Std.' }
            ].map((activity, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--border-radius-md)',
                backgroundColor: 'var(--lyd-accent)',
                fontSize: 'var(--font-size-sm)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: activity.type === 'lead' ? 'var(--lyd-success)' : 
                             activity.type === 'property' ? 'var(--lyd-primary)' : 'var(--lyd-warning)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {activity.type === 'lead' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  ) : activity.type === 'property' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                    </svg>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)'
                  }}>
                    {activity.user}
                  </div>
                  <div style={{ color: 'var(--lyd-grey)' }}>
                    {activity.action}
                  </div>
                </div>
                <div style={{ 
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--lyd-grey)'
                }}>
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lyd-card elevated">
          <h2 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: 'var(--font-family-primary)'
          }}>
            Schnellzugriff
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <button className="lyd-button primary" style={{
              justifyContent: 'flex-start',
              gap: 'var(--spacing-md)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Neue Immobilie
            </button>
            
            <button className="lyd-button secondary" style={{
              justifyContent: 'flex-start',
              gap: 'var(--spacing-md)',
              width: '100%'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Leads verwalten
            </button>
            
            <button className="lyd-button secondary" style={{
              justifyContent: 'flex-start',
              gap: 'var(--spacing-md)',
              width: '100%'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
              </svg>
              Analytics anzeigen
            </button>
            
            <button className="lyd-button secondary" style={{
              justifyContent: 'flex-start',
              gap: 'var(--spacing-md)',
              width: '100%'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Blog bearbeiten
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="lyd-card elevated" style={{
        background: 'linear-gradient(135deg, var(--lyd-accent) 0%, rgba(232, 240, 254, 0.3) 100%)',
        border: '1px solid var(--lyd-line)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-lg)'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--lyd-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            {session.user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-text)',
              margin: '0 0 var(--spacing-xs) 0',
              fontFamily: 'var(--font-family-primary)'
            }}>
              Willkommen zurück, {session.user.email?.split('@')[0]}!
            </h3>
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-grey)',
              margin: 0,
              fontFamily: 'var(--font-family-primary)'
            }}>
              Ihr Live Your Dreams Backoffice ist bereit. Verwalten Sie Ihre Immobilien, Leads und Analytics an einem Ort.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
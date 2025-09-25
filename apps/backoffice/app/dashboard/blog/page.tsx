import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default async function BlogPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <DashboardLayout 
      title="Blog" 
      subtitle="Content Management für Ihre Immobilien-Plattform"
      userEmail={session.user.email ?? undefined}
    >
      {/* Blog Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)'
      }}>
        <div className="lyd-card elevated">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-primary)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              42
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-grey)'
            }}>
              Artikel gesamt
            </div>
          </div>
        </div>

        <div className="lyd-card elevated">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-success)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              12
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-grey)'
            }}>
              Veröffentlicht
            </div>
          </div>
        </div>

        <div className="lyd-card elevated">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-warning)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              5
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-grey)'
            }}>
              Entwürfe
            </div>
          </div>
        </div>

        <div className="lyd-card elevated">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-text)',
              marginBottom: 'var(--spacing-xs)'
            }}>
              1.2K
            </div>
            <div style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-grey)'
            }}>
              Monatliche Views
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 'var(--spacing-xl)',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <h1 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--lyd-text)',
          margin: 0,
          fontFamily: 'var(--font-family-primary)'
        }}>
          Blog-Artikel verwalten
        </h1>
        
        <button className="lyd-button primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Neuer Artikel
        </button>
      </div>

      {/* Articles Table */}
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
            margin: 0
          }}>
            Aktuelle Artikel
          </h2>
          
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Artikel suchen..."
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md) var(--spacing-sm) 40px',
                  border: '1px solid var(--lyd-line)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  width: '200px'
                }}
              />
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                style={{
                  position: 'absolute',
                  left: '12px',
                  color: 'var(--lyd-grey)'
                }}
              >
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>

            {/* Filter */}
            <select style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              border: '1px solid var(--lyd-line)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 'var(--font-size-sm)',
              backgroundColor: 'white'
            }}>
              <option value="all">Alle Status</option>
              <option value="published">Veröffentlicht</option>
              <option value="draft">Entwurf</option>
              <option value="scheduled">Geplant</option>
            </select>
          </div>
        </div>

        {/* Article List */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)'
        }}>
          {[
            {
              title: "Immobilienmarkt München 2025 - Trends und Entwicklungen",
              status: "Veröffentlicht",
              date: "15. März 2025",
              views: "234",
              author: "Christian Bernecker",
              statusColor: "var(--lyd-success)"
            },
            {
              title: "Nachhaltige Immobilien - Zukunft des Wohnens",
              status: "Entwurf",
              date: "12. März 2025", 
              views: "0",
              author: "Sarah Müller",
              statusColor: "var(--lyd-warning)"
            },
            {
              title: "Investment-Strategien für Luxusimmobilien",
              status: "Geplant",
              date: "20. März 2025",
              views: "0", 
              author: "Thomas Weber",
              statusColor: "var(--lyd-primary)"
            },
            {
              title: "Smart Homes - Technologie trifft Wohnen",
              status: "Veröffentlicht",
              date: "10. März 2025",
              views: "156",
              author: "Anna Schmidt",
              statusColor: "var(--lyd-success)"
            }
          ].map((article, index) => (
            <div key={index} style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto auto',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              border: '1px solid var(--lyd-line)',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'var(--lyd-accent)',
              fontSize: 'var(--font-size-sm)'
            }}>
              {/* Title & Author */}
              <div>
                <div style={{
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--lyd-text)',
                  marginBottom: '4px'
                }}>
                  {article.title}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--lyd-grey)'
                }}>
                  von {article.author}
                </div>
              </div>

              {/* Status */}
              <div style={{
                padding: '4px 12px',
                borderRadius: '16px',
                fontSize: 'var(--font-size-xs)',
                fontWeight: 'var(--font-weight-medium)',
                backgroundColor: article.statusColor,
                color: 'white'
              }}>
                {article.status}
              </div>

              {/* Date */}
              <div style={{
                color: 'var(--lyd-grey)',
                fontSize: 'var(--font-size-xs)'
              }}>
                {article.date}
              </div>

              {/* Views */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-xs)',
                color: 'var(--lyd-grey)',
                fontSize: 'var(--font-size-xs)'
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {article.views}
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-xs)'
              }}>
                <button style={{
                  padding: 'var(--spacing-xs)',
                  border: '1px solid var(--lyd-line)',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--lyd-primary)'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                  </svg>
                </button>
                <button style={{
                  padding: 'var(--spacing-xs)',
                  border: '1px solid var(--lyd-line)',
                  borderRadius: 'var(--border-radius-sm)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  color: 'var(--lyd-grey)'
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="19" cy="12" r="1"/>
                    <circle cx="5" cy="12" r="1"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          marginTop: 'var(--spacing-xl)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--lyd-line)'
        }}>
          <button className="lyd-button secondary small" disabled>
            Zurück
          </button>
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-xs)'
          }}>
            <button className="lyd-button primary small">1</button>
            <button className="lyd-button secondary small">2</button>
            <button className="lyd-button secondary small">3</button>
          </div>
          <button className="lyd-button secondary small">
            Weiter
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { DashboardIcon, IntegrationsIcon, LeadIcon, MediaIcon, MicrositeIcon, PricingIcon, PropertyIcon, SettingsIcon } from '@/components/icons/LYDIcons';

// Mock-Daten für Entwicklung - später durch echte DB-Abfragen ersetzen
async function getDashboardData() {
  // TODO: Echte DB-Abfragen mit Prisma
  return {
    stats: {
      properties: {
        total: 12,
        published: 8,
        draft: 3,
        sold: 1,
        trend: '+12%'
      },
      leads: {
        total: 47,
        new: 5,
        qualified: 28,
        contacted: 14,
        trend: '+23%'
      },
      microsite: {
        views: 1248,
        uniqueVisitors: 432,
        avgTime: '3:24',
        trend: '+8%'
      },
      revenue: {
        total: 145000,
        thisMonth: 28500,
        lastMonth: 22300,
        trend: '+28%'
      }
    },
    recentActivity: [
      {
        id: '1',
        type: 'lead',
        icon: '👤',
        title: 'Neue Anfrage für Penthouse München',
        description: 'Anna Müller interessiert sich für die Immobilie',
        time: 'vor 2 Stunden',
        status: 'new'
      },
      {
        id: '2',
        type: 'property',
        icon: '🏠',
        title: '3-Zimmer-Wohnung veröffentlicht',
        description: 'Immobilie in Schwabing ist jetzt online',
        time: 'vor 5 Stunden',
        status: 'published'
      },
      {
        id: '3',
        type: 'viewing',
        icon: '📅',
        title: 'Besichtigung bestätigt',
        description: 'Familie Schmidt, 15.10. um 14:00 Uhr',
        time: 'vor 1 Tag',
        status: 'confirmed'
      },
      {
        id: '4',
        type: 'is24',
        icon: '🔗',
        title: 'IS24 Synchronisation erfolgreich',
        description: '3 Immobilien aktualisiert',
        time: 'vor 2 Tagen',
        status: 'success'
      }
    ],
    upcomingViewings: [
      {
        id: '1',
        property: '2-Zimmer Maxvorstadt',
        client: 'Thomas Weber',
        date: '25.09.2024',
        time: '10:00',
        status: 'confirmed'
      },
      {
        id: '2',
        property: 'Penthouse Bogenhausen',
        client: 'Sarah Johnson',
        date: '25.09.2024',
        time: '14:00',
        status: 'pending'
      },
      {
        id: '3',
        property: '3-Zimmer Schwabing',
        client: 'Familie Schmidt',
        date: '26.09.2024',
        time: '11:00',
        status: 'confirmed'
      }
    ],
    leadFunnel: {
      new: 12,
      qualified: 28,
      viewing: 15,
      negotiation: 8,
      closed: 3
    }
  };
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon 
}: { 
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: string;
}) {
  const trendColor = trend?.startsWith('+') ? '#16a34a' : '#dc2626';
  
  return (
    <div className="component-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '24px', opacity: 0.2 }}>
        {icon}
      </div>
      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)', marginBottom: '8px' }}>
        {title}
      </div>
      <div style={{ fontSize: '28px', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-deep)', marginBottom: '4px' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)' }}>
          {subtitle}
        </div>
      )}
      {trend && (
        <div style={{ 
          marginTop: '12px', 
          paddingTop: '12px', 
          borderTop: '1px solid var(--lyd-line)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: trendColor, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
            {trend}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--lyd-grey)' }}>
            vs. letzter Monat
          </span>
        </div>
      )}
    </div>
  );
}

function ActivityItem({ activity }: { activity: any }) {
  const statusColors: Record<string, string> = {
    new: '#0066ff',
    published: '#16a34a',
    confirmed: '#f59e0b',
    success: '#16a34a'
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--spacing-md)',
      padding: 'var(--spacing-md)',
      borderBottom: '1px solid var(--lyd-line)',
      transition: 'background 0.2s'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        background: 'var(--lyd-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        flexShrink: 0
      }}>
        {activity.icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '4px' }}>
          {activity.title}
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)', marginBottom: '4px' }}>
          {activity.description}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--lyd-grey)' }}>
          {activity.time}
        </div>
      </div>
      <div style={{
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: statusColors[activity.status] || '#6b7280',
        flexShrink: 0,
        marginTop: '6px'
      }} />
    </div>
  );
}

function LeadFunnel({ data }: { data: any }) {
  const stages = [
    { name: 'Neu', value: data.new, color: '#0066ff' },
    { name: 'Qualifiziert', value: data.qualified, color: '#3366CC' },
    { name: 'Besichtigung', value: data.viewing, color: '#f59e0b' },
    { name: 'Verhandlung', value: data.negotiation, color: '#8b5cf6' },
    { name: 'Abgeschlossen', value: data.closed, color: '#16a34a' }
  ];

  const maxValue = Math.max(...stages.map(s => s.value));

  return (
    <div className="component-card">
      <h3>Lead Funnel</h3>
      <div style={{ marginTop: 'var(--spacing-lg)' }}>
        {stages.map((stage, index) => (
          <div key={stage.name} style={{ marginBottom: 'var(--spacing-md)' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              marginBottom: '8px',
              fontSize: 'var(--font-size-sm)'
            }}>
              <span style={{ fontWeight: 'var(--font-weight-medium)' }}>{stage.name}</span>
              <span style={{ color: 'var(--lyd-grey)' }}>{stage.value}</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: 'var(--lyd-bg)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${(stage.value / maxValue) * 100}%`,
                height: '100%',
                backgroundColor: stage.color,
                borderRadius: '4px',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="backoffice-layout">
      {/* Sidebar Navigation - 100% Design System */}
      <aside className="backoffice-sidebar">
        <div style={{ marginBottom: '32px' }}>
          <img src="/shared/Live_Your_Dreams_Perfect.svg" alt="Live Your Dreams" className="lyd-logo-backoffice" />
          <div className="lyd-logo-subtitle">Backoffice</div>
        </div>
        
        <nav>
          <a href="/dashboard" className="backoffice-nav-item active">
            <DashboardIcon size="default" /> Dashboard
          </a>
          <a href="/properties" className="backoffice-nav-item">
            <PropertyIcon size="default" /> Immobilien
          </a>
          <a href="/leads" className="backoffice-nav-item">
            <LeadIcon size="default" /> Interessenten
          </a>
          <a href="/pricing" className="backoffice-nav-item">
            <PricingIcon size="default" /> Preisrechner
          </a>
          <a href="/media" className="backoffice-nav-item">
            <MediaIcon size="default" /> Medien
          </a>
          <a href="/microsite" className="backoffice-nav-item">
            <MicrositeIcon size="default" /> Microsites
          </a>
          <a href="/integrations" className="backoffice-nav-item">
            <IntegrationsIcon size="default" /> Integrationen
          </a>
          <a href="/settings" className="backoffice-nav-item">
            <SettingsIcon size="default" /> Einstellungen
          </a>
        </nav>

        <div style={{ 
          marginTop: 'auto',
          paddingTop: '32px',
          borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ fontSize: '12px', opacity: '0.6', marginBottom: '8px' }}>
            Angemeldet als
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'var(--font-weight-medium)' }}>
            admin@liveyourdreams.de
          </div>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="backoffice-main">
        <header className="backoffice-header">
          <div>
            <h1 style={{ margin: '0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>
              Dashboard
            </h1>
            <p style={{ margin: '8px 0 0 0', color: 'var(--lyd-grey)' }}>
              Willkommen zurück! Hier ist Ihre Übersicht.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
            <button className="lyd-button lyd-button-secondary">
              📥 Export
            </button>
            <button className="lyd-button lyd-button-primary">
              ➕ Neue Immobilie
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          <StatCard
            title="Immobilien"
            value={data.stats.properties.total}
            subtitle={`${data.stats.properties.published} veröffentlicht`}
            trend={data.stats.properties.trend}
            icon="🏠"
          />
          <StatCard
            title="Interessenten"
            value={data.stats.leads.total}
            subtitle={`${data.stats.leads.new} neue diese Woche`}
            trend={data.stats.leads.trend}
            icon="👥"
          />
          <StatCard
            title="Microsite Aufrufe"
            value={data.stats.microsite.views.toLocaleString('de-DE')}
            subtitle={`${data.stats.microsite.uniqueVisitors} Unique Visitors`}
            trend={data.stats.microsite.trend}
            icon="👁️"
          />
          <StatCard
            title="Umsatz"
            value={`€${(data.stats.revenue.thisMonth / 1000).toFixed(1)}k`}
            subtitle={`Gesamt: €${(data.stats.revenue.total / 1000).toFixed(0)}k`}
            trend={data.stats.revenue.trend}
            icon="💰"
          />
        </div>

        {/* Main Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-xl)'
        }}>
          {/* Recent Activity */}
          <div className="component-card" style={{ padding: 0 }}>
            <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--lyd-line)' }}>
              <h3 style={{ margin: 0 }}>Letzte Aktivitäten</h3>
            </div>
            <div>
              {data.recentActivity.map((activity: any) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
            <div style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
              <a href="/activities" className="lyd-button lyd-button-secondary" style={{ width: '100%' }}>
                Alle Aktivitäten anzeigen
              </a>
            </div>
          </div>

          {/* Lead Funnel */}
          <LeadFunnel data={data.leadFunnel} />
        </div>

        {/* Upcoming Viewings */}
        <div className="component-card">
          <h3>Anstehende Besichtigungen</h3>
          <table className="lyd-table" style={{ marginTop: 'var(--spacing-md)' }}>
            <thead>
              <tr>
                <th>Immobilie</th>
                <th>Interessent</th>
                <th>Datum</th>
                <th>Uhrzeit</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {data.upcomingViewings.map((viewing: any) => (
                <tr key={viewing.id}>
                  <td style={{ fontWeight: 'var(--font-weight-medium)' }}>{viewing.property}</td>
                  <td>{viewing.client}</td>
                  <td>{viewing.date}</td>
                  <td>{viewing.time}</td>
                  <td>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--font-size-sm)',
                      backgroundColor: viewing.status === 'confirmed' ? '#d1fae5' : '#fef3c7',
                      color: viewing.status === 'confirmed' ? '#065f46' : '#92400e'
                    }}>
                      {viewing.status === 'confirmed' ? 'Bestätigt' : 'Ausstehend'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <button style={{ 
                        padding: '4px 8px', 
                        fontSize: 'var(--font-size-sm)',
                        background: 'transparent',
                        border: '1px solid var(--lyd-line)',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}>
                        ✏️ Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
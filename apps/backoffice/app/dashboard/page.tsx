// RADIKALE UI-ÜBERARBEITUNG: Keine React-Komponenten - nur Design System CSS!

// Mock dashboard data
const dashboardData = {
  properties: {
    total: 2,
    published: 1,
    draft: 1,
    sold: 0
  },
  leads: {
    total: 7,
    new: 3,
    contacted: 2,
    qualified: 2
  },
  recentActivity: [
    {
      id: '1',
      type: 'lead',
      message: 'Neue Anfrage für 3-Zimmer-Wohnung Schwabing',
      timestamp: new Date('2024-12-19T10:30:00')
    },
    {
      id: '2', 
      type: 'property',
      message: 'Immobilie "Reihenmittelhaus Aubing" erstellt',
      timestamp: new Date('2024-12-18T16:45:00')
    }
  ]
};

export default function DashboardPage() {
  return (
    <div className="backoffice-layout">
      {/* Sidebar Navigation */}
      <aside className="backoffice-sidebar">
        <div style={{ marginBottom: '32px' }}>
          <img src="/shared/lyd-logo.svg" alt="Live Your Dreams" style={{ height: '48px', marginBottom: '8px' }} />
          <div style={{ fontSize: '14px', opacity: '0.8' }}>Backoffice</div>
        </div>
        
        <nav>
          <a href="/dashboard" className="backoffice-nav-item active">
            <span>📊</span> Dashboard
          </a>
          <a href="/properties" className="backoffice-nav-item">
            <span>🏠</span> Immobilien
          </a>
          <a href="/leads" className="backoffice-nav-item">
            <span>👥</span> Interessenten
          </a>
          <a href="/pricing" className="backoffice-nav-item">
            <span>💰</span> Preisrechner
          </a>
          <a href="/settings" className="backoffice-nav-item">
            <span>⚙️</span> Einstellungen
          </a>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="backoffice-main">
        <header className="backoffice-header">
          <h1 style={{ margin: '0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>Dashboard</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--lyd-grey)' }}>Überblick über Ihre Immobilienvermarktung</p>
        </header>
        
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-xl)' }}>
          <div className="component-card">
            <h3>Immobilien gesamt</h3>
            <div style={{ fontSize: '32px', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-primary)', margin: '8px 0' }}>
              {dashboardData.properties.total}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              <span style={{ padding: '4px 8px', backgroundColor: '#16a34a', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)' }}>
                {dashboardData.properties.published} veröffentlicht
              </span>
              <span style={{ padding: '4px 8px', backgroundColor: '#f59e0b', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)' }}>
                {dashboardData.properties.draft} Entwurf
              </span>
            </div>
          </div>
          
          <div className="component-card">
            <h3>Interessenten</h3>
            <div style={{ fontSize: '32px', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-primary)', margin: '8px 0' }}>
              {dashboardData.leads.total}
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
              <span style={{ padding: '4px 8px', backgroundColor: '#f59e0b', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)' }}>
                {dashboardData.leads.new} neu
              </span>
              <span style={{ padding: '4px 8px', backgroundColor: '#0066ff', color: 'white', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)' }}>
                {dashboardData.leads.contacted} kontaktiert
              </span>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="component-card" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <h3>Letzte Aktivitäten</h3>
          <div style={{ marginTop: 'var(--spacing-md)' }}>
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)', padding: 'var(--spacing-md) 0', borderBottom: '1px solid var(--lyd-line)' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  backgroundColor: activity.type === 'lead' ? '#0066ff' : '#16a34a', 
                  color: 'white', 
                  borderRadius: 'var(--radius-sm)', 
                  fontSize: 'var(--font-size-sm)',
                  flexShrink: 0
                }}>
                  {activity.type === 'lead' ? 'Lead' : 'Property'}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: '0', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>
                    {activity.message}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--lyd-grey)' }}>
                    {activity.timestamp.toLocaleString('de-DE')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
          <a href="/properties/new" className="lyd-button lyd-button-primary">
            Neue Immobilie anlegen
          </a>
          <a href="/leads" className="lyd-button lyd-button-secondary">
            Leads verwalten
          </a>
          <a href="/media" className="lyd-button lyd-button-secondary">
            Medien hochladen
          </a>
        </div>
      </main>
    </div>
  );
}

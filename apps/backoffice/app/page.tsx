'use client';

export default function HomePage() {
  return (
    <div className="backoffice-layout">
      {/* Sidebar Navigation */}
      <aside className="backoffice-sidebar">
        <div style={{ marginBottom: '32px' }}>
          <img src="/shared/lyd-logo.svg" alt="Live Your Dreams" style={{ height: '48px', marginBottom: '8px' }} />
          <div style={{ fontSize: '14px', opacity: '0.8' }}>Backoffice</div>
        </div>
        
        <nav>
          <a href="/dashboard" className="backoffice-nav-item">
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
          <h1 style={{ margin: '0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>Live Your Dreams</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--lyd-grey)' }}>Backoffice für Immobilienvermarktung</p>
        </header>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-lg)' }}>
          <div className="component-card">
            <h3>Dashboard</h3>
            <p style={{ color: 'var(--lyd-grey)', marginBottom: 'var(--spacing-md)' }}>Überblick über alle Aktivitäten</p>
            <a href="/dashboard" className="lyd-button lyd-button-primary">
              Dashboard öffnen
            </a>
          </div>
          
          <div className="component-card">
            <h3>Immobilien</h3>
            <p style={{ color: 'var(--lyd-grey)', marginBottom: 'var(--spacing-md)' }}>Verwalten Sie Ihre Angebote</p>
            <a href="/properties" className="lyd-button lyd-button-secondary">
              Immobilien verwalten
            </a>
          </div>
          
          <div className="component-card">
            <h3>Interessenten</h3>
            <p style={{ color: 'var(--lyd-grey)', marginBottom: 'var(--spacing-md)' }}>Lead-Management</p>
            <a href="/leads" className="lyd-button lyd-button-secondary">
              Leads verwalten
            </a>
          </div>
          
          <div className="component-card">
            <h3>Preisrechner</h3>
            <p style={{ color: 'var(--lyd-grey)', marginBottom: 'var(--spacing-md)' }}>Kostenberechnung</p>
            <a href="/pricing" className="lyd-button lyd-button-secondary">
              Preise berechnen
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
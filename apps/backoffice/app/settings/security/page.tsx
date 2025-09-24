'use client';

export default function SecurityPage() {
  return (
    <div className="backoffice-layout">
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
          <a href="/settings" className="backoffice-nav-item active">
            <span>⚙️</span> Einstellungen
          </a>
        </nav>
      </aside>
      
      <main className="backoffice-main">
        <header className="backoffice-header">
          <h1 style={{ margin: '0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>Sicherheit</h1>
          <p style={{ margin: '8px 0 0 0', color: 'var(--lyd-grey)' }}>Sicherheitseinstellungen</p>
        </header>
        
        <div className="component-card">
          <h3>Sicherheits-Übersicht</h3>
          <p>Diese Seite wird mit Design System CSS neu aufgebaut...</p>
        </div>
      </main>
    </div>
  );
}
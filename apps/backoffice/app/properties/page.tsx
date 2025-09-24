// RADIKALE UI-ÜBERARBEITUNG: Keine React-Komponenten - nur Design System CSS!

// Mock data for development
const mockProperties = [
  {
    id: '1',
    title: '3-Zimmer-Wohnung in Schwabing',
    city: 'München',
    postcode: '80804',
    price: 89000000, // in cents
    livingArea: 85,
    roomCount: 3,
    status: 'PUBLISHED',
    createdAt: new Date('2024-12-01'),
    _count: { leads: 5, media: 12 }
  },
  {
    id: '2', 
    title: 'Reihenmittelhaus in Aubing',
    city: 'München',
    postcode: '81243',
    price: 75000000, // in cents
    livingArea: 120,
    roomCount: 4,
    status: 'DRAFT',
    createdAt: new Date('2024-12-15'),
    _count: { leads: 0, media: 3 }
  }
];

function formatPrice(priceInCents: number) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(priceInCents / 100);
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'PUBLISHED': return 'success';
    case 'DRAFT': return 'warning';
    case 'SOLD': return 'info';
    default: return 'default';
  }
}

export default function PropertiesPage() {
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
          <a href="/properties" className="backoffice-nav-item active">
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)' }}>Immobilien</h1>
              <p style={{ margin: '8px 0 0 0', color: 'var(--lyd-grey)' }}>Verwalten Sie Ihre Immobilienangebote</p>
            </div>
            <a href="/properties/new" className="lyd-button lyd-button-primary">
              Neue Immobilie
            </a>
          </div>
        </header>
        
        <div className="component-card">
          <h3>Aktuelle Angebote</h3>
          
          <table className="lyd-table">
            <thead>
              <tr>
                <th>Titel</th>
                <th>Ort</th>
                <th>Preis</th>
                <th>Details</th>
                <th>Status</th>
                <th>Leads</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {mockProperties.map((property) => (
                <tr key={property.id}>
                  <td>
                    <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{property.title}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)', marginTop: '4px' }}>
                      Erstellt: {property.createdAt.toLocaleDateString('de-DE')}
                    </div>
                  </td>
                  <td>{property.city} {property.postcode}</td>
                  <td>
                    <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{formatPrice(property.price)}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--font-size-sm)' }}>
                      {property.livingArea}m² • {property.roomCount} Zimmer
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '4px 8px', 
                      backgroundColor: property.status === 'PUBLISHED' ? '#16a34a' : '#f59e0b', 
                      color: 'white', 
                      borderRadius: 'var(--radius-sm)', 
                      fontSize: 'var(--font-size-sm)' 
                    }}>
                      {property.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--font-size-sm)' }}>
                      {property._count.leads} Interessenten
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                      <a href={`/properties/${property.id}`} className="lyd-button lyd-button-secondary" style={{ fontSize: 'var(--font-size-sm)', padding: '8px 12px' }}>
                        Bearbeiten
                      </a>
                      <a href={`/properties/${property.id}?tab=preview`} className="lyd-button lyd-button-secondary" style={{ fontSize: 'var(--font-size-sm)', padding: '8px 12px' }}>
                        Ansehen
                      </a>
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

import Link from 'next/link';

export default function AdminPage() {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 'var(--spacing-xl)' }}>
        Administration
      </h1>
      
      <div style={{ display: 'grid', gap: 'var(--spacing-lg)', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <Link 
          href="/admin/users"
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--lyd-card-bg)',
            border: '1px solid var(--lyd-border)',
            borderRadius: 'var(--border-radius)',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'border-color 0.2s'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
            User Management
          </h2>
          <p style={{ color: 'var(--lyd-text-muted)', fontSize: '0.875rem' }}>
            Verwalte Benutzer und deren Rollen
          </p>
        </Link>

        <Link 
          href="/admin/roles"
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--lyd-card-bg)',
            border: '1px solid var(--lyd-border)',
            borderRadius: 'var(--border-radius)',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'border-color 0.2s'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
            Role Management
          </h2>
          <p style={{ color: 'var(--lyd-text-muted)', fontSize: '0.875rem' }}>
            Verwalte Rollen und Berechtigungen
          </p>
        </Link>

        <Link 
          href="/admin/api-keys"
          style={{
            padding: 'var(--spacing-lg)',
            backgroundColor: 'var(--lyd-card-bg)',
            border: '1px solid var(--lyd-border)',
            borderRadius: 'var(--border-radius)',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'border-color 0.2s'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 'var(--spacing-sm)' }}>
            API Keys & Monitoring
          </h2>
          <p style={{ color: 'var(--lyd-text-muted)', fontSize: '0.875rem' }}>
            Überwache API-Nutzung und Kosten
          </p>
        </Link>
      </div>
    </div>
  );
}

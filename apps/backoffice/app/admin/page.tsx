'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Client-side auth check
    fetch('/api/auth/session')
      .then(res => {
        if (res.status === 401) {
          router.push('/dashboard');
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (!data || !data.user?.isAdmin) {
          router.push('/dashboard');
        } else {
          setIsLoading(false);
        }
      })
      .catch(() => router.push('/dashboard'));
  }, [router]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--lyd-bg)', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
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
    </div>
  );
}

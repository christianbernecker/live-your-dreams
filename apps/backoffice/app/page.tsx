'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (session) {
      // User ist eingeloggt -> weiterleiten zum Dashboard
      router.push('/dashboard');
    } else {
      // User ist nicht eingeloggt -> weiterleiten zur Login-Seite
      router.push('/login');
    }
  }, [session, status, router]);

  // Loading state während der Session-Check
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--lyd-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255,255,255,0.3)',
          borderTop: '4px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px auto'
        }} />
        <p style={{ fontSize: '18px', opacity: 0.9 }}>
          Live Your Dreams wird geladen...
        </p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
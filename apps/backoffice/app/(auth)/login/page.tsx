'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Ungültige Anmeldedaten');
      } else {
        // Check session und weiterleiten
        const session = await getSession();
        if (session) {
          router.push('/dashboard');
        }
      }
    } catch (err) {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--lyd-gradient)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="component-card" style={{
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center',
        background: 'var(--lyd-white)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        borderRadius: '16px',
        padding: 'var(--spacing-xl)'
      }}>
        {/* Logo & Intro */}
        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'var(--lyd-gradient)',
            borderRadius: '50%',
            margin: '0 auto var(--spacing-lg) auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            color: 'white',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            LYD
          </div>
          
          <h1 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-deep)',
            background: 'var(--lyd-gradient)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Live Your Dreams
          </h1>
          
          <p style={{
            margin: '0',
            fontSize: 'var(--font-size-base)',
            color: 'var(--lyd-grey)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Backoffice für Immobilienvermarktung
          </p>
          
          <p style={{
            margin: '16px 0 0 0',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-grey)'
          }}>
            Melden Sie sich an, um auf Ihr Dashboard zuzugreifen
          </p>
        </div>

        {/* Demo-Hinweis */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#dbeafe',
          color: '#1e40af',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          marginBottom: 'var(--spacing-lg)',
          border: '1px solid #bfdbfe'
        }}>
          <strong>Demo-Login:</strong><br/>
          E-Mail: admin@liveyourdreams.de<br/>
          Passwort: lyd-admin-2024
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--lyd-deep)',
              textAlign: 'left'
            }}>
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ihre@email.de"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid var(--lyd-line)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)',
                transition: 'all 0.2s ease',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--lyd-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--lyd-line)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--lyd-deep)',
              textAlign: 'left'
            }}>
              Passwort
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid var(--lyd-line)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--font-size-base)',
                transition: 'all 0.2s ease',
                outline: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--lyd-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 102, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--lyd-line)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {error && (
            <div style={{
              padding: '12px 16px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              marginBottom: 'var(--spacing-lg)',
              border: '1px solid #fecaca'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="lyd-button lyd-button-primary"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: 'var(--font-size-base)',
              fontWeight: 'var(--font-weight-semibold)',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <div style={{
                  width: '20px',
                  height: '20px',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Anmelden...
              </div>
            ) : (
              <>
                🔓 Anmelden
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          marginTop: 'var(--spacing-xl)',
          paddingTop: 'var(--spacing-lg)',
          borderTop: '1px solid var(--lyd-line)',
          textAlign: 'center'
        }}>
          <p style={{
            margin: '0',
            fontSize: '12px',
            color: 'var(--lyd-grey)'
          }}>
            © 2024 Live Your Dreams GmbH
          </p>
          <div style={{
            marginTop: '8px',
            display: 'flex',
            justifyContent: 'center',
            gap: '16px'
          }}>
            <a href="#" style={{
              fontSize: '12px',
              color: 'var(--lyd-grey)',
              textDecoration: 'none'
            }}>
              Datenschutz
            </a>
            <a href="#" style={{
              fontSize: '12px',
              color: 'var(--lyd-grey)',
              textDecoration: 'none'
            }}>
              Impressum
            </a>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
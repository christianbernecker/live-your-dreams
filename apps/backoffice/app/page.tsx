'use client'

import Image from "next/image"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { signIn } = await import('next-auth/react')
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        alert(`Login Fehler: ${result.error}`)
        return
      }

      if (result?.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Ein unerwarteter Fehler ist aufgetreten')
    }
  }
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      style={{ 
        background: 'var(--lyd-gradient-subtle, linear-gradient(135deg, #667eea 0%, #764ba2 100%))',
        padding: 'var(--spacing-lg)'
      }}
    >
      <div 
        className="lyd-card elevated"
        style={{ 
          maxWidth: '600px',
          width: '100%'
        }}
      >
        {/* Header mit LYD Logo */}
        <div className="lyd-card-header">
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)',
            minHeight: '120px'
          }}>
            <Image
              src="/lyd-logo-official.svg"
              alt="Live Your Dreams Logo"
              width={227}
              height={100}
              priority
              style={{
                maxWidth: '100%',
                height: 'auto'
              }}
            />
          </div>

          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-primary-light)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 'var(--spacing-xs)',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 'var(--font-weight-medium)',
            textAlign: 'center'
          }}>
            WILLKOMMEN
          </div>

          <h1 style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-primary)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: 'var(--font-family-primary)',
            textAlign: 'center'
          }}>
            Backoffice Login
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="lyd-card-body">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--spacing-lg)',
            maxWidth: '400px',
            margin: '0 auto'
          }}>
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email"
                style={{ 
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--lyd-text)',
                  fontFamily: 'var(--font-family-primary)'
                }}
              >
                E-Mail-Adresse
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lyd-input"
                  placeholder="ihre@email.de"
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '44px'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--lyd-grey)',
                  pointerEvents: 'none'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label 
                htmlFor="password"
                style={{ 
                  display: 'block',
                  marginBottom: 'var(--spacing-xs)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--lyd-text)',
                  fontFamily: 'var(--font-family-primary)'
                }}
              >
                Passwort
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="lyd-input"
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    paddingLeft: '44px'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--lyd-grey)',
                  pointerEvents: 'none'
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--lyd-primary)'
                }}
              />
              <label 
                htmlFor="remember"
                style={{ 
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--lyd-text)',
                  fontFamily: 'var(--font-family-primary)',
                  cursor: 'pointer'
                }}
              >
                Angemeldet bleiben
              </label>
            </div>

            {/* Login Button */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              justifyContent: 'end'
            }}>
              <button 
                type="submit"
                className="lyd-button primary"
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--spacing-sm)',
                  fontSize: 'var(--font-size-md)',
                  fontWeight: 'var(--font-weight-medium)',
                  height: '44px',
                  minHeight: '44px',
                  justifySelf: 'end'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 3h6v18h-6M10 17l5-5-5-5"/>
                </svg>
                Anmelden
              </button>
            </div>

            {/* Forgot Password Link */}
            <div style={{ textAlign: 'center' }}>
              <a 
                href="/auth/forgot-password"
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--lyd-primary)',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-family-primary)',
                  fontWeight: 'var(--font-weight-medium)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                Passwort vergessen?
              </a>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="lyd-card-footer" style={{ textAlign: 'center' }}>
          <p style={{ 
            color: 'var(--lyd-grey)', 
            fontSize: 'var(--font-size-xs)',
            fontFamily: 'var(--font-family-primary)',
            marginBottom: 'var(--spacing-sm)'
          }}>
            © 2025 Live Your Dreams GmbH
          </p>
          
          {/* Development Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--lyd-success)',
            fontFamily: 'var(--font-family-primary)'
          }}>
            <div 
              className="w-2 h-2 rounded-full bg-green-500"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--lyd-success)',
                borderRadius: '50%'
              }}
            />
            Development Mode - Direkter Zugang
          </div>
        </div>
      </div>
    </div>
  )
}
import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"
import Image from "next/image"

async function handleSignIn(formData: FormData) {
  'use server'
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/dashboard'
    })
  } catch (error) {
    redirect('/auth/error')
  }
}

export default async function LoginPage() {
  const session = await auth()
  
  if (session?.user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--lyd-gradient-subtle, #fafafa)' }}>
      <div className="lyd-card elevated" style={{ maxWidth: '480px', width: '100%' }}>
        <div className="lyd-card-header text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/lyd-logo-v3.svg"
              alt="Live Your Dreams"
              width={176}
              height={100}
              priority
              className="h-auto"
              style={{ display: 'block', margin: '0 auto' }}
            />
          </div>
          <div style={{ 
            color: 'var(--lyd-grey)', 
            fontSize: 'var(--font-size-sm)',
            textTransform: 'uppercase',
            letterSpacing: 'var(--letter-spacing-wide)',
            fontWeight: 'var(--font-weight-medium)',
            fontFamily: 'var(--font-family-primary)',
            marginBottom: 'var(--spacing-xs)'
          }}>
            Willkommen
          </div>
          <h1 style={{ 
            fontSize: 'var(--font-size-2xl)', 
            color: 'var(--lyd-deep-blue)', 
            marginBottom: 'var(--spacing-lg)',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 'var(--font-weight-bold)',
            margin: '0'
          }}>
            Backoffice Login
          </h1>
        </div>
        
        <div className="lyd-card-body">
          <form action={handleSignIn} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="lyd-input-label required">
                E-Mail-Adresse
              </label>
              <div className="lyd-input-wrapper has-icon">
                <svg className="lyd-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  name="email"
                  type="email"
                  className="lyd-input"
                  placeholder="admin@liveyourdreams.online"
                  required
                  autoComplete="username"
                  defaultValue="admin@liveyourdreams.online"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="lyd-input-label required">
                Passwort
              </label>
              <div className="lyd-input-wrapper has-icon">
                <svg className="lyd-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  name="password"
                  type="password"
                  className="lyd-input"
                  placeholder="••••••••••••"
                  required
                  autoComplete="current-password"
                  defaultValue="admin123"
                />
              </div>
            </div>

            {/* Demo Hint */}
            <div style={{
              backgroundColor: 'var(--lyd-info-bg, #f0f9ff)',
              border: '1px solid var(--lyd-info-border, #bae6fd)',
              borderRadius: 'var(--border-radius-md)',
              padding: 'var(--spacing-md)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-info, #0369a1)'
            }}>
              <strong>Demo-Login:</strong><br />
              E-Mail: admin@liveyourdreams.online<br />
              Passwort: admin123
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="lyd-button primary large w-full"
              style={{ 
                marginTop: 'var(--spacing-xl)',
                fontFamily: 'var(--font-family-primary)'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h6v18h-6M10 17l5-5-5-5M6 21V3"/>
              </svg>
              Anmelden
            </button>
          </form>
        </div>

        <div className="lyd-card-footer" style={{ 
          flexDirection: 'column', 
          gap: 'var(--spacing-md)',
          textAlign: 'center' as const,
          borderTop: '1px solid var(--lyd-line)',
          marginTop: 'var(--spacing-xl)',
          paddingTop: 'var(--spacing-lg)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            width: '100%',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--lyd-grey)',
            fontFamily: 'var(--font-family-primary)'
          }}>
            <span>© {new Date().getFullYear()} Live Your Dreams</span>
            <div className="flex space-x-4">
              <a href="/impressum" style={{ color: 'var(--lyd-grey)', fontFamily: 'var(--font-family-primary)' }} className="hover:text-blue-600">
                Impressum
              </a>
              <a href="/datenschutz" style={{ color: 'var(--lyd-grey)', fontFamily: 'var(--font-family-primary)' }} className="hover:text-blue-600">
                Datenschutz
              </a>
            </div>
          </div>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2" style={{ fontSize: 'var(--font-size-xs)' }}>
            <div 
              className="w-2 h-2 rounded-full bg-green-500"
              style={{ backgroundColor: 'var(--lyd-success)' }}
            ></div>
            <span style={{ color: 'var(--lyd-grey)', fontFamily: 'var(--font-family-primary)' }}>System Online</span>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { useState } from 'react'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  userEmail?: string
  breadcrumbLink?: string
  breadcrumbLabel?: string
}

export function DashboardHeader({ title = "Dashboard", subtitle, userEmail, breadcrumbLink, breadcrumbLabel }: DashboardHeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleSignOut = async () => {
    const { signOut } = await import('next-auth/react')
    await signOut({ 
      redirect: true,
      callbackUrl: '/'
    })
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'center',
      padding: '0 var(--spacing-xl)',
      height: '100%',
      gap: 'var(--spacing-lg)'
    }}>
      {/* Page Title Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-lg)'
      }}>
        {/* Breadcrumb */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--lyd-grey)'
        }}>
          {breadcrumbLink && breadcrumbLabel ? (
            <Link 
              href={breadcrumbLink}
              style={{ 
                color: 'var(--lyd-primary)', 
                textDecoration: 'none',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              {breadcrumbLabel}
            </Link>
          ) : (
            <>
              <Link 
                href="/dashboard"
                style={{ 
                  color: 'var(--lyd-primary)', 
                  textDecoration: 'none',
                  fontWeight: 'var(--font-weight-medium)'
                }}
              >
                Dashboard
              </Link>
              {title !== "Dashboard" && (
                <>
                  <svg width="4" height="8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                  <span style={{ color: 'var(--lyd-text)' }}>{title}</span>
                </>
              )}
            </>
          )}
        </nav>

        <div style={{
          borderLeft: '1px solid var(--lyd-line)',
          paddingLeft: 'var(--spacing-lg)',
          height: '24px'
        }} />

        {/* Page Info */}
        <div>
          <h1 style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            margin: 0,
            fontFamily: 'var(--font-family-primary)'
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-grey)',
              margin: '2px 0 0 0',
              fontFamily: 'var(--font-family-primary)'
            }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Actions Section */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)'
      }}>
        {/* Search */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--lyd-line)',
          backgroundColor: 'transparent',
          color: 'var(--lyd-grey)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
        </button>

        {/* Notifications */}
        <button style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--border-radius-md)',
          border: '1px solid var(--lyd-line)',
          backgroundColor: 'transparent',
          color: 'var(--lyd-grey)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          position: 'relative'
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {/* Notification dot */}
          <div style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: 'var(--lyd-warning)',
            border: '2px solid white'
          }} />
        </button>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--border-radius-md)',
              border: '1px solid var(--lyd-line)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--lyd-text)',
              fontFamily: 'var(--font-family-primary)'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: 'var(--lyd-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-bold)'
            }}>
              {userEmail?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* User Info */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ 
                fontWeight: 'var(--font-weight-medium)',
                lineHeight: 1.2
              }}>
                {userEmail?.split('@')[0] || 'User'}
              </div>
              <div style={{ 
                fontSize: 'var(--font-size-xs)',
                color: 'var(--lyd-grey)'
              }}>
                Administrator
              </div>
            </div>

            {/* Dropdown Arrow */}
            <svg 
              width="12" 
              height="12" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{
                transform: isProfileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 'var(--spacing-xs)',
              width: '200px',
              backgroundColor: 'white',
              border: '1px solid var(--lyd-line)',
              borderRadius: 'var(--border-radius-lg)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              zIndex: 1000
            }}>
              {/* Profile Link */}
              <Link
                href="/dashboard/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-md)',
                  textDecoration: 'none',
                  color: 'var(--lyd-text)',
                  fontSize: 'var(--font-size-sm)',
                  borderBottom: '1px solid var(--lyd-line)',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--lyd-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profil bearbeiten
              </Link>

              {/* Settings Link */}
              <Link
                href="/dashboard/settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-md)',
                  textDecoration: 'none',
                  color: 'var(--lyd-text)',
                  fontSize: 'var(--font-size-sm)',
                  borderBottom: '1px solid var(--lyd-line)',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--lyd-accent)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                Einstellungen
              </Link>

              {/* Logout */}
              <button
                onClick={handleSignOut}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-sm)',
                  padding: 'var(--spacing-md)',
                  width: '100%',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: 'var(--lyd-error)',
                  fontSize: 'var(--font-size-sm)',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Abmelden
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

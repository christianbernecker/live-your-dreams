'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavigationItem {
  name: string
  href: string
  icon: React.ReactNode
  badge?: string | number
  isActive?: boolean
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    )
  },
  {
    name: 'Blog',
    href: '/dashboard/blog',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    badge: 'NEU'
  },
  {
    name: 'Immobilien',
    href: '/dashboard/properties',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
      </svg>
    ),
    badge: 24
  },
  {
    name: 'Auswertungen',
    href: '/dashboard/analytics',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    )
  },
  {
    name: 'Kunden',
    href: '/dashboard/customers',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    name: 'Einstellungen',
    href: '/dashboard/settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    )
  }
]

export function SidebarNavigation() {
  const pathname = usePathname()

  return (
    <nav style={{
      position: 'relative',
      zIndex: 10,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: 'var(--spacing-xl) var(--spacing-lg)'
    }}>
      {/* Logo Header - Größeres Logo oberhalb von Backoffice */}
      <div style={{
        marginBottom: 'var(--spacing-2xl)',
        paddingBottom: 'var(--spacing-lg)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        {/* LYD Logo - Deutlich größer und zentriert */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 'var(--spacing-lg)'
        }}>
            <Image
              src="/lyd-logo-white-final.svg"
              alt="Live Your Dreams"
              width={80}
              height={48}
              priority
            />
        </div>
        
        {/* Backoffice Titel darunter */}
        <div style={{
          color: 'white',
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          letterSpacing: '-0.025em',
          marginBottom: 'var(--spacing-xs)'
        }}>
          Backoffice
        </div>
        
        <div style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: 'var(--font-size-xs)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          Immobilien-Plattform
        </div>
      </div>

      {/* Navigation Items */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-xs)'
      }}>
        {navigationItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-md)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                borderRadius: 'var(--border-radius-md)',
                textDecoration: 'none',
                color: isActive ? 'var(--lyd-deep-blue)' : 'rgba(255, 255, 255, 0.9)',
                backgroundColor: isActive 
                  ? 'rgba(255, 255, 255, 0.95)' 
                  : 'transparent',
                boxShadow: isActive 
                  ? '0 4px 20px rgba(0, 0, 0, 0.1)' 
                  : 'none',
                transform: isActive ? 'translateX(4px)' : 'translateX(0px)',
                transition: 'all 0.2s ease',
                fontSize: 'var(--font-size-sm)',
                fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-medium)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'translateX(2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.transform = 'translateX(0px)'
                }
              }}
            >
              {/* Icon */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '20px',
                height: '20px',
                opacity: isActive ? 1 : 0.8
              }}>
                {item.icon}
              </div>

              {/* Label */}
              <span style={{ flex: 1 }}>
                {item.name}
              </span>

              {/* Badge */}
              {item.badge && (
                <div style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-bold)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backgroundColor: typeof item.badge === 'string' 
                    ? 'var(--lyd-warning)' 
                    : 'rgba(255, 255, 255, 0.2)',
                  color: typeof item.badge === 'string'
                    ? 'white'
                    : 'white'
                }}>
                  {item.badge}
                </div>
              )}

              {/* Active indicator */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '20px',
                  backgroundColor: 'var(--lyd-primary)',
                  borderRadius: '0 2px 2px 0'
                }} />
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        paddingTop: 'var(--spacing-lg)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 'var(--font-size-xs)'
      }}>
        <div style={{ marginBottom: 'var(--spacing-xs)' }}>
          Version 2.0.0
        </div>
        <div>
          © 2025 Live Your Dreams
        </div>
      </div>
    </nav>
  )
}

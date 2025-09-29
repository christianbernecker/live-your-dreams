'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

const adminNavItems = [
  {
    href: '/admin',
    label: 'Übersicht',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    permission: 'admin.read'
  },
  {
    href: '/admin/users',
    label: 'Benutzer',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    permission: 'users.read'
  },
  {
    href: '/admin/roles',
    label: 'Rollen',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <circle cx="12" cy="16" r="1"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    permission: 'roles.read'
  },
  {
    href: '/admin/content',
    label: 'Inhalte',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    permission: 'content.read'
  },
  {
    href: '/admin/audit',
    label: 'Audit-Log',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    permission: 'audit.read'
  }
]

export default function AdminSubNavigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  // Filter admin nav items based on permissions
  const allowedNavItems = adminNavItems.filter(item => {
    if (item.permission === 'admin.read') return true // Overview always visible
    return session?.user?.permissions?.includes(item.permission)
  })

  const handleTabClick = (href: string) => {
    router.push(href)
  }

  return (
    <div 
      style={{ 
        marginBottom: '2rem',
        width: '100%'
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '2px solid #e2e8f0',
          marginBottom: '1.5rem',
          overflowX: 'auto',
          backgroundColor: 'white',
          borderRadius: '8px 8px 0 0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          padding: '0 1rem'
        }}
      >
        {allowedNavItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <button
              key={item.href}
              onClick={() => handleTabClick(item.href)}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'none',
                border: 'none',
                fontSize: '1rem',
                fontWeight: '500',
                color: isActive ? '#3b82f6' : '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                borderRadius: '6px 6px 0 0',
                marginBottom: isActive ? '-2px' : '0',
                fontFamily: 'var(--font-family-primary, Inter, system-ui, sans-serif)'
              }}
              type="button"
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#1f2937'
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#6b7280'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isActive ? 1 : 0.7
                }}
              >
                {item.icon}
              </span>
              {item.label}
              
              {/* Active indicator */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-2px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: '#3b82f6'
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

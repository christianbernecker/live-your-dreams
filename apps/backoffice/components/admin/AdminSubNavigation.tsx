/**
 * AdminSubNavigation - Design System Tabs für Admin-Bereiche  
 * FOKUSSIERT AUF NUR VERFÜGBARE BEREICHE: Übersicht, Benutzer, Rollen
 * VERWENDET ECHTE .lyd-tab CSS-KLASSEN STATT INLINE-STYLES
 */

'use client'

import { useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'

// NUR AKTIVE ADMIN-BEREICHE - INHALTE & AUDIT-LOG TEMPORÄR AUSGEBLENDET
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
  }
  // INHALTE & AUDIT-LOG TEMPORÄR ENTFERNT - FOKUS AUF FUNKTIONIERENDE BEREICHE
]

export default function AdminSubNavigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const router = useRouter()

  // Filter admin nav items based on role (simplified - role-based authorization)
  const allowedNavItems = adminNavItems.filter(item => {
    // Admin role has access to all tabs
    if (session?.user?.role === 'admin') return true
    // Overview always visible for logged-in users
    if (item.permission === 'admin.read') return true
    return false
  })

  const handleTabClick = (href: string) => {
    router.push(href)
  }

  return (
    <div style={{ marginBottom: 'var(--spacing-xl, 32px)', width: '100%' }}>
      <div className="lyd-tabs">
        <div className="lyd-tabs-list">
          {allowedNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <button
                key={item.href}
                onClick={() => handleTabClick(item.href)}
                className={`lyd-tab ${isActive ? 'active' : ''}`}
                type="button"
              >
                <span className="lyd-tab-icon">
                  {item.icon}
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
/**
 * Admin Tabs Component
 * 
 * Tab-Navigation für Admin-Bereiche (Users/Roles)
 * Basierend auf Design System V2 Tabs
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminTab {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const adminTabs: AdminTab[] = [
  {
    label: 'Admin',
    href: '/admin',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    )
  },
  {
    label: 'Benutzer',
    href: '/admin/users',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    )
  },
  {
    label: 'Rollen',
    href: '/admin/roles',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <circle cx="12" cy="16" r="1"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    )
  },
  {
    label: 'API-Keys',
    href: '/admin/api-keys',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/>
        <path d="m21 2-9.6 9.6"/>
        <circle cx="7.5" cy="15.5" r="5.5"/>
      </svg>
    )
  }
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="lyd-card" style={{
      padding: '0',
      overflow: 'hidden'
    }}>
      <div className="lyd-tabs-list" style={{
        display: 'flex',
        gap: '0',
        borderBottom: '1px solid var(--lyd-line)',
        padding: '0 var(--spacing-lg)'
      }}>
        {adminTabs.map((tab) => {
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`lyd-tab ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 20px',
                fontSize: '14px',
                fontWeight: isActive ? '600' : '500',
                color: isActive ? 'var(--lyd-primary)' : 'var(--lyd-text-secondary)',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid var(--lyd-primary)' : '2px solid transparent',
                marginBottom: '-1px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--lyd-text)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--lyd-text-secondary)';
                }
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                color: 'inherit'
              }}>
                {tab.icon}
              </span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}


/**
 * AdminTabs Component
 * 
 * Tab-Navigation für Admin-Bereich (/admin)
 * Basiert auf Design System @https://designsystem.liveyourdreams.online/components/tabs/
 * 
 * Tabs: Admin / Benutzer / Rollen / API-Keys
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminTab {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ADMIN_TABS: AdminTab[] = [
  {
    label: 'Admin',
    href: '/admin',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9,22 9,12 15,12 15,22"/>
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
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    )
  }
];

export function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="lyd-card" style={{ 
      marginBottom: 'var(--spacing-xl)',
      padding: '8px'
    }}>
      <nav 
        role="tablist" 
        aria-label="Admin Navigation"
        style={{
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap'
        }}
      >
        {ADMIN_TABS.map((tab) => {
          const isActive = pathname === tab.href;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
              className={`lyd-tab ${isActive ? 'active' : ''}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                fontSize: '14px',
                fontWeight: '600',
                color: isActive ? 'var(--lyd-primary)' : 'var(--lyd-text-secondary)',
                background: isActive ? 'var(--lyd-primary-bg, #eff6ff)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--lyd-gray-50, #f9fafb)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}


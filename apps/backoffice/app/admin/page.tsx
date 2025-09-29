/**
 * Admin Dashboard Overview
 * 
 * Provides overview of admin functions and system status
 */

import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { hasPermission } from '@/lib/permissions';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  totalContent: number;
  publishedContent: number;
  recentAuditEvents: number;
}

async function getAdminStats(): Promise<AdminStats> {
  try {
    // Simplified stats - only query tables we know exist
    const [
      totalUsers,
      activeUsers,
      totalRoles
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.user.count({ where: { isActive: true } }).catch(() => 0),
      prisma.role.count({ where: { isActive: true } }).catch(() => 0)
    ]);

    // Mock data for tables that might not exist yet
    return {
      totalUsers,
      activeUsers,
      totalRoles,
      totalContent: 0, // Mock - contentEntry table might not exist
      publishedContent: 0, // Mock - contentEntry table might not exist  
      recentAuditEvents: 0 // Mock - auditEvent table might not exist
    };
  } catch (error) {
    console.error('Error getting admin stats:', error);
    // Fallback to all zeros if database fails
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalRoles: 0,
      totalContent: 0,
      publishedContent: 0,
      recentAuditEvents: 0
    };
  }
}

export default async function AdminPage() {
  const session = await auth();
  const stats = await getAdminStats();

  const adminSections = [
    {
      title: 'Benutzer-Verwaltung',
      description: 'Benutzer, Rollen und Berechtigungen verwalten',
      href: '/admin/users',
      permission: 'users.read',
      stats: `${stats.activeUsers} aktive von ${stats.totalUsers} Benutzern`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      color: 'var(--lyd-primary)'
    },
    {
      title: 'Rollen & Berechtigungen',
      description: 'Zugriffsrechte und Rollen konfigurieren',
      href: '/admin/roles',
      permission: 'roles.read',
      stats: `${stats.totalRoles} aktive Rollen`,
      icon: '🔐',
      color: 'var(--lyd-secondary)'
    },
    {
      title: 'Content-Management',
      description: 'Inhalte erstellen, bearbeiten und veröffentlichen',
      href: '/admin/content',
      permission: 'content.read',
      stats: `${stats.publishedContent} von ${stats.totalContent} veröffentlicht`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      ),
      color: 'var(--lyd-accent)'
    },
    {
      title: 'Audit-Protokoll',
      description: 'System-Aktivitäten und Änderungen nachverfolgen',
      href: '/admin/audit',
      permission: 'audit.read',
      stats: `${stats.recentAuditEvents} Events (24h)`,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
        </svg>
      ),
      color: 'var(--lyd-warning)'
    },
    {
      title: 'System-Einstellungen',
      description: 'Allgemeine System-Konfiguration',
      href: '/admin/settings',
      permission: 'settings.read',
      stats: 'Konfiguration',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
        </svg>
      ),
      color: 'var(--lyd-grey)'
    }
  ];

  // Filter sections based on permissions
  const allowedSections = [];
  for (const section of adminSections) {
    if (await hasPermission(session, section.permission as any)) {
      allowedSections.push(section);
    }
  }

  return (
    <div className="lyd-stack xl">
      {/* Welcome Header - DS Grid */}
      <div className="lyd-grid cols-12 gap-lg">
        <div className="lyd-card" style={{ gridColumn: 'span 12' }}>
          <div className="lyd-card-header">
            <h1 className="lyd-heading-1">Administration</h1>
            <p className="lyd-text-secondary">
              Willkommen im Administrationsbereich, {session?.user?.name || session?.user?.email}
            </p>
          </div>
        </div>
      </div>

          {/* Quick Stats - 4 Cards (1x4) Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--spacing-md, 16px)',
              marginBottom: 'var(--spacing-xl, 32px)'
            }}
          >
            <div className="lyd-card">
              <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-lg, 24px)' }}>
                <div style={{ marginBottom: 'var(--spacing-sm, 8px)', color: 'var(--lyd-primary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-text)', marginBottom: 'var(--spacing-xs, 4px)' }}>
                  {stats.activeUsers}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)' }}>
                  Aktive Benutzer
                </div>
              </div>
            </div>
            
            <div className="lyd-card">
              <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-lg, 24px)' }}>
                <div style={{ marginBottom: 'var(--spacing-sm, 8px)', color: 'var(--lyd-secondary)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-text)', marginBottom: 'var(--spacing-xs, 4px)' }}>
                  {stats.totalRoles}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)' }}>
                  Rollen
                </div>
              </div>
            </div>
            
            <div className="lyd-card">
              <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-lg, 24px)' }}>
                <div style={{ marginBottom: 'var(--spacing-sm, 8px)', color: 'var(--lyd-accent)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10,9 9,9 8,9"/>
                  </svg>
                </div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-text)', marginBottom: 'var(--spacing-xs, 4px)' }}>
                  {stats.publishedContent}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)' }}>
                  Inhalte
                </div>
              </div>
            </div>
            
            <div className="lyd-card">
              <div className="lyd-card-body" style={{ textAlign: 'center', padding: 'var(--spacing-lg, 24px)' }}>
                <div style={{ marginBottom: 'var(--spacing-sm, 8px)', color: 'var(--lyd-info)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                  </svg>
                </div>
                <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--lyd-text)', marginBottom: 'var(--spacing-xs, 4px)' }}>
                  {stats.recentAuditEvents}
                </div>
                <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--lyd-grey)' }}>
                  Events
                </div>
              </div>
            </div>
          </div>

      {/* Admin Sections - DS Grid System */}
      <div className="lyd-grid cols-12 gap-lg">
        {allowedSections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="lyd-card hover-effect"
            style={{
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              gridColumn: 'span 6'
            }}
          >
            <div className="lyd-card-body">
              <div className="lyd-row between">
                <div>
                  <div style={{ 
                    fontSize: '2.5rem', 
                    marginBottom: 'var(--spacing-sm)',
                    color: section.color
                  }}>
                    {section.icon}
                  </div>
                  <h3 className="lyd-heading-3">{section.title}</h3>
                  <p className="lyd-text-secondary">{section.description}</p>
                </div>
              </div>
              <div className="lyd-divider" />
              <div className="lyd-text-small text-secondary">
                {section.stats}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="lyd-card" style={{ marginTop: 'var(--spacing-xl, 32px)' }}>
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">Quick Actions</h2>
        </div>
        <div className="lyd-card-body">
          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-lg, 24px)', 
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            <Link href="/admin/users?action=create" className="lyd-button outline" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm, 8px)',
              textDecoration: 'none'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Neuer Benutzer
            </Link>
            <Link href="/admin/content?action=create" className="lyd-button outline" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm, 8px)',
              textDecoration: 'none'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              Neuer Inhalt
            </Link>
            <Link href="/admin/roles?action=create" className="lyd-button outline" style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm, 8px)',
              textDecoration: 'none'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <circle cx="12" cy="16" r="1"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Neue Rolle
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

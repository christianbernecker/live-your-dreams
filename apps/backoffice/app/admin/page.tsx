/**
 * Admin Dashboard Overview
 * 
 * Provides overview of admin functions and system status
 */

import AdminTabs from '@/components/admin/AdminTabs';
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

  // NUR BENUTZER & ROLLEN - INHALTE & AUDIT-LOG TEMPORÄR AUSGEBLENDET
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
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <circle cx="12" cy="16" r="1"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      color: 'var(--lyd-secondary)'
    }
    // TEMPORÄR AUSGEBLENDET:
    // - Content-Management (noch nicht implementiert)
    // - Audit-Protokoll (noch nicht implementiert)
    // - System-Einstellungen (noch nicht implementiert)
  ];

  // Filter sections based on permissions
  const allowedSections = [];
  for (const section of adminSections) {
    if (await hasPermission(session, section.permission as any)) {
      allowedSections.push(section);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Welcome Header - KONSISTENTE CARD-STRUKTUR */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h1 className="lyd-heading-1">Administration</h1>
          <p className="lyd-text-secondary">
            Willkommen im Administrationsbereich, {session?.user?.name || session?.user?.email}
          </p>
        </div>
      </div>

      {/* Quick Stats - NUR BENUTZER & ROLLEN (2 Cards) */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">System-Übersicht</h2>
        </div>
        <div className="lyd-card-body">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'var(--spacing-lg, 24px)'
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
            
            {/* INHALTE & EVENTS TEMPORÄR AUSGEBLENDET - NUR FOCUS AUF USER & ROLES */}
          </div>
        </div>
      </div>

      {/* Admin Bereiche - DESIGN SYSTEM TABS MIT ICONS */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">Admin-Bereiche</h2>
          <p className="lyd-text-secondary">Wählen Sie einen Bereich zur Verwaltung aus</p>
        </div>
        <div className="lyd-card-body">
          <AdminTabs stats={stats} />
        </div>
      </div>

      {/* Quick Actions - KONSISTENTE CARD-STRUKTUR */}
      <div className="lyd-card">
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
            {/* NEUER INHALT TEMPORÄR ENTFERNT */}
          </div>
        </div>
      </div>
    </div>
  );
}

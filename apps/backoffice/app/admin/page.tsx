/**
 * Admin Dashboard Overview
 * 
 * Provides overview of admin functions and system status
 */

import { prisma } from '@/lib/db';
import { auth } from '@/lib/nextauth';
import { redirect } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminTabs } from '@/components/ui/AdminTabs';
import Link from 'next/link';


interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRoles: number;
  totalContent: number;
  publishedContent: number;
  recentAuditEvents: number;
  // API-Keys Statistics
  totalApiKeys: number;
  activeApiKeys: number;
  todayCost: number;
  todayCalls: number;
}

async function getAdminStats(): Promise<AdminStats> {
  try {
    // Get start of today for today's stats
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // Query all stats in parallel
    const [
      totalUsers,
      activeUsers,
      totalRoles,
      totalApiKeys,
      activeApiKeys,
      todayUsage
    ] = await Promise.all([
      prisma.user.count().catch(() => 0),
      prisma.user.count({ where: { isActive: true } }).catch(() => 0),
      prisma.role.count({ where: { isActive: true } }).catch(() => 0),
      prisma.apiKey.count().catch(() => 0),
      prisma.apiKey.count({ where: { isActive: true } }).catch(() => 0),
      prisma.apiUsageLog.aggregate({
        where: {
          createdAt: { gte: startOfToday }
        },
        _sum: {
          totalCost: true
        },
        _count: true
      }).catch(() => ({ _sum: { totalCost: null }, _count: 0 }))
    ]);

    return {
      totalUsers,
      activeUsers,
      totalRoles,
      totalContent: 0, // Mock - contentEntry table might not exist
      publishedContent: 0, // Mock - contentEntry table might not exist
      recentAuditEvents: 0, // Mock - auditEvent table might not exist
      totalApiKeys,
      activeApiKeys,
      todayCost: todayUsage._sum.totalCost ? Number(todayUsage._sum.totalCost) : 0,
      todayCalls: todayUsage._count
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
      recentAuditEvents: 0,
      totalApiKeys: 0,
      activeApiKeys: 0,
      todayCost: 0,
      todayCalls: 0
    };
  }
}

export default async function AdminPage() {
  const session = await auth();

  // Admin-only access check with live DB validation
  if (!session?.user) {
    redirect('/api/auth/signin?callbackUrl=/admin');
  }

  // Live DB check: Verify user is active and has admin role
  // This prevents stale JWT tokens from granting access after revocation
  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        isActive: true,
        roles: {
          include: {
            role: {
              select: { name: true, isActive: true }
            }
          }
        }
      }
    });

    const isActiveAdmin = user?.isActive &&
      user.roles.some(ur => ur.role.name === 'admin' && ur.role.isActive);

    if (!isActiveAdmin) {
      redirect('/dashboard?error=insufficient_permissions');
    }
  } catch (error) {
    console.error('Error verifying admin access:', error);
    redirect('/dashboard?error=server_error');
  }

  const stats = await getAdminStats();

  // Admin sections - no permission filtering needed (already admin-only)
  const adminSections = [
    {
      title: 'Benutzer-Verwaltung',
      description: 'Benutzer, Rollen und Berechtigungen verwalten',
      href: '/admin/users',
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
  ];

  return (
    <DashboardLayout title="Administration" subtitle="Zentrale Steuerung für Benutzer, Rollen und Systemkonfiguration">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
        {/* Tab Navigation */}
        <AdminTabs />

        {/* Quick Stats Grid - Übersicht Key Metrics */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">System-Übersicht</h2>
            <p className="lyd-text-secondary">Aktuelle Kennzahlen auf einen Blick</p>
          </div>
          <div className="lyd-card-body">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 'var(--spacing-lg, 24px)'
            }}>
              {/* Active Users */}
              <div style={{
                padding: 'var(--spacing-lg, 24px)',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-primary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {stats.activeUsers}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-secondary)' }}>
                  Aktive Benutzer
                </div>
              </div>

              {/* Active Roles */}
              <div style={{
                padding: 'var(--spacing-lg, 24px)',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-secondary)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {stats.totalRoles}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-secondary)' }}>
                  Aktive Rollen
                </div>
              </div>

              {/* Active API Keys */}
              <div style={{
                padding: 'var(--spacing-lg, 24px)',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-warning)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {stats.activeApiKeys}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-secondary)' }}>
                  Aktive API-Keys
                </div>
              </div>

              {/* Today's API Calls */}
              <div style={{
                padding: 'var(--spacing-lg, 24px)',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-success)',
                  marginBottom: 'var(--spacing-xs)'
                }}>
                  {stats.todayCalls}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-text-secondary)' }}>
                  API-Calls (Heute)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Bereiche mit Tab-Navigation */}
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">Admin-Bereiche</h2>
            <p className="lyd-text-secondary">Schnellzugriff auf Verwaltung von Benutzern, Rollen und API-Keys</p>
          </div>
        <div className="lyd-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-lg, 24px)' }}>
            {/* Benutzer-Verwaltung */}
            <Link href="/admin/users" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: 'var(--spacing-lg, 24px)',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--lyd-primary)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--lyd-line)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--lyd-primary)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3>Benutzer-Verwaltung</h3>
                <p style={{ color: 'var(--lyd-grey)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                  {stats.activeUsers} aktive von {stats.totalUsers} Benutzern
                </p>
              </div>
            </Link>

            {/* Rollen & Berechtigungen */}
            <Link href="/admin/roles" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: 'var(--spacing-lg, 24px)',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--lyd-secondary)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--lyd-line)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--lyd-secondary)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <circle cx="12" cy="16" r="1"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <h3>Rollen & Berechtigungen</h3>
                <p style={{ color: 'var(--lyd-grey)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                  {stats.totalRoles} aktive Rollen
                </p>
              </div>
            </Link>

            {/* API-Keys Verwaltung */}
            <Link href="/admin/api-keys" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: 'var(--spacing-lg, 24px)',
                border: '1px solid var(--lyd-line)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--lyd-warning)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--lyd-line)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ marginBottom: 'var(--spacing-md)', color: 'var(--lyd-warning)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto' }}>
                    <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/>
                    <path d="m21 2-9.6 9.6"/>
                    <circle cx="7.5" cy="15.5" r="5.5"/>
                  </svg>
                </div>
                <h3>API-Keys</h3>
                <p style={{ color: 'var(--lyd-grey)', fontSize: '0.875rem', marginBottom: 'var(--spacing-md)' }}>
                  {stats.activeApiKeys} aktive, €{stats.todayCost.toFixed(2)} heute
                </p>
              </div>
            </Link>
          </div>
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
    </DashboardLayout>
  );
}

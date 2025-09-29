/**
 * Admin Layout - Uses DashboardLayout Framework
 * 
 * Integrates Admin section with the main Dashboard layout system
 */

import AdminSubNavigation from '@/components/admin/AdminSubNavigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
// Toast provider not needed - toasts are handled per-component
import { auth } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await auth();
  
  // Permission check: Only allow users with admin permissions
  if (!session?.user) {
    redirect('/dashboard?error=insufficient_permissions');
  }

  // DEBUG: Log session for troubleshooting
  console.log('Admin Layout Debug:', {
    user: session.user.email,
    permissions: session.user.permissions,
    hasUsersRead: session.user.permissions?.includes('users.read'),
    hasRolesRead: session.user.permissions?.includes('roles.read')
  });

  // TEMPORARY: More lenient admin check - user needs at least one admin permission
  const isAdmin = session.user.permissions?.includes('users.read') || 
                  session.user.permissions?.includes('roles.read') ||
                  session.user.email === 'admin@liveyourdreams.online'

  if (!isAdmin) {
    redirect('/dashboard?error=insufficient_permissions');
  }

  return (
    <DashboardLayout 
      title="Administration"
      subtitle="System-Verwaltung und Konfiguration"
      userEmail={session.user.email}
    >
      <>
        {/* Admin Sub-Navigation */}
        <AdminSubNavigation />
        
        {/* Admin Content with DS Grid */}
        <div className="lyd-stack lg">
          {children}
        </div>
      </>
    </DashboardLayout>
  );
}
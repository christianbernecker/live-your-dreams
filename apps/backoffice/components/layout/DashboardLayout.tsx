import { ReactNode } from 'react'
import { DashboardHeader } from './DashboardHeader'
import { SidebarNavigation } from './SidebarNavigation'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  userEmail?: string
  breadcrumbLink?: string
  breadcrumbLabel?: string
  fullWidth?: boolean
}

export function DashboardLayout({ children, title, subtitle, userEmail, breadcrumbLink, breadcrumbLabel, fullWidth = false }: DashboardLayoutProps) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'var(--sidebar-width) 1fr',
      gridTemplateRows: 'var(--header-height) 1fr',
      gridTemplateAreas: '"sidebar header" "sidebar main"',
      height: '100vh',
      background: 'var(--lyd-gradient-subtle)',
      fontFamily: 'var(--font-family-primary)'
    }}>
      {/* Cockpit-Style Sidebar - Spans full height */}
      <aside 
        style={{ 
          gridArea: 'sidebar',
          background: 'linear-gradient(180deg, var(--lyd-deep-blue) 0%, var(--lyd-primary) 100%)',
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Glassmorphism overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }} />
        <SidebarNavigation />
      </aside>

      {/* Modern Header */}
      <header 
        style={{ 
          gridArea: 'header',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--lyd-line)',
          boxShadow: '0 1px 10px rgba(0, 0, 0, 0.05)',
          position: 'relative',
          zIndex: 100
        }}
      >
        <DashboardHeader title={title} subtitle={subtitle} userEmail={userEmail} breadcrumbLink={breadcrumbLink} breadcrumbLabel={breadcrumbLabel} />
      </header>

      {/* Main Content Area */}
      <main 
        style={{ 
          gridArea: 'main',
          padding: fullWidth ? 'var(--spacing-md)' : 'var(--spacing-xl)',
          overflowY: 'auto',
          background: 'transparent'
        }}
      >
        {fullWidth ? (
          children
        ) : (
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
          }}>
            {children}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --sidebar-width: 280px;
            --header-height: 72px;
          }
          
          @media (max-width: 768px) {
            :root {
              --sidebar-width: 0px;
              --header-height: 64px;
            }
          }
        `
      }} />
    </div>
  )
}

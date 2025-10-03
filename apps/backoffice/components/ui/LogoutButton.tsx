'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      // KRITISCH: Explizite Production URL um Preview-URL Redirects zu vermeiden
      const productionUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://backoffice.liveyourdreams.online'
      await signOut({ 
        redirect: false,
        callbackUrl: productionUrl
      })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="lyd-button secondary"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        fontSize: 'var(--font-size-sm)',
        height: '36px',
        padding: '0 var(--spacing-md)',
        color: 'var(--lyd-text)',
        border: '1px solid var(--lyd-border)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16,17 21,12 16,7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Abmelden
    </button>
  )
}

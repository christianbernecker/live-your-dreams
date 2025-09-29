'use client'

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { UserCreateModal } from "@/components/ui/UserCreateModal"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface User {
  id: string
  name: string | null
  email: string
  firstName: string | null
  lastName: string | null
  role: string
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
}

export default function UsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/')
      return
    }

    if (!session.user.isActive) {
      router.push('/auth/error?error=AccountDeactivated')
      return
    }

    // Check permissions
    if (!session.user.permissions.includes('users.read')) {
      router.push('/dashboard?error=NoPermission')
      return
    }

    loadUsers()
  }, [session, status, router])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const userData = await response.json()
        setUsers(userData)
      } else {
        console.error('Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      } else {
        alert('Fehler beim Löschen des Benutzers')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Fehler beim Löschen des Benutzers')
    }
  }

  const toggleUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, isActive: !isActive }
            : user
        ))
      } else {
        alert('Fehler beim Aktualisieren des Benutzerstatus')
      }
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('Fehler beim Aktualisieren des Benutzerstatus')
    }
  }

  const handleUserCreated = (newUser: User) => {
    setUsers([newUser, ...users])
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--lyd-text)',
          fontFamily: 'var(--font-family-primary)'
        }}>
          Laden...
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <DashboardLayout 
      title="Benutzerverwaltung" 
      subtitle="Benutzer verwalten, Rollen zuweisen und Zugriffsrechte kontrollieren"
      userEmail={session.user.email}
    >
      {/* Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-md)'
        }}>
          <h2 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            margin: 0,
            fontFamily: 'var(--font-family-primary)'
          }}>
            {users.length} Benutzer
          </h2>
          <div style={{
            padding: 'var(--spacing-xs) var(--spacing-sm)',
            backgroundColor: 'var(--lyd-success)',
            color: 'white',
            borderRadius: 'var(--border-radius-full)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            {users.filter(u => u.isActive).length} Aktiv
          </div>
        </div>

        {session.user.permissions.includes('users.create') && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="lyd-button primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="24" y2="13"/>
              <line x1="21.5" y1="10.5" x2="21.5" y2="10.5"/>
            </svg>
            Benutzer hinzufügen
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="lyd-card elevated">
        <div style={{ overflow: 'auto' }}>
          <table className="api-table">
            <thead>
              <tr>
                <th>Benutzer</th>
                <th>Rolle</th>
                <th>Status</th>
                <th>Letzter Login</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id}
                  style={{ 
                    borderBottom: '1px solid var(--lyd-line)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--lyd-accent)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td style={{ padding: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--lyd-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-bold)'
                      }}>
                        {(user.firstName || user.name || user.email).charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--lyd-text)',
                          marginBottom: '2px'
                        }}>
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}`
                            : user.name || user.email.split('@')[0]
                          }
                        </div>
                        <div style={{
                          fontSize: 'var(--font-size-xs)',
                          color: 'var(--lyd-grey)'
                        }}>
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`luxury-badge ${
                      user.role === 'admin' ? 'error' :
                      user.role === 'editor' ? 'info' :
                      'success'
                    }`}>
                      {user.role === 'admin' ? 'Administrator' :
                       user.role === 'editor' ? 'Editor' :
                       'Viewer'}
                    </span>
                  </td>
                  <td>
                    <span className={`luxury-badge ${user.isActive ? 'success' : 'warning'}`}>
                      {user.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </td>
                  <td style={{ 
                    color: 'var(--lyd-grey)',
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    {user.lastLoginAt 
                      ? new Date(user.lastLoginAt).toLocaleDateString('de-DE')
                      : 'Nie'
                    }
                  </td>
                  <td>
                    <div className="table-actions">
                      {session.user.permissions.includes('users.update') && (
                        <button 
                          className="lyd-button ghost icon-only"
                          onClick={() => console.log('Edit user:', user.id)}
                          title="Bearbeiten"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                      )}
                      
                      {session.user.permissions.includes('users.update') && (
                        <button 
                          className="lyd-button ghost icon-only"
                          onClick={() => toggleUserStatus(user.id, user.isActive)}
                          title={user.isActive ? 'Deaktivieren' : 'Aktivieren'}
                          style={{ color: user.isActive ? 'var(--lyd-warning)' : 'var(--lyd-success)' }}
                        >
                          {user.isActive ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <path d="M8 12l2 2 4-4"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                            </svg>
                          )}
                        </button>
                      )}

                      {session.user.permissions.includes('users.delete') && user.id !== session.user.id && (
                        <button 
                          className="lyd-button ghost icon-only"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Löschen"
                          style={{ color: 'var(--lyd-error)', borderColor: 'var(--lyd-error)' }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-2xl)',
              color: 'var(--lyd-grey)',
              fontSize: 'var(--font-size-md)'
            }}>
              <svg 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1"
                style={{ marginBottom: 'var(--spacing-md)' }}
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              <p>Keine Benutzer gefunden</p>
            </div>
          )}
        </div>
      </div>

      {/* User Create Modal */}
      <UserCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={handleUserCreated}
      />
    </DashboardLayout>
  )
}

'use client'

import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  color: string
  createdAt: string
  permissions: Permission[]
  userCount: number
}

interface Permission {
  id: string
  name: string
  displayName: string
  description: string
  category: string
}

const AVAILABLE_PERMISSIONS: Permission[] = [
  // User Management
  { id: '1', name: 'users.create', displayName: 'Benutzer erstellen', description: 'Neue Benutzer anlegen', category: 'Benutzerverwaltung' },
  { id: '2', name: 'users.read', displayName: 'Benutzer anzeigen', description: 'Benutzer einsehen', category: 'Benutzerverwaltung' },
  { id: '3', name: 'users.update', displayName: 'Benutzer bearbeiten', description: 'Benutzer-Daten ändern', category: 'Benutzerverwaltung' },
  { id: '4', name: 'users.delete', displayName: 'Benutzer löschen', description: 'Benutzer entfernen', category: 'Benutzerverwaltung' },
  
  // Content Management
  { id: '5', name: 'posts.create', displayName: 'Inhalte erstellen', description: 'Neue Artikel/Posts erstellen', category: 'Inhaltsverwaltung' },
  { id: '6', name: 'posts.read', displayName: 'Inhalte anzeigen', description: 'Artikel/Posts lesen', category: 'Inhaltsverwaltung' },
  { id: '7', name: 'posts.update', displayName: 'Inhalte bearbeiten', description: 'Artikel/Posts ändern', category: 'Inhaltsverwaltung' },
  { id: '8', name: 'posts.delete', displayName: 'Inhalte löschen', description: 'Artikel/Posts entfernen', category: 'Inhaltsverwaltung' },
  { id: '9', name: 'posts.publish', displayName: 'Inhalte veröffentlichen', description: 'Artikel/Posts publizieren', category: 'Inhaltsverwaltung' },
  
  // Media Management
  { id: '10', name: 'media.upload', displayName: 'Medien hochladen', description: 'Bilder/Dateien hochladen', category: 'Medienverwaltung' },
  { id: '11', name: 'media.read', displayName: 'Medien anzeigen', description: 'Medien-Bibliothek einsehen', category: 'Medienverwaltung' },
  { id: '12', name: 'media.update', displayName: 'Medien bearbeiten', description: 'Medien-Metadaten ändern', category: 'Medienverwaltung' },
  { id: '13', name: 'media.delete', displayName: 'Medien löschen', description: 'Medien entfernen', category: 'Medienverwaltung' },
  
  // System Settings
  { id: '14', name: 'settings.read', displayName: 'Einstellungen anzeigen', description: 'System-Einstellungen einsehen', category: 'System' },
  { id: '15', name: 'settings.update', displayName: 'Einstellungen ändern', description: 'System-Einstellungen bearbeiten', category: 'System' },
  { id: '16', name: 'roles.manage', displayName: 'Rollen verwalten', description: 'Rollen und Berechtigungen verwalten', category: 'System' },
]

export default function RolesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showPermissionMatrix, setShowPermissionMatrix] = useState(false)

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
    if (!session.user.permissions.includes('roles.manage')) {
      router.push('/dashboard?error=NoPermission')
      return
    }

    loadRoles()
  }, [session, status, router])

  const loadRoles = async () => {
    try {
      const response = await fetch('/api/roles')
      if (response.ok) {
        const roleData = await response.json()
        setRoles(roleData)
      } else {
        console.error('Failed to load roles')
      }
    } catch (error) {
      console.error('Error loading roles:', error)
    } finally {
      setLoading(false)
    }
  }

  const createDefaultRoles = () => {
    const defaultRoles: Omit<Role, 'id' | 'createdAt' | 'userCount'>[] = [
      {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Vollzugriff auf alle Funktionen',
        color: '#dc2626',
        permissions: AVAILABLE_PERMISSIONS
      },
      {
        name: 'editor',
        displayName: 'Editor',
        description: 'Kann Inhalte erstellen und bearbeiten',
        color: '#2563eb',
        permissions: AVAILABLE_PERMISSIONS.filter(p => 
          p.category !== 'System' || p.name === 'settings.read'
        )
      },
      {
        name: 'viewer',
        displayName: 'Betrachter',
        description: 'Nur Lesezugriff',
        color: '#16a34a',
        permissions: AVAILABLE_PERMISSIONS.filter(p => p.name.endsWith('.read'))
      }
    ]

    setRoles(defaultRoles.map((role, index) => ({
      ...role,
      id: `role-${index + 1}`,
      createdAt: new Date().toISOString(),
      userCount: index === 0 ? 1 : 0 // Admin role has 1 user (current user)
    })))
  }

  // Create default roles if none exist
  useEffect(() => {
    if (!loading && roles.length === 0) {
      createDefaultRoles()
    }
  }, [loading, roles.length])

  const groupPermissionsByCategory = (permissions: Permission[]) => {
    return permissions.reduce((acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    }, {} as Record<string, Permission[]>)
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
      title="Rollen & Berechtigungen" 
      subtitle="Verwalten Sie Benutzerrollen und deren Zugriffsrechte"
      userEmail={session.user.email}
    >
      {/* Header Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-xl)'
      }}>
        <div>
          <h2 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            margin: '0 0 var(--spacing-xs) 0',
            fontFamily: 'var(--font-family-primary)'
          }}>
            {roles.length} Rollen definiert
          </h2>
          <p style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-grey)',
            margin: 0,
            fontFamily: 'var(--font-family-primary)'
          }}>
            {AVAILABLE_PERMISSIONS.length} Berechtigungen verfügbar
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <button
            onClick={() => setShowPermissionMatrix(!showPermissionMatrix)}
            className="lyd-button secondary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="9" x2="9" y2="21"/>
              <line x1="15" y1="9" x2="15" y2="21"/>
              <line x1="9" y1="15" x2="21" y2="15"/>
            </svg>
            Permission Matrix
          </button>
          
          <button
            onClick={() => {/* TODO: Create new role */}}
            className="lyd-button primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Neue Rolle
          </button>
        </div>
      </div>

      {/* Permission Matrix View */}
      {showPermissionMatrix && (
        <div className="lyd-card elevated" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ 
            padding: 'var(--spacing-lg)',
            borderBottom: '1px solid var(--lyd-line)'
          }}>
            <h3 style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-text)',
              margin: 0,
              fontFamily: 'var(--font-family-primary)'
            }}>
              Berechtigungs-Matrix
            </h3>
          </div>
          
          <div style={{ padding: 'var(--spacing-lg)', overflow: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-family-primary)'
            }}>
              <thead>
                <tr>
                  <th style={{
                    padding: 'var(--spacing-sm)',
                    textAlign: 'left',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--lyd-text)',
                    borderBottom: '2px solid var(--lyd-line)',
                    minWidth: '250px'
                  }}>
                    Berechtigung
                  </th>
                  {roles.map(role => (
                    <th key={role.id} style={{
                      padding: 'var(--spacing-sm)',
                      textAlign: 'center',
                      fontWeight: 'var(--font-weight-bold)',
                      color: role.color,
                      borderBottom: '2px solid var(--lyd-line)',
                      minWidth: '100px'
                    }}>
                      {role.displayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(groupPermissionsByCategory(AVAILABLE_PERMISSIONS)).map(([category, permissions]) => (
                  <>
                    <tr key={category}>
                      <td colSpan={roles.length + 1} style={{
                        padding: 'var(--spacing-md) var(--spacing-sm)',
                        backgroundColor: 'var(--lyd-accent)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--lyd-text)',
                        borderTop: '1px solid var(--lyd-line)'
                      }}>
                        {category}
                      </td>
                    </tr>
                    {permissions.map(permission => (
                      <tr key={permission.id}>
                        <td style={{
                          padding: 'var(--spacing-sm)',
                          borderBottom: '1px solid var(--lyd-line)'
                        }}>
                          <div>
                            <div style={{
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--lyd-text)',
                              marginBottom: '2px'
                            }}>
                              {permission.displayName}
                            </div>
                            <div style={{
                              fontSize: 'var(--font-size-xs)',
                              color: 'var(--lyd-grey)'
                            }}>
                              {permission.description}
                            </div>
                          </div>
                        </td>
                        {roles.map(role => (
                          <td key={`${role.id}-${permission.id}`} style={{
                            padding: 'var(--spacing-sm)',
                            textAlign: 'center',
                            borderBottom: '1px solid var(--lyd-line)'
                          }}>
                            {role.permissions.some(p => p.name === permission.name) ? (
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--lyd-success)',
                                margin: '0 auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                  <polyline points="20,6 9,17 4,12"/>
                                </svg>
                              </div>
                            ) : (
                              <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--lyd-grey)',
                                margin: '0 auto',
                                opacity: 0.3
                              }} />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles List */}
      <div style={{
        display: 'grid',
        gap: 'var(--spacing-lg)',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))'
      }}>
        {roles.map(role => (
          <div key={role.id} className="lyd-card elevated">
            {/* Role Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-md)',
              padding: 'var(--spacing-lg)',
              borderBottom: '1px solid var(--lyd-line)'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: role.color
              }} />
              
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: 'var(--font-size-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-text)',
                  margin: '0 0 4px 0',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  {role.displayName}
                </h3>
                <p style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--lyd-grey)',
                  margin: 0,
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  {role.description}
                </p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-text)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  {role.userCount}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--lyd-grey)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  Benutzer
                </div>
              </div>
            </div>

            {/* Role Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              backgroundColor: 'var(--lyd-accent)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--font-size-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-text)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  {role.permissions.length}
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--lyd-grey)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  Berechtigungen
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'var(--font-size-md)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--lyd-text)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  {Math.round((role.permissions.length / AVAILABLE_PERMISSIONS.length) * 100)}%
                </div>
                <div style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--lyd-grey)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  Abdeckung
                </div>
              </div>
            </div>

            {/* Role Actions */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-lg)'
            }}>
              <button
                onClick={() => setSelectedRole(role)}
                className="lyd-button secondary"
                style={{ flex: 1 }}
              >
                Bearbeiten
              </button>
              
              {role.name !== 'admin' && (
                <button
                  onClick={() => {/* TODO: Delete role */}}
                  className="lyd-button"
                  style={{
                    backgroundColor: 'var(--lyd-error)',
                    borderColor: 'var(--lyd-error)',
                    color: 'white'
                  }}
                >
                  Löschen
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}

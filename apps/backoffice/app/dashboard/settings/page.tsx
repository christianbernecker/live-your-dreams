'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface UserSettings {
  profile: {
    firstName: string
    lastName: string
    email: string
    phone: string
    bio: string
    location: string
    website: string
    timezone: string
    locale: string
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    emailNotifications: boolean
    pushNotifications: boolean
    newsletter: boolean
  }
  security: {
    twoFactorEnabled: boolean
    sessionTimeout: number
    lastPasswordChange: string
  }
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'security'>('profile')
  const [settings, setSettings] = useState<UserSettings>({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      website: '',
      timezone: 'Europe/Berlin',
      locale: 'de'
    },
    preferences: {
      theme: 'light',
      emailNotifications: true,
      pushNotifications: false,
      newsletter: true
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      lastPasswordChange: new Date().toISOString()
    }
  })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Load user settings
  useEffect(() => {
    if (session?.user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          firstName: (session.user as any)?.firstName || '',
          lastName: (session.user as any)?.lastName || '',
          email: session.user.email || '',
          // Load other fields from API in real implementation
        }
      }))
    }
  }, [session])

  const handleSave = async (section: keyof UserSettings) => {
    setSaving(true)
    setMessage(null)

    try {
      // In real implementation, save to API
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      setMessage({ type: 'success', text: 'Einstellungen erfolgreich gespeichert!' })
      
      setTimeout(() => setMessage(null), 3000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Fehler beim Speichern der Einstellungen.' })
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'profile' as const, label: 'Profil', icon: '👤' },
    { id: 'preferences' as const, label: 'Einstellungen', icon: '⚙️' },
    { id: 'security' as const, label: 'Sicherheit', icon: '🔒' },
  ]

  return (
    <div style={{ padding: 'var(--spacing-xl)', maxWidth: '800px' }}>
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        <h1 style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--lyd-text)',
          margin: '0 0 var(--spacing-xs) 0',
          fontFamily: 'var(--font-family-primary)'
        }}>
          Einstellungen
        </h1>
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--lyd-grey)',
          margin: 0,
          fontFamily: 'var(--font-family-primary)'
        }}>
          Verwalte dein Profil, Einstellungen und Sicherheitsoptionen
        </p>
      </div>

      {/* Message */}
      {message && (
        <div style={{
          marginBottom: 'var(--spacing-lg)',
          padding: 'var(--spacing-md)',
          borderRadius: '8px',
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          color: message.type === 'success' ? '#059669' : '#dc2626'
        }}>
          {message.text}
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-sm)',
        marginBottom: 'var(--spacing-xl)',
        borderBottom: '1px solid var(--lyd-line)',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--spacing-md) var(--spacing-lg)',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-md)',
              fontFamily: 'var(--font-family-primary)',
              color: activeTab === tab.id ? 'var(--lyd-primary)' : 'var(--lyd-grey)',
              borderBottom: activeTab === tab.id ? '2px solid var(--lyd-primary)' : '2px solid transparent',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)'
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="lyd-card">
        <div style={{ padding: 'var(--spacing-xl)' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--lyd-text)',
                margin: '0 0 var(--spacing-lg) 0',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Profil Informationen
              </h2>

              <div style={{
                display: 'grid',
                gap: 'var(--spacing-lg)',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    marginBottom: 'var(--spacing-xs)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Vorname
                  </label>
                  <input
                    type="text"
                    value={settings.profile.firstName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, firstName: e.target.value }
                    }))}
                    className="lyd-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    marginBottom: 'var(--spacing-xs)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Nachname
                  </label>
                  <input
                    type="text"
                    value={settings.profile.lastName}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, lastName: e.target.value }
                    }))}
                    className="lyd-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    marginBottom: 'var(--spacing-xs)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    E-Mail
                  </label>
                  <input
                    type="email"
                    value={settings.profile.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value }
                    }))}
                    className="lyd-input"
                    style={{ width: '100%' }}
                  />
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    marginBottom: 'var(--spacing-xs)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={settings.profile.phone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, phone: e.target.value }
                    }))}
                    className="lyd-input"
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 'var(--spacing-lg)' }}>
                <label style={{
                  display: 'block',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--lyd-text)',
                  marginBottom: 'var(--spacing-xs)',
                  fontFamily: 'var(--font-family-primary)'
                }}>
                  Bio
                </label>
                <textarea
                  value={settings.profile.bio}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    profile: { ...prev.profile, bio: e.target.value }
                  }))}
                  className="lyd-input"
                  style={{ width: '100%', height: '100px', resize: 'vertical' }}
                  placeholder="Erzähle etwas über dich..."
                />
              </div>

              <div style={{
                marginTop: 'var(--spacing-xl)',
                display: 'flex',
                justifyContent: 'end'
              }}>
                <button
                  onClick={() => handleSave('profile')}
                  disabled={saving}
                  className="lyd-button primary"
                  style={{
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Speichern...' : 'Profil Speichern'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div>
              <h2 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--lyd-text)',
                margin: '0 0 var(--spacing-lg) 0',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Einstellungen
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    marginBottom: 'var(--spacing-xs)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Theme
                  </label>
                  <select
                    value={settings.preferences.theme}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' | 'system' }
                    }))}
                    className="lyd-select"
                    style={{ width: '200px' }}
                  >
                    <option value="light">Hell</option>
                    <option value="dark">Dunkel</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-md)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    <input
                      type="checkbox"
                      checked={settings.preferences.emailNotifications}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, emailNotifications: e.target.checked }
                      }))}
                      style={{ marginRight: 'var(--spacing-sm)' }}
                    />
                    E-Mail Benachrichtigungen
                  </label>
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-md)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    <input
                      type="checkbox"
                      checked={settings.preferences.newsletter}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, newsletter: e.target.checked }
                      }))}
                      style={{ marginRight: 'var(--spacing-sm)' }}
                    />
                    Newsletter abonnieren
                  </label>
                </div>
              </div>

              <div style={{
                marginTop: 'var(--spacing-xl)',
                display: 'flex',
                justifyContent: 'end'
              }}>
                <button
                  onClick={() => handleSave('preferences')}
                  disabled={saving}
                  className="lyd-button primary"
                  style={{
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Speichern...' : 'Einstellungen Speichern'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h2 style={{
                fontSize: 'var(--font-size-xl)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--lyd-text)',
                margin: '0 0 var(--spacing-lg) 0',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Sicherheit
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <div className="lyd-card" style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--lyd-accent)' }}>
                  <h3 style={{
                    fontSize: 'var(--font-size-md)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    margin: '0 0 var(--spacing-sm) 0',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Passwort ändern
                  </h3>
                  <p style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--lyd-grey)',
                    marginBottom: 'var(--spacing-md)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Letztes Update: {new Date().toLocaleDateString('de-DE')}
                  </p>
                  <button className="lyd-button secondary">
                    Passwort ändern
                  </button>
                </div>

                <div>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontSize: 'var(--font-size-md)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorEnabled}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        security: { ...prev.security, twoFactorEnabled: e.target.checked }
                      }))}
                      style={{ marginRight: 'var(--spacing-sm)' }}
                    />
                    Zwei-Faktor-Authentifizierung aktivieren
                  </label>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--lyd-text)',
                    marginBottom: 'var(--spacing-xs)',
                    fontFamily: 'var(--font-family-primary)'
                  }}>
                    Session Timeout (Minuten)
                  </label>
                  <input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                    }))}
                    className="lyd-input"
                    style={{ width: '150px' }}
                    min="5"
                    max="480"
                  />
                </div>
              </div>

              <div style={{
                marginTop: 'var(--spacing-xl)',
                display: 'flex',
                justifyContent: 'end'
              }}>
                <button
                  onClick={() => handleSave('security')}
                  disabled={saving}
                  className="lyd-button primary"
                  style={{
                    opacity: saving ? 0.7 : 1,
                    cursor: saving ? 'not-allowed' : 'pointer'
                  }}
                >
                  {saving ? 'Speichern...' : 'Sicherheit Speichern'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

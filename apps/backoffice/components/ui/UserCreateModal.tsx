'use client'

import React, { useState } from 'react'
import { Modal } from './Modal'

interface UserCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: (user: any) => void
}

export function UserCreateModal({ isOpen, onClose, onUserCreated }: UserCreateModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'viewer',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) newErrors.email = 'E-Mail ist erforderlich'
    if (!formData.firstName) newErrors.firstName = 'Vorname ist erforderlich'
    if (!formData.lastName) newErrors.lastName = 'Nachname ist erforderlich'
    if (!formData.password) newErrors.password = 'Passwort ist erforderlich'
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein'
    }
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Passwort muss mindestens 8 Zeichen lang sein'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          password: formData.password
        })
      })

      if (response.ok) {
        const newUser = await response.json()
        onUserCreated(newUser)
        handleClose()
      } else {
        const errorData = await response.json()
        setErrors({ submit: errorData.error || 'Fehler beim Erstellen des Benutzers' })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      setErrors({ submit: 'Ein unerwarteter Fehler ist aufgetreten' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'viewer',
      password: '',
      confirmPassword: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Neuen Benutzer erstellen" maxWidth="600px">
      <form onSubmit={handleSubmit}>
        <div style={{
          display: 'grid',
          gap: 'var(--spacing-lg)'
        }}>
          {/* Email */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--lyd-text)',
              fontFamily: 'var(--font-family-primary)'
            }}>
              E-Mail-Adresse *
            </label>
            <input
              type="email"
              className="lyd-input"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="benutzer@liveyourdreams.online"
              style={{
                width: '100%',
                borderColor: errors.email ? 'var(--lyd-error)' : undefined
              }}
              required
            />
            {errors.email && (
              <p style={{
                color: 'var(--lyd-error)',
                fontSize: 'var(--font-size-xs)',
                margin: '4px 0 0 0'
              }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Name Fields */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Vorname *
              </label>
              <input
                type="text"
                className="lyd-input"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="Max"
                style={{
                  width: '100%',
                  borderColor: errors.firstName ? 'var(--lyd-error)' : undefined
                }}
                required
              />
              {errors.firstName && (
                <p style={{
                  color: 'var(--lyd-error)',
                  fontSize: 'var(--font-size-xs)',
                  margin: '4px 0 0 0'
                }}>
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Nachname *
              </label>
              <input
                type="text"
                className="lyd-input"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Mustermann"
                style={{
                  width: '100%',
                  borderColor: errors.lastName ? 'var(--lyd-error)' : undefined
                }}
                required
              />
              {errors.lastName && (
                <p style={{
                  color: 'var(--lyd-error)',
                  fontSize: 'var(--font-size-xs)',
                  margin: '4px 0 0 0'
                }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Role */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-xs)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: 'var(--lyd-text)',
              fontFamily: 'var(--font-family-primary)'
            }}>
              Rolle *
            </label>
            <select
              className="lyd-input"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              style={{ width: '100%' }}
              required
            >
              <option value="viewer">Viewer - Nur Lesezugriff</option>
              <option value="editor">Editor - Inhalte bearbeiten</option>
              <option value="admin">Administrator - Vollzugriff</option>
            </select>
          </div>

          {/* Password Fields */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--spacing-md)'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Passwort *
              </label>
              <input
                type="password"
                className="lyd-input"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="Mindestens 8 Zeichen"
                style={{
                  width: '100%',
                  borderColor: errors.password ? 'var(--lyd-error)' : undefined
                }}
                required
              />
              {errors.password && (
                <p style={{
                  color: 'var(--lyd-error)',
                  fontSize: 'var(--font-size-xs)',
                  margin: '4px 0 0 0'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: 'var(--spacing-xs)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--lyd-text)',
                fontFamily: 'var(--font-family-primary)'
              }}>
                Passwort bestätigen *
              </label>
              <input
                type="password"
                className="lyd-input"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Passwort wiederholen"
                style={{
                  width: '100%',
                  borderColor: errors.confirmPassword ? 'var(--lyd-error)' : undefined
                }}
                required
              />
              {errors.confirmPassword && (
                <p style={{
                  color: 'var(--lyd-error)',
                  fontSize: 'var(--font-size-xs)',
                  margin: '4px 0 0 0'
                }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: 'var(--border-radius-md)',
              color: 'var(--lyd-error)',
              fontSize: 'var(--font-size-sm)',
              borderLeft: '4px solid var(--lyd-error)'
            }}>
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            justifyContent: 'flex-end',
            marginTop: 'var(--spacing-lg)',
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid var(--lyd-line)'
          }}>
            <button
              type="button"
              onClick={handleClose}
              className="lyd-button secondary"
              disabled={loading}
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="lyd-button primary"
              disabled={loading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}
            >
              {loading && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{
                    animation: 'spin 1s linear infinite'
                  }}
                >
                  <path d="M21 12a9 9 0 11-6.219-8.56"/>
                </svg>
              )}
              {loading ? 'Erstelle...' : 'Benutzer erstellen'}
            </button>
          </div>
        </div>
      </form>

      {/* Add CSS for spin animation */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Modal>
  )
}

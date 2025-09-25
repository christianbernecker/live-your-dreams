'use client'

import React from 'react'
import { Modal } from './Modal'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'default' | 'danger' | 'warning'
  loading?: boolean
}

export function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  type = 'default',
  loading = false
}: ConfirmDialogProps) {
  
  const getIconAndColors = (type: string) => {
    switch (type) {
      case 'danger':
        return {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          ),
          iconColor: 'var(--lyd-error)',
          iconBg: 'rgba(239, 68, 68, 0.1)',
          confirmButtonClass: 'lyd-button',
          confirmButtonStyle: {
            backgroundColor: 'var(--lyd-error)',
            borderColor: 'var(--lyd-error)'
          }
        }
      case 'warning':
        return {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          ),
          iconColor: 'var(--lyd-warning)',
          iconBg: 'rgba(245, 158, 11, 0.1)',
          confirmButtonClass: 'lyd-button',
          confirmButtonStyle: {
            backgroundColor: 'var(--lyd-warning)',
            borderColor: 'var(--lyd-warning)'
          }
        }
      default:
        return {
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          ),
          iconColor: 'var(--lyd-primary)',
          iconBg: 'rgba(59, 130, 246, 0.1)',
          confirmButtonClass: 'lyd-button primary',
          confirmButtonStyle: {}
        }
    }
  }

  const { icon, iconColor, iconBg, confirmButtonClass, confirmButtonStyle } = getIconAndColors(type)

  const handleConfirm = async () => {
    if (!loading) {
      await onConfirm()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="450px">
      <div style={{
        textAlign: 'center',
        padding: 'var(--spacing-md) 0'
      }}>
        {/* Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: iconBg,
          color: iconColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto var(--spacing-lg)'
        }}>
          {icon}
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--lyd-text)',
          margin: '0 0 var(--spacing-md) 0',
          fontFamily: 'var(--font-family-primary)'
        }}>
          {title}
        </h2>

        {/* Message */}
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--lyd-grey)',
          margin: '0 0 var(--spacing-2xl) 0',
          lineHeight: '1.5',
          fontFamily: 'var(--font-family-primary)'
        }}>
          {message}
        </p>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          justifyContent: 'center'
        }}>
          <button
            onClick={onClose}
            disabled={loading}
            className="lyd-button secondary"
            style={{
              minWidth: '120px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {cancelText}
          </button>
          
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={confirmButtonClass}
            style={{
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--spacing-sm)',
              ...confirmButtonStyle
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
            {loading ? 'Wird ausgeführt...' : confirmText}
          </button>
        </div>
      </div>

      {/* Spinner Animation */}
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

// Helper hook for common confirm dialogs
export function useConfirmDialog() {
  const [dialog, setDialog] = React.useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void | Promise<void>
    type?: 'default' | 'danger' | 'warning'
    confirmText?: string
    cancelText?: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  })
  
  const [loading, setLoading] = React.useState(false)

  const confirm = (options: {
    title: string
    message: string
    onConfirm: () => void | Promise<void>
    type?: 'default' | 'danger' | 'warning'
    confirmText?: string
    cancelText?: string
  }) => {
    setDialog({
      isOpen: true,
      ...options
    })
  }

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await dialog.onConfirm()
      setDialog(prev => ({ ...prev, isOpen: false }))
    } catch (error) {
      console.error('Confirm dialog error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setDialog(prev => ({ ...prev, isOpen: false }))
    }
  }

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={dialog.isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={dialog.title}
      message={dialog.message}
      confirmText={dialog.confirmText}
      cancelText={dialog.cancelText}
      type={dialog.type}
      loading={loading}
    />
  )

  return {
    confirm,
    ConfirmDialog: ConfirmDialogComponent
  }
}

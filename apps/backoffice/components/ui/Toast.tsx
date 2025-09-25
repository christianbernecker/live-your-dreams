'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void
  hideToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: React.ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id, duration: toast.duration || 5000 }
    
    setToasts(prev => [...prev, newToast])

    // Auto-hide after duration
    setTimeout(() => {
      hideToast(id)
    }, newToast.duration)
  }

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onHide: (id: string) => void
}

function ToastContainer({ toasts, onHide }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-sm)',
        maxWidth: '400px'
      }}
    >
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </div>
  )
}

interface ToastItemProps {
  toast: Toast
  onHide: (id: string) => void
}

function ToastItem({ toast, onHide }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => onHide(toast.id), 300)
  }

  const getToastStyles = (type: ToastType) => {
    const baseStyles = {
      padding: 'var(--spacing-md)',
      borderRadius: 'var(--border-radius-lg)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: 'var(--spacing-sm)',
      minWidth: '350px',
      maxWidth: '400px',
      transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.3s ease',
      fontFamily: 'var(--font-family-primary)'
    }

    switch (type) {
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(22, 163, 74, 0.1)',
          borderLeft: '4px solid var(--lyd-success)',
          color: 'var(--lyd-success)'
        }
      case 'error':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderLeft: '4px solid var(--lyd-error)',
          color: 'var(--lyd-error)'
        }
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderLeft: '4px solid var(--lyd-warning)',
          color: 'var(--lyd-warning)'
        }
      case 'info':
        return {
          ...baseStyles,
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          borderLeft: '4px solid var(--lyd-primary)',
          color: 'var(--lyd-primary)'
        }
      default:
        return baseStyles
    }
  }

  const getIcon = (type: ToastType) => {
    const iconProps = {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }

    switch (type) {
      case 'success':
        return (
          <svg {...iconProps}>
            <path d="M9 12l2 2 4-4"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        )
      case 'error':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        )
      case 'warning':
        return (
          <svg {...iconProps}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        )
      case 'info':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        )
    }
  }

  return (
    <div style={getToastStyles(toast.type)}>
      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: '2px' }}>
        {getIcon(toast.type)}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--lyd-text)',
          marginBottom: toast.description ? 'var(--spacing-xs)' : 0
        }}>
          {toast.title}
        </div>
        
        {toast.description && (
          <div style={{
            fontSize: 'var(--font-size-xs)',
            color: 'var(--lyd-grey)',
            lineHeight: '1.4'
          }}>
            {toast.description}
          </div>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--lyd-grey)',
          cursor: 'pointer',
          padding: 'var(--spacing-xs)',
          borderRadius: 'var(--border-radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        title="Schließen"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}

// Helper functions for common toast types
export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    // This will be implemented in the component that uses ToastProvider
    console.log('Success toast:', { title, description, duration })
  },
  error: (title: string, description?: string, duration?: number) => {
    console.log('Error toast:', { title, description, duration })
  },
  warning: (title: string, description?: string, duration?: number) => {
    console.log('Warning toast:', { title, description, duration })
  },
  info: (title: string, description?: string, duration?: number) => {
    console.log('Info toast:', { title, description, duration })
  }
}

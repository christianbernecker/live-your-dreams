'use client'

import React, { useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  maxWidth?: string
}

export function Modal({ isOpen, onClose, title, children, maxWidth = '500px' }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--spacing-lg)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="lyd-card elevated"
        style={{
          maxWidth,
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--lyd-line)'
        }}>
          <h2 style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--lyd-text)',
            margin: 0,
            fontFamily: 'var(--font-family-primary)'
          }}>
            {title}
          </h2>
          
          <button
            onClick={onClose}
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
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--lyd-accent)'
              e.currentTarget.style.color = 'var(--lyd-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--lyd-grey)'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: 'var(--spacing-lg)' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

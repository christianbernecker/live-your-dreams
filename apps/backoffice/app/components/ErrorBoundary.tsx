'use client'

import React from 'react'
import Link from 'next/link'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return <FallbackComponent error={this.state.error!} resetError={this.resetError} />
      }

      return <DefaultErrorFallback error={this.state.error!} resetError={this.resetError} />
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--lyd-gradient-subtle, #fafafa)' }}>
      <div className="lyd-card elevated" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="lyd-card-header text-center">
          <div style={{ 
            fontSize: 'var(--font-size-lg)',
            color: 'var(--lyd-error)',
            marginBottom: 'var(--spacing-md)',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 'var(--font-weight-bold)'
          }}>
            ⚠️ Ein Fehler ist aufgetreten
          </div>
          <p style={{ 
            color: 'var(--lyd-grey)',
            fontSize: 'var(--font-size-sm)',
            fontFamily: 'var(--font-family-primary)',
            marginBottom: 'var(--spacing-lg)'
          }}>
            Das Backoffice hat einen unerwarteten Fehler festgestellt.
          </p>
        </div>

        <div className="lyd-card-body">
          <div style={{
            backgroundColor: 'var(--lyd-error-bg, #fef2f2)',
            border: '1px solid var(--lyd-error-border, #fecaca)',
            borderRadius: 'var(--border-radius-md)',
            padding: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-lg)',
            fontFamily: 'monospace',
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-error)'
          }}>
            <strong>Fehler:</strong> {error.message}
          </div>

          <div className="flex space-x-4">
            <button
              onClick={resetError}
              className="lyd-button primary"
              style={{ fontFamily: 'var(--font-family-primary)' }}
            >
              Erneut versuchen
            </button>
            <Link href="/" className="lyd-button secondary">
              Zur Startseite
            </Link>
          </div>
        </div>

        <div className="lyd-card-footer" style={{ textAlign: 'center' as const }}>
          <small style={{ 
            color: 'var(--lyd-grey)', 
            fontFamily: 'var(--font-family-primary)',
            fontSize: 'var(--font-size-xs)'
          }}>
            Bei wiederholten Problemen kontaktieren Sie den Support.
          </small>
        </div>
      </div>
    </div>
  )
}

// Hook für funktionale Komponenten
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

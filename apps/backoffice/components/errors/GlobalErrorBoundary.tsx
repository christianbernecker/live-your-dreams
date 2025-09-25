'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Log to external service in production
    this.logError(error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })
  }

  private logError = (error: Error, errorInfo?: ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
    }

    // In production, send to logging service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, or custom logging service
      console.error('Production Error:', errorData)
    } else {
      console.error('Development Error:', errorData)
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  private handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-xl)',
          backgroundColor: 'var(--lyd-background)'
        }}>
          <div className="lyd-card" style={{
            maxWidth: '600px',
            textAlign: 'center',
            padding: 'var(--spacing-xl)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              margin: '0 auto var(--spacing-lg)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="32" height="32" fill="none" stroke="#dc2626" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 style={{
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--lyd-text)',
              margin: '0 0 var(--spacing-md) 0',
              fontFamily: 'var(--font-family-primary)'
            }}>
              Oops! Ein Fehler ist aufgetreten
            </h1>

            <p style={{
              fontSize: 'var(--font-size-md)',
              color: 'var(--lyd-grey)',
              margin: '0 0 var(--spacing-lg) 0',
              fontFamily: 'var(--font-family-primary)'
            }}>
              Entschuldigung, es ist ein unerwarteter Fehler aufgetreten. 
              Unser Team wurde automatisch benachrichtigt.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{
                marginBottom: 'var(--spacing-lg)',
                textAlign: 'left',
                backgroundColor: '#f8f9fa',
                padding: 'var(--spacing-md)',
                borderRadius: '8px',
                fontSize: 'var(--font-size-sm)',
                fontFamily: 'monospace'
              }}>
                <summary style={{ cursor: 'pointer', marginBottom: 'var(--spacing-sm)' }}>
                  Error Details (Development)
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  wordBreak: 'break-word',
                  margin: 0,
                  color: '#dc2626'
                }}>
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div style={{
              display: 'flex',
              gap: 'var(--spacing-md)',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={this.handleRetry}
                className="lyd-button primary"
              >
                Erneut versuchen
              </button>

              <button
                onClick={this.handleReload}
                className="lyd-button secondary"
              >
                Seite neu laden
              </button>

              <a
                href="/dashboard"
                className="lyd-button secondary"
                style={{ textDecoration: 'none' }}
              >
                Zum Dashboard
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default GlobalErrorBoundary

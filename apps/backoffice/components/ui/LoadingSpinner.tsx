'use client'

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'white' | 'grey'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary',
  className 
}: LoadingSpinnerProps) {
  const getSizeStyles = (size: string) => {
    switch (size) {
      case 'sm':
        return { width: '16px', height: '16px' }
      case 'lg':
        return { width: '32px', height: '32px' }
      default:
        return { width: '24px', height: '24px' }
    }
  }

  const getColorStyles = (color: string) => {
    switch (color) {
      case 'white':
        return { color: 'white' }
      case 'grey':
        return { color: 'var(--lyd-grey)' }
      default:
        return { color: 'var(--lyd-primary)' }
    }
  }

  return (
    <div
      className={className}
      style={{
        display: 'inline-block',
        animation: 'spin 1s linear infinite',
        ...getSizeStyles(size),
        ...getColorStyles(color)
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ width: '100%', height: '100%' }}
      >
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      
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
    </div>
  )
}

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
  children?: React.ReactNode
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Laden...', 
  children 
}: LoadingOverlayProps) {
  if (!isVisible) return <>{children}</>

  return (
    <div style={{ position: 'relative' }}>
      {children}
      
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--spacing-md)',
          zIndex: 100,
          minHeight: '200px'
        }}
      >
        <LoadingSpinner size="lg" />
        <p style={{
          fontSize: 'var(--font-size-md)',
          color: 'var(--lyd-text)',
          margin: 0,
          fontFamily: 'var(--font-family-primary)',
          fontWeight: 'var(--font-weight-medium)'
        }}>
          {message}
        </p>
      </div>
    </div>
  )
}

interface ProgressBarProps {
  progress: number // 0-100
  showPercentage?: boolean
  color?: 'primary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ProgressBar({ 
  progress, 
  showPercentage = true,
  color = 'primary',
  size = 'md',
  className 
}: ProgressBarProps) {
  const getHeightStyles = (size: string) => {
    switch (size) {
      case 'sm':
        return { height: '6px' }
      case 'lg':
        return { height: '12px' }
      default:
        return { height: '8px' }
    }
  }

  const getColorStyles = (color: string) => {
    switch (color) {
      case 'success':
        return { backgroundColor: 'var(--lyd-success)' }
      case 'warning':
        return { backgroundColor: 'var(--lyd-warning)' }
      case 'error':
        return { backgroundColor: 'var(--lyd-error)' }
      default:
        return { backgroundColor: 'var(--lyd-primary)' }
    }
  }

  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  return (
    <div className={className}>
      {showPercentage && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xs)'
        }}>
          <span style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-text)',
            fontFamily: 'var(--font-family-primary)',
            fontWeight: 'var(--font-weight-medium)'
          }}>
            Fortschritt
          </span>
          <span style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--lyd-grey)',
            fontFamily: 'var(--font-family-primary)'
          }}>
            {Math.round(clampedProgress)}%
          </span>
        </div>
      )}
      
      <div
        style={{
          backgroundColor: 'var(--lyd-accent)',
          borderRadius: 'var(--border-radius-full)',
          overflow: 'hidden',
          ...getHeightStyles(size)
        }}
      >
        <div
          style={{
            ...getHeightStyles(size),
            width: `${clampedProgress}%`,
            borderRadius: 'var(--border-radius-full)',
            transition: 'width 0.3s ease',
            ...getColorStyles(color)
          }}
        />
      </div>
    </div>
  )
}

interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ 
  width = '100%', 
  height = '1rem',
  borderRadius = 'var(--border-radius-md)',
  className,
  style
}: SkeletonProps) {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--lyd-accent)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        ...style
      }}
    >
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  )
}

// Card Skeleton for loading states
export function CardSkeleton() {
  return (
    <div className="lyd-card" style={{ padding: 'var(--spacing-lg)' }}>
      <Skeleton height="1.5rem" style={{ marginBottom: 'var(--spacing-md)' }} />
      <Skeleton height="1rem" style={{ marginBottom: 'var(--spacing-sm)' }} />
      <Skeleton height="1rem" width="75%" style={{ marginBottom: 'var(--spacing-md)' }} />
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        <Skeleton width="100px" height="2rem" />
        <Skeleton width="80px" height="2rem" />
      </div>
    </div>
  )
}

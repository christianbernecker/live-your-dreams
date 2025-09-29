/**
 * Design System Alert Component
 * 
 * Based on: /design-system/v2/components/alert/index.html
 */

import React from 'react';

interface AlertProps {
  /** Alert content */
  children: React.ReactNode;
  /** Alert variant */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** Alert title */
  title?: string;
  /** Custom className */
  className?: string;
  /** Dismissible alert */
  dismissible?: boolean;
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Icon element */
  icon?: React.ReactNode;
}

export function Alert({
  children,
  variant = 'info',
  title,
  className = '',
  dismissible = false,
  onDismiss,
  icon
}: AlertProps) {
  const variantClass = variant !== 'info' ? `lyd-alert-${variant}` : '';
  const classes = ['lyd-alert', variantClass, className]
    .filter(Boolean)
    .join(' ');

  const defaultIcons = {
    info: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    ),
    success: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22,4 12,14.01 9,11.01"/>
      </svg>
    ),
    warning: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    error: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    )
  };

  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={classes}>
      <div className="lyd-alert-content" style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
        {displayIcon && (
          <div className="lyd-alert-icon" style={{ flexShrink: 0, marginTop: '2px' }}>
            {displayIcon}
          </div>
        )}
        
        <div className="lyd-alert-body" style={{ flex: 1 }}>
          {title && (
            <div 
              className="lyd-alert-title"
              style={{
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-semibold)',
                marginBottom: title && children ? 'var(--spacing-xs)' : 0,
                fontFamily: 'var(--font-family-primary)'
              }}
            >
              {title}
            </div>
          )}
          
          <div 
            className="lyd-alert-description"
            style={{
              fontSize: 'var(--font-size-sm)',
              fontFamily: 'var(--font-family-primary)',
              lineHeight: 1.5
            }}
          >
            {children}
          </div>
        </div>
        
        {dismissible && onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="lyd-alert-dismiss"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--spacing-xs)',
              margin: '-4px -4px -4px 0',
              borderRadius: 'var(--border-radius)',
              color: 'inherit',
              opacity: 0.7,
              fontSize: '18px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

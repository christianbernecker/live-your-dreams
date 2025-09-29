/**
 * Design System Badge Component
 * 
 * Based on: /design-system/v2/components/badge/index.html
 */

import React from 'react';

interface BadgeProps {
  /** Badge content */
  children: React.ReactNode;
  /** Badge variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  /** Badge size */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Custom className */
  className?: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Removable badge with close button */
  removable?: boolean;
  /** Remove handler */
  onRemove?: () => void;
}

export function Badge({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  icon,
  removable = false,
  onRemove
}: BadgeProps) {
  const variantClass = variant !== 'secondary' ? variant : '';
  const sizeClass = size !== 'md' ? size : '';
  const classes = ['lyd-badge', variantClass, sizeClass, className]
    .filter(Boolean)
    .join(' ');

  // Fallback styles for badge variants
  const getVariantStyles = () => {
    const baseStyle = {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: '12px',
      fontWeight: '500',
      textTransform: 'none' as const,
      fontSize: size === 'xs' ? '11px' : size === 'sm' ? '12px' : size === 'lg' ? '14px' : '13px',
      padding: size === 'xs' ? '2px 6px' : size === 'sm' ? '2px 8px' : size === 'lg' ? '4px 12px' : '3px 10px',
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-primary, #3b82f6)',
          color: 'white'
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-secondary, #f1f5f9)',
          color: 'var(--lyd-text-primary, #1e293b)'
        };
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-success, #10b981)',
          color: 'white'
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-warning, #f59e0b)',
          color: 'white'
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-error, #ef4444)',
          color: 'white'
        };
      case 'info':
        return {
          ...baseStyle,
          backgroundColor: 'var(--lyd-info, #3b82f6)',
          color: 'white'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <span className={classes} style={getVariantStyles()}>
      {icon && (
        <span className="lyd-badge-icon" style={{ marginRight: '4px' }}>
          {icon}
        </span>
      )}
      
      <span className="lyd-badge-content">
        {children}
      </span>
      
      {removable && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="lyd-badge-remove"
          style={{
            background: 'transparent',
            border: 'none',
            marginLeft: '4px',
            cursor: 'pointer',
            color: 'inherit',
            opacity: 0.7,
            fontSize: '14px',
            padding: 0,
            lineHeight: 1
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}

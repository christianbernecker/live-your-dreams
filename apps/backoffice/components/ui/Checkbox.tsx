/**
 * Design System Checkbox Component
 * 
 * Based on: /design-system/v2/components/checkbox/index.html
 */

import React, { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text */
  label?: string;
  /** Help text */
  helpText?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Checkbox size */
  size?: 'sm' | 'md' | 'lg';
  /** Indeterminate state */
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  helpText,
  error = false,
  errorMessage,
  size = 'md',
  indeterminate = false,
  className = '',
  id,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClass = size !== 'md' ? `lyd-checkbox-${size}` : '';
  const errorClass = error ? 'lyd-checkbox-error' : '';
  const classes = ['lyd-checkbox', sizeClass, errorClass, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="lyd-checkbox-group">
      <div className="lyd-checkbox-wrapper" style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-sm)' }}>
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          className={classes}
          {...props}
          style={{
            ...props.style,
            ...(indeterminate && { indeterminate: true })
          }}
        />
        
        {label && (
          <label 
            htmlFor={checkboxId}
            className="lyd-checkbox-label"
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-medium)',
              color: error ? 'var(--lyd-error)' : 'var(--lyd-text)',
              fontFamily: 'var(--font-family-primary)',
              cursor: 'pointer',
              lineHeight: 1.4
            }}
          >
            {label}
          </label>
        )}
      </div>
      
      {(helpText || errorMessage) && (
        <div 
          className="lyd-checkbox-help"
          style={{
            marginTop: 'var(--spacing-xs)',
            marginLeft: '24px', // Align with label
            fontSize: 'var(--font-size-xs)',
            color: error ? 'var(--lyd-error)' : 'var(--lyd-text-secondary)',
            fontFamily: 'var(--font-family-primary)'
          }}
        >
          {error ? errorMessage : helpText}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// ============================================================================
// CHECKBOX GROUP COMPONENT
// ============================================================================

interface CheckboxGroupProps {
  /** Group label */
  label?: string;
  /** Help text */
  helpText?: string;
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Children checkboxes */
  children: React.ReactNode;
  /** Required indicator */
  required?: boolean;
}

export function CheckboxGroup({
  label,
  helpText,
  error = false,
  errorMessage,
  children,
  required = false
}: CheckboxGroupProps) {
  return (
    <fieldset className="lyd-checkbox-fieldset" style={{ border: 'none', padding: 0, margin: 0 }}>
      {label && (
        <legend 
          className="lyd-fieldset-label"
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: error ? 'var(--lyd-error)' : 'var(--lyd-text)',
            fontFamily: 'var(--font-family-primary)',
            marginBottom: 'var(--spacing-sm)',
            padding: 0
          }}
        >
          {label}
          {required && (
            <span 
              style={{ 
                color: 'var(--lyd-error)', 
                marginLeft: 'var(--spacing-xs)' 
              }}
            >
              *
            </span>
          )}
        </legend>
      )}
      
      <div className="lyd-checkbox-group-content" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
        {children}
      </div>
      
      {(helpText || errorMessage) && (
        <div 
          className="lyd-checkbox-group-help"
          style={{
            marginTop: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-xs)',
            color: error ? 'var(--lyd-error)' : 'var(--lyd-text-secondary)',
            fontFamily: 'var(--font-family-primary)'
          }}
        >
          {error ? errorMessage : helpText}
        </div>
      )}
    </fieldset>
  );
}


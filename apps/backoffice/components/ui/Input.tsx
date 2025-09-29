/**
 * Design System Input Component
 * 
 * Provides styled input functionality following the LYD Design System
 */

import React, { forwardRef } from 'react';

// ============================================================================
// INPUT COMPONENT
// ============================================================================

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Input variant */
  variant?: 'default' | 'filled' | 'outline';
  /** Input size */
  size?: 'small' | 'default' | 'large';
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Help text */
  helpText?: string;
  /** Label text */
  label?: string;
  /** Required indicator */
  required?: boolean;
  /** Icon element */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'default',
  error = false,
  errorMessage,
  helpText,
  label,
  required = false,
  icon,
  iconPosition = 'left',
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const variantClass = variant !== 'default' ? `lyd-input-${variant}` : '';
  const sizeClass = size !== 'default' ? `lyd-input-${size}` : '';
  const errorClass = error ? 'lyd-input-error' : '';
  const iconClass = icon ? `lyd-input-with-icon lyd-input-icon-${iconPosition}` : '';
  
  const inputClasses = [
    // 'lyd-input', // REMOVED: Avoiding CSS conflicts with globals.css
    variantClass,
    sizeClass,
    errorClass,
    iconClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="lyd-input-group">
      {label && (
        <label 
          htmlFor={inputId}
          className="lyd-label"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs, 4px)',
            fontSize: 'var(--font-size-sm, 14px)',
            fontWeight: 'var(--font-weight-medium, 500)',
            color: error ? 'var(--lyd-error, #ef4444)' : 'var(--lyd-text, #374151)',
            fontFamily: 'var(--font-family-primary, system-ui)',
            height: '20px' // Consistent label height
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
        </label>
      )}
      
      <div className="lyd-input-wrapper" style={{ position: 'relative' }}>
        {icon && iconPosition === 'left' && (
          <div 
            className="lyd-input-icon lyd-input-icon-left"
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--lyd-text-secondary, #6b7280)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          style={{
            width: '100%',
            height: '40px',
            padding: iconPosition === 'left' ? '0 12px 0 40px' : iconPosition === 'right' ? '0 40px 0 12px' : '0 12px',
            fontSize: '14px',
            lineHeight: '20px', // EXPLICIT line-height for consistent text positioning
            fontFamily: 'var(--font-family-primary, system-ui)',
            border: error ? '1px solid var(--lyd-error, #ef4444)' : '1px solid var(--lyd-border, #d1d5db)',
            borderRadius: '6px',
            backgroundColor: props.disabled ? 'var(--lyd-gray-50, #f9fafb)' : 'white',
            color: props.disabled ? 'var(--lyd-text-disabled, #9ca3af)' : 'var(--lyd-text, #374151)',
            outline: 'none',
            transition: 'all 0.15s ease',
            boxSizing: 'border-box',
            display: 'block', // EXPLICIT display to ensure consistent behavior
            verticalAlign: 'top', // PREVENT baseline alignment issues
            ...props.style
          }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div 
            className="lyd-input-icon lyd-input-icon-right"
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--lyd-text-secondary, #6b7280)',
              pointerEvents: 'none',
              zIndex: 1
            }}
          >
            {icon}
          </div>
        )}
      </div>
      
      {(errorMessage || helpText) && (
        <div 
          className="lyd-input-help"
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
    </div>
  );
});

Input.displayName = 'Input';

// ============================================================================
// TEXTAREA COMPONENT
// ============================================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state */
  error?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Help text */
  helpText?: string;
  /** Label text */
  label?: string;
  /** Required indicator */
  required?: boolean;
  /** Auto-resize */
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  error = false,
  errorMessage,
  helpText,
  label,
  required = false,
  autoResize = false,
  className = '',
  id,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const errorClass = error ? 'lyd-textarea-error' : '';
  const resizeClass = autoResize ? 'lyd-textarea-auto' : '';
  
  const textareaClasses = [
    'lyd-textarea',
    errorClass,
    resizeClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="lyd-textarea-group">
      {label && (
        <label 
          htmlFor={textareaId}
          className="lyd-label"
          style={{
            display: 'block',
            marginBottom: 'var(--spacing-xs)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            color: error ? 'var(--lyd-error)' : 'var(--lyd-text)',
            fontFamily: 'var(--font-family-primary)'
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
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        className={textareaClasses}
        {...props}
      />
      
      {(errorMessage || helpText) && (
        <div 
          className="lyd-textarea-help"
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
    </div>
  );
});

Textarea.displayName = 'Textarea';

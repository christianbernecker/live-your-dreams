/**
 * Design System Select Component
 * 
 * Provides styled select functionality following the LYD Design System
 */

import React, { forwardRef } from 'react';

// ============================================================================
// SELECT COMPONENT
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Select options */
  options: SelectOption[];
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
  /** Placeholder option */
  placeholder?: string;
  /** Loading state */
  loading?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  error = false,
  errorMessage,
  helpText,
  label,
  required = false,
  placeholder = 'Auswählen...',
  loading = false,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const errorClass = error ? 'lyd-select-error' : '';
  const loadingClass = loading ? 'lyd-select-loading' : '';
  
  const selectClasses = [
    'lyd-select',
    errorClass,
    loadingClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="lyd-select-group">
      {label && (
        <label 
          htmlFor={selectId}
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
      
      <div className="lyd-select-wrapper" style={{ position: 'relative' }}>
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          disabled={loading || props.disabled}
          style={{
            width: '100%',
            padding: '8px 12px',
            fontSize: '14px',
            fontFamily: 'var(--font-family-primary, system-ui)',
            border: error ? '1px solid var(--lyd-error, #ef4444)' : '1px solid var(--lyd-border, #d1d5db)',
            borderRadius: '6px',
            backgroundColor: props.disabled ? 'var(--lyd-gray-50, #f9fafb)' : 'white',
            color: props.disabled ? 'var(--lyd-text-disabled, #9ca3af)' : 'var(--lyd-text, #374151)',
            cursor: props.disabled ? 'not-allowed' : 'pointer',
            appearance: 'none',
            backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23374151' stroke-width='2'><polyline points='6,9 12,15 18,9'/></svg>")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 8px center',
            backgroundSize: '16px',
            paddingRight: '32px',
            outline: 'none',
            transition: 'all 0.15s ease',
            // Focus styles via pseudo-class are handled by CSS classes
          }}
          {...props}
        >
          {placeholder && !props.value && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option) => (
            <option 
              key={option.value} 
              value={option.value}
              disabled={option.disabled || loading}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {loading && (
          <div 
            className="lyd-select-loading-icon"
            style={{
              position: 'absolute',
              right: 'var(--spacing-md)',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          >
            <div className="lyd-spinner" style={{ width: '16px', height: '16px' }} />
          </div>
        )}
      </div>
      
      {(errorMessage || helpText) && (
        <div 
          className="lyd-select-help"
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

Select.displayName = 'Select';

// ============================================================================
// MULTI-SELECT COMPONENT
// ============================================================================

interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  helpText?: string;
  required?: boolean;
  disabled?: boolean;
}

export function MultiSelect({
  options,
  value,
  onChange,
  label,
  placeholder = 'Mehrere auswählen...',
  error = false,
  errorMessage,
  helpText,
  required = false,
  disabled = false
}: MultiSelectProps) {
  const selectId = `multi-select-${Math.random().toString(36).substr(2, 9)}`;
  
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <div className="lyd-multi-select-group">
      {label && (
        <label 
          htmlFor={selectId}
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
      
      <div 
        className={`lyd-multi-select ${error ? 'lyd-multi-select-error' : ''}`}
        id={selectId}
      >
        {options.map((option) => (
          <label 
            key={option.value}
            className="lyd-checkbox-group"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-sm)',
              padding: 'var(--spacing-sm)',
              cursor: disabled || option.disabled ? 'not-allowed' : 'pointer',
              opacity: disabled || option.disabled ? 0.5 : 1
            }}
          >
            <input
              type="checkbox"
              checked={value.includes(option.value)}
              onChange={(e) => handleChange(option.value, e.target.checked)}
              disabled={disabled || option.disabled}
              className="lyd-checkbox"
            />
            <span className="lyd-text-sm">{option.label}</span>
          </label>
        ))}
      </div>
      
      {(errorMessage || helpText) && (
        <div 
          className="lyd-multi-select-help"
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
}

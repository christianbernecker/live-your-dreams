/**
 * Input-Like Select Component
 * 
 * COMPLETELY NEW APPROACH: Make CustomSelect identical to Input structure
 * Same DOM structure, same CSS properties, same behavior
 */

'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// INPUT-LIKE SELECT COMPONENT
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface InputLikeSelectProps {
  /** Select options */
  options: SelectOption[];
  /** Current value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
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
  /** Placeholder text */
  placeholder?: string;
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
  /** Custom ID */
  id?: string;
  /** Custom inline styles */
  style?: React.CSSProperties;
}

export const InputLikeSelect = React.forwardRef<HTMLInputElement, InputLikeSelectProps>(({
  options = [],
  value = '',
  onChange,
  error = false,
  errorMessage,
  helpText,
  label,
  required = false,
  placeholder = 'Auswählen...',
  loading = false,
  disabled = false,
  className = '',
  id,
  style
}, ref) => {
  const generatedId = useId();
  const selectId = id || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  // Find selected option
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // PORTAL: Create dropdown at document.body level
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalContainer(document.body);
  }, []);

  const updateDropdownPosition = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  };

  const toggleDropdown = () => {
    if (disabled || loading) return;
    if (!isOpen) {
      updateDropdownPosition();
    }
    setIsOpen(!isOpen);
    setFocusedIndex(-1);
  };

  const handleSelectOption = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    const handleResize = () => {
      if (isOpen) {
        updateDropdownPosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleResize);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled || loading) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          const option = options[focusedIndex];
          if (!option.disabled) {
            handleSelectOption(option.value);
          }
        } else {
          toggleDropdown();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          updateDropdownPosition();
        } else {
          setFocusedIndex(prev => {
            const nextIndex = prev < options.length - 1 ? prev + 1 : 0;
            return options[nextIndex]?.disabled ? (nextIndex + 1) % options.length : nextIndex;
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          updateDropdownPosition();
        } else {
          setFocusedIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : options.length - 1;
            return options[nextIndex]?.disabled ? Math.max(0, nextIndex - 1) : nextIndex;
          });
        }
        break;
    }
  };

  return (
    <div className={`lyd-input-group ${className}`}>
      {label && (
        <label 
          htmlFor={selectId}
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
                color: 'var(--lyd-error, #ef4444)', 
                marginLeft: 'var(--spacing-xs, 4px)' 
              }}
            >
              *
            </span>
          )}
        </label>
      )}
      
      <div 
        ref={wrapperRef}
        className="lyd-input-wrapper" 
        style={{ position: 'relative' }}
      >
        {/* FAKE INPUT that looks identical to real Input component */}
        <input
          ref={inputRef}
          id={selectId}
          type="text"
          value={displayText}
          readOnly
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          style={{
            width: '100%',
            height: '40px',
            padding: '0 32px 0 12px', // Space for dropdown arrow
            fontSize: '14px',
            lineHeight: '20px',
            fontFamily: 'var(--font-family-primary, system-ui)',
            border: error ? '1px solid var(--lyd-error, #ef4444)' : '1px solid var(--lyd-border, #d1d5db)',
            borderRadius: '6px',
            backgroundColor: disabled ? 'var(--lyd-gray-50, #f9fafb)' : 'white',
            color: disabled ? 'var(--lyd-text-disabled, #9ca3af)' : !selectedOption ? 'var(--lyd-text-secondary, #6b7280)' : 'var(--lyd-text, #374151)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease',
            boxSizing: 'border-box',
            display: 'block',
            verticalAlign: 'top',
            ...style // Allow custom styles to override defaults
          }}
          placeholder={placeholder}
        />
        
        {/* Dropdown Arrow - positioned like Input icon */}
        <div
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: `translateY(-50%) ${isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}`,
            color: 'var(--lyd-text-secondary, #6b7280)',
            pointerEvents: 'none',
            zIndex: 1,
            transition: 'transform 0.15s ease'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"/>
          </svg>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div 
            style={{
              position: 'absolute',
              right: '32px',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none'
            }}
          >
            <div 
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid var(--lyd-gray-200, #e5e7eb)',
                borderTop: '2px solid var(--lyd-primary, #3b82f6)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} 
            />
          </div>
        )}
      </div>

      {/* Help Text */}
      {(errorMessage || helpText) && (
        <div 
          className="lyd-input-help"
          style={{
            marginTop: 'var(--spacing-xs, 4px)',
            fontSize: 'var(--font-size-xs, 12px)',
            color: error ? 'var(--lyd-error, #ef4444)' : 'var(--lyd-text-secondary, #6b7280)',
            fontFamily: 'var(--font-family-primary, system-ui)'
          }}
        >
          {error ? errorMessage : helpText}
        </div>
      )}

      {/* PORTAL DROPDOWN - Rendered at document.body level */}
      {isOpen && portalContainer ? createPortal(
        <div
          role="listbox"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 2147483647, // MAXIMUM z-index
            backgroundColor: 'white',
            border: '1px solid var(--lyd-border, #d1d5db)',
            borderRadius: '6px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {options.length === 0 ? (
            <div
              style={{
                padding: '8px 12px',
                color: 'var(--lyd-text-secondary, #6b7280)',
                fontSize: '14px'
              }}
            >
              Keine Optionen verfügbar
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                onClick={() => !option.disabled && handleSelectOption(option.value)}
                onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-family-primary, system-ui)',
                  color: option.disabled ? 'var(--lyd-text-disabled, #9ca3af)' : 'var(--lyd-text, #374151)',
                  backgroundColor: 
                    option.value === value ? 'var(--lyd-primary-50, #eff6ff)' :
                    focusedIndex === index ? 'var(--lyd-gray-50, #f9fafb)' :
                    'transparent',
                  cursor: option.disabled ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {option.value === value && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                )}
                <span style={{ flex: 1 }}>{option.label}</span>
              </div>
            ))
          )}
        </div>,
        portalContainer
      ) as React.ReactNode : null}

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
});

InputLikeSelect.displayName = 'InputLikeSelect';

export default InputLikeSelect;

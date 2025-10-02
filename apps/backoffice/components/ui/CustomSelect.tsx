/**
 * Custom Design System Select Component
 * 
 * Provides fully styleable select functionality following the LYD Design System
 * Replaces native <select> for complete control over dropdown appearance
 */

'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// CUSTOM SELECT COMPONENT
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface CustomSelectProps {
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
}

export const CustomSelect = forwardRef<HTMLDivElement, CustomSelectProps>(({
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
  id
}, ref) => {
  const selectId = id || `custom-select-${Math.random().toString(36).substr(2, 9)}`;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Client-side only rendering
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Find selected option
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside both trigger and dropdown
      if (
        triggerRef.current && !triggerRef.current.contains(event.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(event.target as Node)
      ) {
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

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    
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
          setIsOpen(!isOpen);
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
        } else {
          setFocusedIndex(prev => {
            const nextIndex = prev < options.length - 1 ? prev + 1 : 0;
            return options[nextIndex]?.disabled ? nextIndex + 1 : nextIndex;
          });
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => {
            const nextIndex = prev > 0 ? prev - 1 : options.length - 1;
            return options[nextIndex]?.disabled ? nextIndex - 1 : nextIndex;
          });
        }
        break;
    }
  };

  const handleSelectOption = (optionValue: string) => {
    onChange?.(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
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

  return (
    <div className={`lyd-custom-select-group ${className}`}>
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
        ref={dropdownRef}
        className="lyd-custom-select-wrapper" 
        style={{ position: 'relative' }}
      >
        {/* Select Trigger */}
        <div
          ref={triggerRef}
          id={selectId}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={disabled ? -1 : 0}
          onClick={toggleDropdown}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '40px',
            padding: '0 12px',
            fontSize: '14px',
            lineHeight: '20px', // EXACT same line-height as Input
            fontFamily: 'var(--font-family-primary, system-ui)',
            border: error ? '1px solid var(--lyd-error, #ef4444)' : '1px solid var(--lyd-border, #d1d5db)',
            borderRadius: '6px',
            backgroundColor: disabled ? 'var(--lyd-gray-50, #f9fafb)' : 'white',
            color: disabled ? 'var(--lyd-text-disabled, #9ca3af)' : !selectedOption ? 'var(--lyd-text-secondary, #6b7280)' : 'var(--lyd-text, #374151)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: 'all 0.15s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
            verticalAlign: 'top' // MATCH Input's vertical alignment
          }}
        >
          <span>{displayText}</span>
          <div
            style={{
              marginLeft: '8px',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.15s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6,9 12,15 18,9"/>
            </svg>
          </div>
        </div>

        {/* Dropdown Options - REACT PORTAL to render outside DOM tree */}
        {(isOpen && isMounted) ? createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            className="lyd-custom-select-portal-dropdown"
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 2147483647, // MAXIMUM 32-bit integer z-index
              backgroundColor: 'white',
              border: '1px solid var(--lyd-border, #d1d5db)',
              borderRadius: '6px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
              maxHeight: '200px',
              overflowY: 'auto',
              isolation: 'isolate'
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
          document.body
        ) as React.ReactNode : null}

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
      
      {(errorMessage || helpText) && (
        <div 
          className="lyd-select-help"
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

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;

/**
 * LYD Select Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import React, { useEffect, useRef, useState } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface LYDSelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
  id?: string;
  name?: string;
  searchable?: boolean;
}

export const LYDSelect: React.FC<LYDSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Auswählen...',
  disabled = false,
  required = false,
  error,
  label,
  helper,
  size = 'default',
  className = '',
  id,
  name,
  searchable = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Design System Klassen
  const baseClasses = ['lyd-select'];
  
  if (size !== 'default') {
    baseClasses.push(`lyd-select-${size}`);
  }
  
  if (error) {
    baseClasses.push('lyd-select-error');
  }
  
  if (disabled) {
    baseClasses.push('lyd-select-disabled');
  }
  
  if (isOpen) {
    baseClasses.push('lyd-select-open');
  }
  
  if (className) {
    baseClasses.push(className);
  }

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="lyd-form-group">
      {label && (
        <label htmlFor={id} className="lyd-label">
          {label}
          {required && <span className="lyd-label-required">*</span>}
        </label>
      )}
      
      <div className={baseClasses.join(' ')} ref={selectRef}>
        <div
          className="lyd-select-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span className="lyd-select-value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg className="lyd-select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
        
        {isOpen && (
          <div className="lyd-select-dropdown">
            {searchable && (
              <div className="lyd-select-search">
                <input
                  type="text"
                  className="lyd-select-search-input"
                  placeholder="Suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            
            <ul className="lyd-select-options" role="listbox">
              {filteredOptions.length === 0 ? (
                <li className="lyd-select-option lyd-select-option-empty">
                  Keine Optionen gefunden
                </li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`lyd-select-option ${
                      option.value === value ? 'lyd-select-option-selected' : ''
                    } ${option.disabled ? 'lyd-select-option-disabled' : ''}`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
      
      {error && (
        <div className="lyd-input-error-message">
          {error}
        </div>
      )}
      
      {helper && !error && (
        <div className="lyd-input-helper">
          {helper}
        </div>
      )}
    </div>
  );
};

export default LYDSelect;


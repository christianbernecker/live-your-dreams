import React from 'react';

export interface LdsSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface LdsSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  hint?: string;
  options: LdsSelectOption[];
  placeholder?: string;
  required?: boolean;
}

export function LdsSelect({
  label,
  error,
  hint,
  options,
  placeholder,
  required,
  className = '',
  id,
  ...props
}: LdsSelectProps) {
  const selectId = id || React.useId();
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;
  
  // NUR CSS-Module-Klassen verwenden - KEIN Tailwind!
  const selectClasses = [
    'lds-select',
    error && 'lds-select--error',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="lds-select-group">
      {label && (
        <label 
          htmlFor={selectId} 
          className={`lds-select-label ${required ? 'lds-select-label--required' : ''}`}
        >
          {label}
        </label>
      )}
      
      <select
        id={selectId}
        className={selectClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value} 
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {hint && !error && (
        <p id={hintId} className="lds-select-hint">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="lds-select-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

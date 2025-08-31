import React from 'react';
import '@lifeyourdreams/design-system/dist/styles/components/input.css';

export interface LdsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

export function LdsInput({
  label,
  error,
  hint,
  required,
  className = '',
  id,
  ...props
}: LdsInputProps) {
  const inputId = id || React.useId();
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  
  // NUR CSS-Module-Klassen verwenden - KEIN Tailwind!
  const inputClasses = [
    'lds-input',
    error && 'lds-input--error',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="lds-input-group">
      {label && (
        <label 
          htmlFor={inputId} 
          className={`lds-input-label ${required ? 'lds-input-label--required' : ''}`}
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        {...props}
      />
      
      {hint && !error && (
        <p id={hintId} className="lds-input-hint">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="lds-input-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

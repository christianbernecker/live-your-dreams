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
  
  const baseClasses = 'block w-full px-3 py-2 border rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed';
  const errorClasses = error 
    ? 'border-error focus:ring-error' 
    : 'border-gray-300 focus:ring-brand';
  
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      
      <select
        id={selectId}
        className={`${baseClasses} ${errorClasses} ${className}`}
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
        <p id={hintId} className="text-xs text-gray-500">
          {hint}
        </p>
      )}
      
      {error && (
        <p id={errorId} className="text-xs text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * LYD Checkbox Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import { CheckIcon } from '@/components/icons/LYDIcons';
import React from 'react';

export interface LYDCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
  id?: string;
  name?: string;
  value?: string;
  indeterminate?: boolean;
}

export const LYDCheckbox: React.FC<LYDCheckboxProps> = ({
  checked = false,
  onChange,
  disabled = false,
  required = false,
  error,
  label,
  helper,
  size = 'default',
  className = '',
  id,
  name,
  value,
  indeterminate = false
}) => {
  // Design System Klassen
  const baseClasses = ['lyd-checkbox-wrapper'];
  
  if (size !== 'default') {
    baseClasses.push(`lyd-checkbox-${size}`);
  }
  
  if (error) {
    baseClasses.push('lyd-checkbox-error');
  }
  
  if (disabled) {
    baseClasses.push('lyd-checkbox-disabled');
  }
  
  if (className) {
    baseClasses.push(className);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <div className="lyd-form-group">
      <div className={baseClasses.join(' ')}>
        <label className="lyd-checkbox-label">
          <input
            type="checkbox"
            id={id}
            name={name}
            value={value}
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            className="lyd-checkbox-input"
          />
          
          <span className={`lyd-checkbox-box ${indeterminate ? 'indeterminate' : ''}`}>
            {checked && !indeterminate && (
              <CheckIcon size="sm" className="lyd-checkbox-check" />
            )}
            {indeterminate && (
              <div className="lyd-checkbox-indeterminate" />
            )}
          </span>
          
          {label && (
            <span className="lyd-checkbox-text">
              {label}
              {required && <span className="lyd-label-required">*</span>}
            </span>
          )}
        </label>
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

// Checkbox Group für multiple Checkboxes
export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface LYDCheckboxGroupProps {
  options: CheckboxOption[];
  value?: string[];
  onChange?: (values: string[]) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  size?: 'small' | 'default' | 'large';
  className?: string;
  direction?: 'horizontal' | 'vertical';
}

export const LYDCheckboxGroup: React.FC<LYDCheckboxGroupProps> = ({
  options,
  value = [],
  onChange,
  disabled = false,
  required = false,
  error,
  label,
  helper,
  size = 'default',
  className = '',
  direction = 'vertical'
}) => {
  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    if (!onChange) return;

    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter(v => v !== optionValue));
    }
  };

  return (
    <div className="lyd-form-group">
      {label && (
        <label className="lyd-label">
          {label}
          {required && <span className="lyd-label-required">*</span>}
        </label>
      )}
      
      <div className={`lyd-checkbox-group lyd-checkbox-group-${direction} ${className}`}>
        {options.map((option) => (
          <LYDCheckbox
            key={option.value}
            label={option.label}
            checked={value.includes(option.value)}
            onChange={(checked) => handleCheckboxChange(option.value, checked)}
            disabled={disabled || option.disabled}
            size={size}
          />
        ))}
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

export default LYDCheckbox;


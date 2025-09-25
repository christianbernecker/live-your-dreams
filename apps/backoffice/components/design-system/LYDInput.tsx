/**
 * LYD Input Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import React from 'react';

export interface LYDInputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'small' | 'default' | 'large';
  className?: string;
  id?: string;
  name?: string;
}

export const LYDInput: React.FC<LYDInputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  error,
  label,
  helper,
  icon,
  iconPosition = 'left',
  size = 'default',
  className = '',
  id,
  name
}) => {
  // Design System Klassen basierend auf master.css
  const baseClasses = ['lyd-input'];
  
  // Size Klassen
  if (size !== 'default') {
    baseClasses.push(`lyd-input-${size}`);
  }
  
  // State Klassen
  if (error) {
    baseClasses.push('lyd-input-error');
  }
  
  if (disabled) {
    baseClasses.push('lyd-input-disabled');
  }
  
  // Icon Klassen
  if (icon) {
    baseClasses.push(`lyd-input-with-icon lyd-input-icon-${iconPosition}`);
  }
  
  // Custom Classes
  if (className) {
    baseClasses.push(className);
  }
  
  const finalClassName = baseClasses.join(' ');

  return (
    <div className="lyd-form-group">
      {label && (
        <label htmlFor={id} className="lyd-label">
          {label}
          {required && <span className="lyd-label-required">*</span>}
        </label>
      )}
      
      <div className="lyd-input-wrapper">
        {icon && iconPosition === 'left' && (
          <div className="lyd-input-icon lyd-input-icon-left">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          id={id}
          name={name}
          className={finalClassName}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="lyd-input-icon lyd-input-icon-right">
            {icon}
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

// Specialized Input Components
export const SearchInput: React.FC<Omit<LYDInputProps, 'type'>> = (props) => (
  <LYDInput type="search" {...props} />
);

export const EmailInput: React.FC<Omit<LYDInputProps, 'type'>> = (props) => (
  <LYDInput type="email" {...props} />
);

export const PasswordInput: React.FC<Omit<LYDInputProps, 'type'>> = (props) => (
  <LYDInput type="password" {...props} />
);

export const NumberInput: React.FC<Omit<LYDInputProps, 'type'>> = (props) => (
  <LYDInput type="number" {...props} />
);

export default LYDInput;


/**
 * LYD Textarea Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import React from 'react';

export interface LYDTextareaProps {
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helper?: string;
  rows?: number;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  size?: 'small' | 'default' | 'large';
  className?: string;
  id?: string;
  name?: string;
}

export const LYDTextarea: React.FC<LYDTextareaProps> = ({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  required = false,
  error,
  label,
  helper,
  rows = 4,
  maxLength,
  resize = 'vertical',
  size = 'default',
  className = '',
  id,
  name
}) => {
  // Design System Klassen basierend auf master.css
  const baseClasses = ['lyd-textarea'];
  
  // Size Klassen
  if (size !== 'default') {
    baseClasses.push(`lyd-textarea-${size}`);
  }
  
  // State Klassen
  if (error) {
    baseClasses.push('lyd-textarea-error');
  }
  
  if (disabled) {
    baseClasses.push('lyd-textarea-disabled');
  }
  
  // Resize Klassen
  if (resize !== 'vertical') {
    baseClasses.push(`lyd-textarea-resize-${resize}`);
  }
  
  // Custom Classes
  if (className) {
    baseClasses.push(className);
  }
  
  const finalClassName = baseClasses.join(' ');

  // Character count helper
  const currentLength = value?.length || 0;
  const showCharCount = maxLength !== undefined;

  return (
    <div className="lyd-form-group">
      {label && (
        <label htmlFor={id} className="lyd-label">
          {label}
          {required && <span className="lyd-label-required">*</span>}
        </label>
      )}
      
      <div className="lyd-textarea-wrapper">
        <textarea
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
          rows={rows}
          maxLength={maxLength}
          style={{ resize }}
        />
        
        {showCharCount && (
          <div className="lyd-textarea-char-count">
            <span className={currentLength > maxLength! * 0.9 ? 'lyd-text-warning' : ''}>
              {currentLength}
            </span>
            {maxLength && (
              <span className="lyd-text-muted">
                /{maxLength}
              </span>
            )}
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

export default LYDTextarea;


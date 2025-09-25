/**
 * LYD Button Component - 100% Design System konform
 * Nutzt master.css Klassen von https://designsystem.liveyourdreams.online
 */

import React from 'react';

export interface LYDButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
  size?: 'small' | 'default' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

export const LYDButton: React.FC<LYDButtonProps> = ({
  variant = 'primary',
  size = 'default',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  children,
  onClick,
  type = 'button',
  className = ''
}) => {
  // Design System Klassen basierend auf master.css
  const baseClasses = ['lyd-button'];
  
  // Variant Klassen
  baseClasses.push(`lyd-button-${variant}`);
  
  // Size Klassen
  if (size !== 'default') {
    baseClasses.push(size);
  }
  
  // State Klassen
  if (loading) {
    baseClasses.push('loading');
  }
  
  if (disabled) {
    baseClasses.push('disabled');
  }
  
  // Icon Only Check
  if (icon && !children) {
    baseClasses.push('icon-only');
  }
  
  // Custom Classes
  if (className) {
    baseClasses.push(className);
  }
  
  const finalClassName = baseClasses.join(' ');

  return (
    <button
      type={type}
      className={finalClassName}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <>
          <div className="luxury-spinner" />
          {children && <span>Loading...</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children && <span>{children}</span>}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};

// Button Group Component für zusammenhängende Actions
export interface LYDButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const LYDButtonGroup: React.FC<LYDButtonGroupProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`lyd-button-group ${className}`}>
      {children}
    </div>
  );
};

// Commonly used Button Variants für Backoffice
export const PrimaryButton: React.FC<Omit<LYDButtonProps, 'variant'>> = (props) => (
  <LYDButton variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<LYDButtonProps, 'variant'>> = (props) => (
  <LYDButton variant="secondary" {...props} />
);

export const OutlineButton: React.FC<Omit<LYDButtonProps, 'variant'>> = (props) => (
  <LYDButton variant="outline" {...props} />
);

export const GhostButton: React.FC<Omit<LYDButtonProps, 'variant'>> = (props) => (
  <LYDButton variant="ghost" {...props} />
);

export const GlassButton: React.FC<Omit<LYDButtonProps, 'variant'>> = (props) => (
  <LYDButton variant="glass" {...props} />
);

export default LYDButton;

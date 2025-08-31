import React from 'react';
import '@liveyourdreams/design-system/dist/styles/components/button.css';

export interface LdsButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function LdsButton({
  variant = 'primary',
  size = 'md',
  disabled,
  className = '',
  children,
  ...props
}: LdsButtonProps) {
  // NUR CSS-Module-Klassen verwenden - KEIN Tailwind!
  const classes = [
    'lds-button',
    `lds-button--${variant}`,
    `lds-button--${size}`,
    disabled && 'lds-button--disabled',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  );
}

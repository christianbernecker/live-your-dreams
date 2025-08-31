import React from 'react';
import '@lifeyourdreams/design-system/dist/styles/components/badge.css';

export interface LdsBadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function LdsBadge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: LdsBadgeProps) {
  // NUR CSS-Module-Klassen verwenden - KEIN Tailwind!
  const classes = [
    'lds-badge',
    `lds-badge--${variant}`,
    `lds-badge--${size}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
}

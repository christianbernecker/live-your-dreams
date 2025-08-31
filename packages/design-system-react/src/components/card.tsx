import React from 'react';
import '@lifeyourdreams/design-system/dist/styles/components/card.css';

export interface LdsCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
}

export function LdsCard({
  children,
  className = '',
  padding = 'md',
  shadow = 'sm'
}: LdsCardProps) {
  // NUR CSS-Module-Klassen verwenden - KEIN Tailwind!
  const classes = [
    'lds-card',
    `lds-card--padding-${padding}`,
    `lds-card--shadow-${shadow}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export function LdsCardHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`lds-card-header ${className}`}>
      {children}
    </div>
  );
}

export function LdsCardTitle({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={`lds-card-title ${className}`}>
      {children}
    </h3>
  );
}

import React from 'react';
import '@lifeyourdreams/design-tokens/dist/css/tokens.css';
import '@lifeyourdreams/design-system/dist/styles/global.css';

export interface LdsProviderProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  locale?: string;
}

export function LdsProvider({ 
  children, 
  theme = 'light', 
  locale = 'de' 
}: LdsProviderProps) {
  return (
    <div className={`lds-theme-${theme}`} data-locale={locale}>
      {children}
    </div>
  );
}

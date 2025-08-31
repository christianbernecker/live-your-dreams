import React from 'react';
import '@liveyourdreams/design-tokens/dist/css/tokens.css';
import '@liveyourdreams/design-system/dist/styles/global.css';

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

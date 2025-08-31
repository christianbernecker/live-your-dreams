'use client';

import { LdsProvider } from '@lifeyourdreams/design-system-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LdsProvider theme="light" locale="de">
      {children}
    </LdsProvider>
  );
}

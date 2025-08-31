'use client';

import { SessionProvider } from 'next-auth/react';
import { LdsProvider } from '@liveyourdreams/design-system-react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LdsProvider theme="light" locale="de">
        {children}
      </LdsProvider>
    </SessionProvider>
  );
}
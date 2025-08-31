import '@lifeyourdreams/design-tokens/dist/css/tokens.css';
import '@lifeyourdreams/design-system/dist/styles/global.css';
import { LdsProvider } from '@lifeyourdreams/design-system-react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <LdsProvider theme="light" locale="de">
          {children}
        </LdsProvider>
      </body>
    </html>
  );
}

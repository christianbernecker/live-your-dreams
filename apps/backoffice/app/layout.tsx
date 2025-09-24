// DESIGN SYSTEM CSS - AKTIVIERT FÜR RADIKALE UI-ÜBERARBEITUNG
import './globals.css';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

// apps/backoffice/app/layout.tsx - DESIGN SYSTEM FOUNDATIONS
import { Inter } from 'next/font/google';
import "./globals.css"; // Jetzt mit @layer foundations
import { Providers } from './providers';

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',  // Optimized font loading
  variable: '--font-inter'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="lyd-shell">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
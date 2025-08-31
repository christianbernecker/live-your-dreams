import '@liveyourdreams/design-tokens/dist/css/tokens.css';
import '@liveyourdreams/design-system/dist/styles/global.css';
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

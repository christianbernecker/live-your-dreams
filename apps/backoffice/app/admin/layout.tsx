import { auth } from '@/lib/nextauth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Admin-Check (nur christianbernecker@gmail.com hat Zugriff)
  if (!session?.user || session.user.email !== 'christianbernecker@gmail.com') {
    redirect('/dashboard');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--lyd-bg)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--spacing-xl)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 'var(--spacing-lg)' }}>
          API Key & Cost Monitoring
        </h1>
        {children}
      </div>
    </div>
  );
}

export default function ApiKeysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 600, marginBottom: 'var(--spacing-xl)' }}>
        API Key & Cost Monitoring
      </h1>
      {children}
    </div>
  );
}

import { LdsButton } from '@lifeyourdreams/design-system-react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand mb-4">
            Life Your Dreams
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Backoffice für Immobilienvermarktung
          </p>
          <LdsButton variant="primary" size="lg">
            Jetzt starten
          </LdsButton>
        </div>
      </div>
    </main>
  );
}

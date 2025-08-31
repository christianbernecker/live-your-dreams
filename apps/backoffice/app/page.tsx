'use client';

import { LdsButton } from '@liveyourdreams/design-system-react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-brand mb-4">
            Live Your Dreams
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Backoffice für Immobilienvermarktung
          </p>
          <div className="space-x-4">
            <LdsButton 
              variant="primary" 
              size="lg"
              onClick={() => router.push('/dashboard')}
            >
              Dashboard öffnen
            </LdsButton>
            <LdsButton 
              variant="outline" 
              size="lg"
              onClick={() => router.push('/properties')}
            >
              Immobilien verwalten
            </LdsButton>
          </div>
        </div>
      </div>
    </main>
  );
}
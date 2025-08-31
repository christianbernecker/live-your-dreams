'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LdsCard, 
  LdsCardHeader, 
  LdsCardTitle, 
  LdsInput, 
  LdsButton 
} from '@liveyourdreams/design-system-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        setError('Ungültige Anmeldedaten');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Anmeldefehler');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand">Live Your Dreams</h1>
          <p className="mt-2 text-gray-600">Backoffice Anmeldung</p>
        </div>
        
        <LdsCard>
          <LdsCardHeader>
            <LdsCardTitle>Anmelden</LdsCardTitle>
          </LdsCardHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 p-6 pt-0">
            <LdsInput
              label="E-Mail-Adresse"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              error={error && !email ? 'E-Mail-Adresse erforderlich' : undefined}
            />
            
            <LdsInput
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              error={error && !password ? 'Passwort erforderlich' : undefined}
            />
            
            {error && (
              <div className="text-sm text-error bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <LdsButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading || !email || !password}
              className="w-full"
            >
              {loading ? 'Anmelden...' : 'Anmelden'}
            </LdsButton>
          </form>
        </LdsCard>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Demo-Zugang: admin@liveyourdreams.online / admin123
          </p>
        </div>
      </div>
    </div>
  );
}

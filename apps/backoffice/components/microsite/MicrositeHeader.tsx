import React from 'react';
import { LdsBadge } from '@liveyourdreams/design-system-react';

interface MicrositeHeaderProps {
  propertyTitle: string;
  agentName: string;
  agentEmail: string;
  isPublished: boolean;
}

export function MicrositeHeader({ propertyTitle, agentName, agentEmail, isPublished }: MicrositeHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="text-2xl font-bold text-blue-600">
              Live Your Dreams
            </div>
            {!isPublished && (
              <LdsBadge variant="warning">🔒 Vorschau</LdsBadge>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-gray-600">Ihr Ansprechpartner:</div>
              <div className="font-medium">{agentName}</div>
            </div>
            <a
              href={`mailto:${agentEmail}?subject=Interesse: ${propertyTitle}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              📧 Kontakt
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

import React from 'react';

interface MicrositeFooterProps {
  agentName: string;
  companyName: string;
}

export function MicrositeFooter({ agentName, companyName }: MicrositeFooterProps) {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{companyName}</h3>
            <p className="text-gray-300 text-sm">
              Ihr Partner für Immobilien in München und Umgebung. 
              Wir machen Ihre Träume wahr.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Ihr Ansprechpartner</h3>
            <p className="text-gray-300">{agentName}</p>
            <p className="text-gray-300 text-sm mt-2">
              Immobilienmakler & Berater
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Rechtliches</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <a href="/impressum" className="hover:text-white transition-colors">
                Impressum
              </a>
              <a href="/datenschutz" className="hover:text-white transition-colors">
                Datenschutz
              </a>
              <a href="/agb" className="hover:text-white transition-colors">
                AGB
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>© 2024 {companyName}. Alle Rechte vorbehalten.</p>
          <p className="mt-1">
            Erstellt mit ❤️ für erstklassige Immobilienpräsentation
          </p>
        </div>
      </div>
    </footer>
  );
}

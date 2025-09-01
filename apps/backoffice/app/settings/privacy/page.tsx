'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  LdsCard,
  LdsCardHeader,
  LdsCardTitle,
  LdsCardContent,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

import { ConsentManager } from '@/components/gdpr/ConsentManager';

interface DeletionInfo {
  accountInfo: {
    email: string;
    name?: string;
    createdAt: string;
    role: string;
  };
  dataToDelete: {
    properties: number;
    media: number;
    rooms: number;
    leads: number;
    listings: number;
  };
}

/**
 * Privacy Settings Page
 * 
 * DSGVO-Compliance Dashboard für:
 * - Datenexport (Art. 15)
 * - Datenlöschung (Art. 17)
 * - Cookie-Einstellungen
 * - Privacy-Informationen
 */
export default function PrivacySettingsPage() {
  const { data: session } = useSession();
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingData, setIsDeletingData] = useState(false);
  const [showConsentManager, setShowConsentManager] = useState(false);
  const [showDeletionConfirm, setShowDeletionConfirm] = useState(false);
  const [deletionInfo, setDeletionInfo] = useState<DeletionInfo | null>(null);
  const [confirmationText, setConfirmationText] = useState('');

  /**
   * Load deletion info
   */
  useEffect(() => {
    if (showDeletionConfirm && !deletionInfo) {
      loadDeletionInfo();
    }
  }, [showDeletionConfirm]);

  /**
   * Load data deletion information
   */
  const loadDeletionInfo = async () => {
    try {
      const response = await fetch('/api/gdpr/delete/info');
      if (response.ok) {
        const data = await response.json();
        setDeletionInfo(data);
      } else {
        alert('Fehler beim Laden der Löschinformationen');
      }
    } catch (error) {
      console.error('Error loading deletion info:', error);
      alert('Fehler beim Laden der Löschinformationen');
    }
  };

  /**
   * Export user data
   */
  const handleDataExport = async (format: 'json' | 'csv' = 'json', includeMedia = false) => {
    setIsExporting(true);
    
    try {
      const response = await fetch('/api/gdpr/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format,
          includeMedia
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Export fehlgeschlagen');
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `gdpr-export-${Date.now()}.${format}`;
        
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error('Export error:', error);
      alert(error instanceof Error ? error.message : 'Export fehlgeschlagen');
    } finally {
      setIsExporting(false);
    }
  };

  /**
   * Delete user data
   */
  const handleDataDeletion = async (keepAccount = false) => {
    if (confirmationText !== 'DELETE_ALL_DATA') {
      alert('Bitte geben Sie "DELETE_ALL_DATA" zur Bestätigung ein');
      return;
    }

    setIsDeletingData(true);

    try {
      const response = await fetch('/api/gdpr/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          confirmation: 'DELETE_ALL_DATA',
          reason: 'User-initiated deletion via Privacy Settings',
          keepAccount
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Löschung fehlgeschlagen');
      }

      alert(`Löschung erfolgreich: ${result.message}`);
      
      if (!keepAccount) {
        // Redirect to logout if account was deleted
        window.location.href = '/api/auth/signout';
      } else {
        // Reload page if account was kept
        window.location.reload();
      }

    } catch (error) {
      console.error('Deletion error:', error);
      alert(error instanceof Error ? error.message : 'Löschung fehlgeschlagen');
    } finally {
      setIsDeletingData(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Datenschutz-Einstellungen
          </h1>
          <p className="text-gray-600">
            Bitte melden Sie sich an, um Ihre Datenschutz-Einstellungen zu verwalten.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔒 Datenschutz & Privatsphäre
        </h1>
        <p className="text-gray-600">
          Verwalten Sie Ihre personenbezogenen Daten gemäß DSGVO
        </p>
      </div>

      {/* Data Export (Art. 15 DSGVO) */}
      <LdsCard>
        <LdsCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <LdsCardTitle>📥 Datenexport (Art. 15 DSGVO)</LdsCardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Laden Sie alle Ihre gespeicherten Daten herunter
              </p>
            </div>
            <LdsBadge variant="info">Recht auf Auskunft</LdsBadge>
          </div>
        </LdsCardHeader>
        
        <LdsCardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Was wird exportiert?</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Account-Informationen (E-Mail, Name, Rolle)</li>
                <li>• Alle Ihre Immobilienangebote mit Details</li>
                <li>• Energieausweis-Daten</li>
                <li>• Räume und Grundrisse</li>
                <li>• Interessenten-Kontakte (bei DSGVO-Einverständnis)</li>
                <li>• Portal-Veröffentlichungen (IS24, etc.)</li>
                <li>• Optional: Hochgeladene Medien</li>
              </ul>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <LdsButton
                onClick={() => handleDataExport('json', false)}
                disabled={isExporting}
                variant="primary"
              >
                {isExporting ? '📤 Exportiere...' : '📋 JSON Export'}
              </LdsButton>
              
              <LdsButton
                onClick={() => handleDataExport('csv', false)}
                disabled={isExporting}
                variant="outline"
              >
                📊 CSV Export
              </LdsButton>
              
              <LdsButton
                onClick={() => handleDataExport('json', true)}
                disabled={isExporting}
                variant="outline"
              >
                📋 Mit Medien (größer)
              </LdsButton>
            </div>
            
            <div className="text-xs text-gray-500">
              💡 Der Export enthält alle Daten in strukturierter Form. JSON ist detaillierter, CSV einfacher zu öffnen.
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>

      {/* Data Deletion (Art. 17 DSGVO) */}
      <LdsCard>
        <LdsCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <LdsCardTitle>🗑️ Datenlöschung (Art. 17 DSGVO)</LdsCardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Löschen Sie Ihre Daten dauerhaft
              </p>
            </div>
            <LdsBadge variant="destructive">Recht auf Vergessenwerden</LdsBadge>
          </div>
        </LdsCardHeader>
        
        <LdsCardContent>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="text-red-600">⚠️</div>
                <div>
                  <h4 className="font-semibold text-red-900">Wichtiger Hinweis</h4>
                  <p className="text-red-800 text-sm mt-1">
                    Die Datenlöschung ist <strong>unwiderruflich</strong> und kann nicht rückgängig gemacht werden. 
                    Bitte exportieren Sie Ihre Daten vor der Löschung.
                  </p>
                </div>
              </div>
            </div>
            
            <LdsButton
              onClick={() => setShowDeletionConfirm(true)}
              variant="destructive"
            >
              🗑️ Datenlöschung konfigurieren
            </LdsButton>
          </div>
        </LdsCardContent>
      </LdsCard>

      {/* Cookie Settings */}
      <LdsCard>
        <LdsCardHeader>
          <div className="flex items-center justify-between">
            <div>
              <LdsCardTitle>🍪 Cookie-Einstellungen</LdsCardTitle>
              <p className="text-sm text-gray-600 mt-2">
                Verwalten Sie Ihre Cookie-Präferenzen
              </p>
            </div>
            <LdsBadge variant="secondary">TTDSG § 25</LdsBadge>
          </div>
        </LdsCardHeader>
        
        <LdsCardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Bestimmen Sie, welche Cookies gesetzt werden dürfen. Notwendige Cookies 
              für die Grundfunktionalität sind immer aktiv.
            </p>
            
            <LdsButton
              onClick={() => setShowConsentManager(true)}
              variant="outline"
            >
              ⚙️ Cookie-Einstellungen öffnen
            </LdsButton>
          </div>
        </LdsCardContent>
      </LdsCard>

      {/* Legal Information */}
      <LdsCard>
        <LdsCardHeader>
          <LdsCardTitle>📋 Rechtliche Informationen</LdsCardTitle>
        </LdsCardHeader>
        
        <LdsCardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900">Ihre Rechte nach DSGVO:</h4>
              <ul className="mt-2 space-y-1 text-gray-700">
                <li>• <strong>Art. 15:</strong> Recht auf Auskunft (Datenexport)</li>
                <li>• <strong>Art. 16:</strong> Recht auf Berichtigung (Profil bearbeiten)</li>
                <li>• <strong>Art. 17:</strong> Recht auf Löschung (Datenlöschung)</li>
                <li>• <strong>Art. 18:</strong> Recht auf Einschränkung der Verarbeitung</li>
                <li>• <strong>Art. 20:</strong> Recht auf Datenübertragbarkeit</li>
                <li>• <strong>Art. 21:</strong> Widerspruchsrecht</li>
                <li>• <strong>Art. 77:</strong> Beschwerderecht bei Aufsichtsbehörde</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900">Kontakt:</h4>
              <p className="text-gray-700 mt-1">
                Datenschutzbeauftragte: <a href="mailto:privacy@liveyourdreams.online" className="text-blue-600 hover:underline">
                  privacy@liveyourdreams.online
                </a>
              </p>
              <p className="text-gray-700">
                Aufsichtsbehörde: Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
              </p>
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>

      {/* Cookie Consent Manager */}
      {showConsentManager && (
        <ConsentManager
          mode="settings"
          forceShow={true}
          onConsentChange={() => setShowConsentManager(false)}
        />
      )}

      {/* Deletion Confirmation Modal */}
      {showDeletionConfirm && deletionInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-red-900">
                🗑️ Datenlöschung bestätigen
              </h2>
              <button
                onClick={() => setShowDeletionConfirm(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Account Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Ihr Account:</h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>E-Mail:</strong> {deletionInfo.accountInfo.email}</p>
                  <p><strong>Name:</strong> {deletionInfo.accountInfo.name || 'Nicht angegeben'}</p>
                  <p><strong>Erstellt:</strong> {new Date(deletionInfo.accountInfo.createdAt).toLocaleDateString('de-DE')}</p>
                  <p><strong>Rolle:</strong> {deletionInfo.accountInfo.role}</p>
                </div>
              </div>

              {/* Data to be deleted */}
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-3">Folgende Daten werden gelöscht:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-medium">🏠 Immobilien: {deletionInfo.dataToDelete.properties}</div>
                    <div className="font-medium">📸 Medien: {deletionInfo.dataToDelete.media}</div>
                    <div className="font-medium">🏠 Räume: {deletionInfo.dataToDelete.rooms}</div>
                  </div>
                  <div>
                    <div className="font-medium">👥 Interessenten: {deletionInfo.dataToDelete.leads}</div>
                    <div className="font-medium">🌐 Portal-Listings: {deletionInfo.dataToDelete.listings}</div>
                  </div>
                </div>
              </div>

              {/* Confirmation Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zur Bestätigung geben Sie ein: <code className="bg-gray-100 px-2 py-1 rounded">DELETE_ALL_DATA</code>
                </label>
                <input
                  type="text"
                  value={confirmationText}
                  onChange={(e) => setConfirmationText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="DELETE_ALL_DATA"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                <LdsButton
                  variant="outline"
                  onClick={() => setShowDeletionConfirm(false)}
                  className="flex-1"
                >
                  ❌ Abbrechen
                </LdsButton>
                
                <LdsButton
                  variant="destructive"
                  onClick={() => handleDataDeletion(true)}
                  disabled={confirmationText !== 'DELETE_ALL_DATA' || isDeletingData}
                  className="flex-1"
                >
                  {isDeletingData ? '🗑️ Lösche...' : '🗑️ Daten löschen (Account behalten)'}
                </LdsButton>
                
                <LdsButton
                  variant="destructive"
                  onClick={() => handleDataDeletion(false)}
                  disabled={confirmationText !== 'DELETE_ALL_DATA' || isDeletingData}
                  className="flex-1"
                >
                  {isDeletingData ? '🗑️ Lösche...' : '🗑️ Alles löschen (Account auch)'}
                </LdsButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

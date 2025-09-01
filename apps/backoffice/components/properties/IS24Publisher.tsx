'use client';

import React, { useState, useEffect } from 'react';
import {
  LdsCard,
  LdsCardHeader,
  LdsCardTitle,
  LdsCardContent,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

interface IS24PublisherProps {
  propertyId: string;
  propertyTitle: string;
  isPublished?: boolean;
  hasRequiredFields?: boolean;
  existingListing?: {
    id: string;
    externalId?: string;
    status: 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'ERROR' | 'EXPIRED';
    publishedAt?: Date;
    syncError?: string;
    lastSyncAt?: Date;
  };
}

type PublishStatus = 'idle' | 'connecting' | 'publishing' | 'unpublishing' | 'success' | 'error';

/**
 * IS24Publisher Component
 * 
 * ImmobilienScout24 Integration für:
 * - OAuth Connection
 * - Property Publishing
 * - Status Monitoring
 * - Sync Management
 */
export function IS24Publisher({
  propertyId,
  propertyTitle,
  isPublished = false,
  hasRequiredFields = true,
  existingListing
}: IS24PublisherProps) {
  const [status, setStatus] = useState<PublishStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);

  // Check IS24 connection status on mount
  useEffect(() => {
    checkConnectionStatus();
  }, []);

  /**
   * Check if IS24 is connected
   */
  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/integrations/is24/status');
      if (response.ok) {
        const data = await response.json();
        setIsConnected(data.connected);
      }
    } catch (err) {
      console.error('Failed to check IS24 connection:', err);
      setIsConnected(false);
    }
  };

  /**
   * Initiate IS24 OAuth Connection
   */
  const handleConnect = async () => {
    setStatus('connecting');
    setError(null);

    try {
      const response = await fetch('/api/integrations/is24/auth');
      
      if (!response.ok) {
        throw new Error('Failed to initiate IS24 connection');
      }

      const data = await response.json();
      
      // Open OAuth window
      window.open(data.authUrl, 'is24-auth', 'width=600,height=700,scrollbars=yes');
      
      // Listen for connection completion
      const checkConnection = setInterval(async () => {
        await checkConnectionStatus();
        if (isConnected) {
          clearInterval(checkConnection);
          setStatus('success');
          setTimeout(() => setStatus('idle'), 3000);
        }
      }, 2000);

      // Timeout after 5 minutes
      setTimeout(() => {
        clearInterval(checkConnection);
        if (status === 'connecting') {
          setStatus('error');
          setError('Connection timeout. Please try again.');
        }
      }, 300000);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Connection failed');
    }
  };

  /**
   * Disconnect IS24
   */
  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/integrations/is24/auth', {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect IS24');
      }

      setIsConnected(false);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    }
  };

  /**
   * Publish Property to IS24
   */
  const handlePublish = async (forceUpdate = false) => {
    setStatus('publishing');
    setError(null);

    try {
      const response = await fetch('/api/integrations/is24/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          propertyId,
          forceUpdate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Publishing failed');
      }

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        // Refresh page to update listing data
        window.location.reload();
      }, 2000);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Publishing failed');
    }
  };

  /**
   * Unpublish Property from IS24
   */
  const handleUnpublish = async () => {
    if (!confirm('Möchten Sie diese Immobilie wirklich von ImmobilienScout24 entfernen?')) {
      return;
    }

    setStatus('unpublishing');
    setError(null);

    try {
      const response = await fetch(`/api/integrations/is24/publish?propertyId=${propertyId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Unpublishing failed');
      }

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        window.location.reload();
      }, 2000);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unpublishing failed');
    }
  };

  /**
   * Get Status Badge
   */
  const getStatusBadge = () => {
    if (existingListing) {
      switch (existingListing.status) {
        case 'PUBLISHED':
          return <LdsBadge variant="success">✅ Veröffentlicht</LdsBadge>;
        case 'PENDING':
          return <LdsBadge variant="warning">⏳ Wartend</LdsBadge>;
        case 'ERROR':
          return <LdsBadge variant="destructive">❌ Fehler</LdsBadge>;
        default:
          return <LdsBadge variant="default">📝 Entwurf</LdsBadge>;
      }
    }
    return null;
  };

  /**
   * Get Action Button
   */
  const getActionButton = () => {
    if (!isConnected) {
      return (
        <LdsButton
          onClick={handleConnect}
          disabled={status === 'connecting'}
          variant="primary"
        >
          {status === 'connecting' ? '🔗 Verbinde...' : '🔗 IS24 verbinden'}
        </LdsButton>
      );
    }

    if (!hasRequiredFields) {
      return (
        <LdsButton disabled variant="outline">
          ❓ Unvollständige Daten
        </LdsButton>
      );
    }

    if (existingListing?.status === 'PUBLISHED') {
      return (
        <div className="flex space-x-3">
          <LdsButton
            onClick={() => handlePublish(true)}
            disabled={status === 'publishing'}
            variant="outline"
          >
            {status === 'publishing' ? '📤 Aktualisiere...' : '🔄 Aktualisieren'}
          </LdsButton>
          <LdsButton
            onClick={handleUnpublish}
            disabled={status === 'unpublishing'}
            variant="destructive"
          >
            {status === 'unpublishing' ? '📤 Entferne...' : '🗑️ Entfernen'}
          </LdsButton>
        </div>
      );
    }

    return (
      <LdsButton
        onClick={() => handlePublish()}
        disabled={status === 'publishing'}
        variant="primary"
      >
        {status === 'publishing' ? '📤 Veröffentliche...' : '📤 Auf IS24 veröffentlichen'}
      </LdsButton>
    );
  };

  return (
    <LdsCard>
      <LdsCardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🏠</div>
            <div>
              <LdsCardTitle>ImmobilienScout24</LdsCardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Deutschlands führendes Immobilienportal
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {getStatusBadge()}
            <LdsBadge variant={isConnected ? 'success' : 'default'}>
              {isConnected ? '✅ Verbunden' : '❌ Nicht verbunden'}
            </LdsBadge>
          </div>
        </div>
      </LdsCardHeader>

      <LdsCardContent>
        <div className="space-y-6">
          {/* Connection Info */}
          {!isConnected && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-blue-600">ℹ️</div>
                <div>
                  <h4 className="font-medium text-blue-900">Verbindung erforderlich</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Verbinden Sie Ihr ImmobilienScout24-Konto, um Immobilien automatisch zu veröffentlichen.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Requirements Check */}
          {!hasRequiredFields && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-amber-600">⚠️</div>
                <div>
                  <h4 className="font-medium text-amber-900">Unvollständige Daten</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Für die Veröffentlichung sind alle Energieausweis-Daten und Grundangaben erforderlich.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Listing Information */}
          {existingListing && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">📊 Listing-Status</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Status</div>
                  <div className="font-medium">{existingListing.status}</div>
                </div>
                
                {existingListing.externalId && (
                  <div>
                    <div className="text-gray-600">IS24 ID</div>
                    <div className="font-medium font-mono text-xs">{existingListing.externalId}</div>
                  </div>
                )}
                
                {existingListing.publishedAt && (
                  <div>
                    <div className="text-gray-600">Veröffentlicht</div>
                    <div className="font-medium">
                      {existingListing.publishedAt.toLocaleDateString('de-DE')}
                    </div>
                  </div>
                )}
                
                {existingListing.lastSyncAt && (
                  <div>
                    <div className="text-gray-600">Letzte Sync</div>
                    <div className="font-medium">
                      {existingListing.lastSyncAt.toLocaleDateString('de-DE')}
                    </div>
                  </div>
                )}
              </div>
              
              {existingListing.syncError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                  <div className="text-red-800 text-sm">
                    <strong>Fehler:</strong> {existingListing.syncError}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-red-600">❌</div>
                <div>
                  <h4 className="font-medium text-red-900">Fehler</h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="text-green-600">✅</div>
                <div>
                  <h4 className="font-medium text-green-900">Erfolgreich!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Aktion wurde erfolgreich ausgeführt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              {isConnected ? '🟢 Bereit für Veröffentlichung' : '🔴 Verbindung erforderlich'}
            </div>
            
            <div className="flex space-x-3">
              {isConnected && (
                <LdsButton
                  onClick={handleDisconnect}
                  variant="outline"
                  size="sm"
                >
                  🔌 Trennen
                </LdsButton>
              )}
              
              {getActionButton()}
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-gray-500 pt-4 border-t">
            💡 <strong>Tipp:</strong> Aktualisieren Sie Ihre IS24-Listings regelmäßig, 
            um die beste Sichtbarkeit zu gewährleisten.
          </div>
        </div>
      </LdsCardContent>
    </LdsCard>
  );
}

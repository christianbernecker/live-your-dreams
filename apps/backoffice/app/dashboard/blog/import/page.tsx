/**
 * LYD Blog System v1.1 - MICRO Step 7
 * 
 * Simple Import UI - nur native HTML File Input
 * KEINE react-dropzone, KEINE komplexen Dependencies
 */

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// ============================================================================
// MICRO COMPONENT
// ============================================================================

export default function BlogImportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [importData, setImportData] = useState<any>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // FILE HANDLING
  // ============================================================================

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Size check
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setError(`Datei zu groß: ${Math.round(file.size / 1024 / 1024)} MB (max: 2MB)`);
        return;
      }

      // Type check
      if (!file.name.endsWith('.json')) {
        setError('Nur JSON-Dateien (.json) sind erlaubt');
        return;
      }

      setError(null);
      const text = await file.text();
      const data = JSON.parse(text);
      
      setImportData(data);
      setResult(`JSON geladen: ${data.content?.title || 'Unbenannt'}`);
      
    } catch (error) {
      setError('Ungültige JSON-Datei: ' + (error instanceof Error ? error.message : 'Parse error'));
      setImportData(null);
    }
  };

  // ============================================================================
  // IMPORT EXECUTION
  // ============================================================================

  const executeImport = async () => {
    if (!importData) return;

    try {
      setImporting(true);
      setError(null);

      const response = await fetch('/api/blog/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setResult(`✅ Artikel "${result.blogPost.title}" erfolgreich als ${result.blogPost.status} erstellt`);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/dashboard/blog');
      }, 2000);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Import fehlgeschlagen');
    } finally {
      setImporting(false);
    }
  };

  // ============================================================================
  // AUTHENTICATION CHECK
  // ============================================================================

  if (!session) {
    return (
      <div className="lyd-card">
        <div className="lyd-card-body">
          <p>Authentifizierung erforderlich</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      
      {/* Header */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h1 className="lyd-heading-1">Blog Import</h1>
          <p className="lyd-text-secondary">JSON v1.1 Import von KI-Agenten (MICRO Implementation)</p>
        </div>
        <div className="lyd-card-body">
          <button
            className="lyd-button secondary"
            onClick={() => router.push('/dashboard/blog')}
          >
            ← Zurück zur Übersicht
          </button>
        </div>
      </div>

      {/* File Upload */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">1. JSON-Datei auswählen</h2>
        </div>
        <div className="lyd-card-body">
          <div style={{
            border: '2px dashed var(--lyd-border)',
            borderRadius: 'var(--border-radius-lg)',
            padding: 'var(--spacing-xl)',
            textAlign: 'center',
            background: 'var(--lyd-bg-secondary)'
          }}>
            <div style={{ marginBottom: 'var(--spacing-md)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--lyd-gray-400)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{
                display: 'block',
                margin: '0 auto var(--spacing-md)',
                padding: 'var(--spacing-sm)',
                border: '1px solid var(--lyd-border)',
                borderRadius: 'var(--border-radius-md)',
                background: 'var(--lyd-bg)'
              }}
            />
            <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
              Unterstützt: .json • Maximum: 2MB
            </div>
          </div>
        </div>
      </div>

      {/* Import Preview */}
      {importData && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">2. Import Vorschau</h2>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Content</h3>
                <div style={{ fontSize: '0.875rem' }}>
                  <div><strong>Titel:</strong> {importData.content?.title || 'N/A'}</div>
                  <div><strong>Slug:</strong> /{importData.content?.slug || 'N/A'}</div>
                  <div><strong>Kategorie:</strong> {importData.content?.category || 'N/A'}</div>
                  <div><strong>Format:</strong> {importData.content?.format || 'mdx'}</div>
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Plattformen</h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {(importData.content?.platforms || []).map((platform: string) => (
                    <span key={platform} className="lyd-badge secondary">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {importData.content?.excerpt && (
              <div style={{ marginTop: 'var(--spacing-md)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Zusammenfassung</h3>
                <div style={{ 
                  padding: 'var(--spacing-md)',
                  background: 'var(--lyd-bg-secondary)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '0.875rem'
                }}>
                  {importData.content.excerpt}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Import Action */}
      {importData && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">3. Import durchführen</h2>
          </div>
          <div className="lyd-card-body">
            <button
              className="lyd-button primary"
              onClick={executeImport}
              disabled={importing}
              style={{ marginRight: 'var(--spacing-md)' }}
            >
              {importing ? 'Importiere...' : 'Als Draft importieren'}
            </button>
            
            {importing && (
              <span style={{ color: 'var(--lyd-info)' }}>
                Import wird durchgeführt...
              </span>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="lyd-card">
          <div className="lyd-card-body">
            <div style={{
              padding: 'var(--spacing-md)',
              background: error ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${error ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: 'var(--border-radius-md)',
              color: error ? '#dc2626' : '#16a34a'
            }}>
              {result}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="lyd-card">
          <div className="lyd-card-body">
            <div style={{
              padding: 'var(--spacing-md)',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 'var(--border-radius-md)',
              color: '#dc2626'
            }}>
              <strong>Fehler:</strong> {error}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

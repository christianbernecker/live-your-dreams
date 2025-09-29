/**
 * LYD Blog System v1.1 - Import Interface
 * JSON/ZIP Import mit Preview & Security-Check
 * Basierend auf technischem Briefing v1.0 - Sektion 5.3
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { SERPPreview } from '@/components/blog/SERPPreview';
import { OpenGraphPreview } from '@/components/blog/OpenGraphPreview';
import { CopyPromptPanel } from '@/components/blog/CopyPromptPanel';
import { SecurityCheckResults } from '@/components/blog/SecurityCheckResults';
import { useToast } from '@/components/ui/Toast';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ImportData {
  version: string;
  source: {
    agent: string;
    model: string;
    timestamp: string;
  };
  content: {
    platforms: string[];
    category: string;
    subcategory?: string;
    tags: string[];
    title: string;
    slug: string;
    excerpt: string;
    seo: {
      metaTitle?: string;
      metaDescription?: string;
      focusKeyword?: string;
      keywords: string[];
      canonicalUrl?: string;
      og?: {
        title?: string;
        description?: string;
        image?: string;
        type?: string;
      };
    };
    format: string;
    body?: string;
    htmlBlocks?: any[];
    featuredImage?: {
      src: string;
      alt: string;
    };
    images?: any[];
    jsonLd?: any;
  };
  assets?: any[];
}

interface ValidationResult {
  valid: boolean;
  errors?: any[];
  warnings?: string[];
  securityIssues?: string[];
  recommendations?: string[];
  summary?: {
    readyForImport: boolean;
    confidence: 'low' | 'medium' | 'high';
  };
  content?: any;
  sanitization?: any;
  assets?: any;
  seo?: any;
  platforms?: any;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function BlogImportPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showSuccess, showError, showWarning } = useToast();

  // State Management
  const [importData, setImportData] = useState<ImportData | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ============================================================================
  // FILE HANDLING
  // ============================================================================

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        showError('Datei zu groß', `Maximale Größe: 2MB. Aktuelle Größe: ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB`);
        return;
      }

      const text = await file.text();
      const data = JSON.parse(text);
      
      setImportData(data);
      setValidationResult(null);
      
      showSuccess('Datei geladen', 'JSON-Datei wurde erfolgreich geladen und kann jetzt validiert werden.');
      
    } catch (error) {
      console.error('File upload error:', error);
      showError('Ungültige Datei', 'Die Datei konnte nicht als JSON geparst werden. Bitte prüfen Sie das Format.');
      setImportData(null);
    }
  }, [showSuccess, showError]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (!file) return;

    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      showError('Ungültiger Dateityp', 'Nur JSON-Dateien (.json) sind erlaubt.');
      return;
    }

    handleFileUpload(file);
  }, [handleFileUpload, showError]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  // ============================================================================
  // VALIDATION
  // ============================================================================

  const validateImportData = useCallback(async () => {
    if (!importData) return;

    try {
      setIsValidating(true);
      
      const response = await fetch('/api/blog/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Validation failed');
      }

      setValidationResult(result);
      
      if (result.summary?.readyForImport) {
        showSuccess('Validation erfolgreich', 'Der Import ist bereit für die Verarbeitung.');
      } else if (result.securityIssues?.length > 0) {
        showWarning('Sicherheitsprobleme gefunden', `${result.securityIssues.length} Sicherheitsproblem(e) müssen behoben werden.`);
      } else if (result.warnings?.length > 0) {
        showWarning('Warnungen gefunden', `${result.warnings.length} Warnung(en) gefunden. Import möglich.`);
      }

    } catch (error) {
      console.error('Validation error:', error);
      showError('Validation fehlgeschlagen', error instanceof Error ? error.message : 'Unbekannter Fehler');
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  }, [importData, showSuccess, showError, showWarning]);

  // Auto-validate when import data changes
  useEffect(() => {
    if (importData) {
      validateImportData();
    }
  }, [importData, validateImportData]);

  // ============================================================================
  // IMPORT EXECUTION
  // ============================================================================

  const executeImport = useCallback(async () => {
    if (!importData || !validationResult?.summary?.readyForImport) return;

    try {
      setIsImporting(true);
      setUploadProgress(0);

      const response = await fetch('/api/blog/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Import failed');
      }

      setUploadProgress(100);
      showSuccess('Import erfolgreich', `Blog-Artikel "${result.blogPost.title}" wurde als Draft erstellt.`);
      
      // Redirect to edit page
      setTimeout(() => {
        router.push(result.nextSteps.editUrl);
      }, 2000);

    } catch (error) {
      console.error('Import error:', error);
      showError('Import fehlgeschlagen', error instanceof Error ? error.message : 'Unbekannter Fehler');
      setUploadProgress(0);
    } finally {
      setIsImporting(false);
    }
  }, [importData, validationResult, showSuccess, showError, router]);

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderPlatformBadges = (platforms: string[]) => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      {platforms.map(platform => {
        const colors = {
          'WOHNEN': { bg: '#10b98120', color: '#10b981', border: '#10b98140' },
          'MAKLER': { bg: '#3b82f620', color: '#3b82f6', border: '#3b82f640' },
          'ENERGIE': { bg: '#f59e0b20', color: '#f59e0b', border: '#f59e0b40' }
        };
        const colorSet = colors[platform as keyof typeof colors];
        
        return (
          <span
            key={platform}
            className="lyd-badge secondary"
            style={{
              backgroundColor: colorSet?.bg,
              color: colorSet?.color,
              border: `1px solid ${colorSet?.border}`
            }}
          >
            {platform}
          </span>
        );
      })}
    </div>
  );

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
      
      {/* ============================================================================
          PAGE HEADER
          ============================================================================ */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h1 className="lyd-heading-1">Blog Import</h1>
          <p className="lyd-text-secondary">Importieren Sie JSON v1.1 Inhalte von KI-Agenten</p>
        </div>
        <div className="lyd-card-body">
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
            <button
              className="lyd-button secondary"
              onClick={() => router.push('/dashboard/blog')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m0 7h18" />
              </svg>
              Zurück zur Übersicht
            </button>
            
            <div style={{ marginLeft: 'auto' }}>
              <span className="lyd-badge info">JSON v1.1 Format</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================================
          COPY PROMPT PANEL
          ============================================================================ */}
      <CopyPromptPanel />

      {/* ============================================================================
          FILE UPLOAD / DROPZONE
          ============================================================================ */}
      <div className="lyd-card">
        <div className="lyd-card-header">
          <h2 className="lyd-heading-2">1. JSON-Datei hochladen</h2>
          <p className="lyd-text-secondary">Laden Sie Ihre JSON v1.1 Datei vom KI-Agenten hoch</p>
        </div>
        <div className="lyd-card-body">
          <div
            className={`lyd-dropzone ${dragActive ? 'dragover' : ''} ${importData ? 'success' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <div className="lyd-dropzone-icon">
              {importData ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            
            {importData ? (
              <div>
                <div style={{ fontWeight: '600', marginBottom: '8px', color: 'var(--lyd-success)' }}>
                  ✅ Datei erfolgreich geladen
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  {importData.content.title} • {importData.source.agent} {importData.source.model}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-500)', marginTop: '8px' }}>
                  Klicken Sie hier, um eine andere Datei auszuwählen
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: '600', marginBottom: '8px' }}>
                  JSON-Datei hier ablegen oder klicken
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--lyd-gray-600)' }}>
                  Unterstützte Formate: .json • Maximum: 2MB
                </div>
              </div>
            )}
            
            <input
              id="file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================================
          CONTENT PREVIEW
          ============================================================================ */}
      {importData && (
        <div className="lyd-card">
          <div className="lyd-card-header">
            <h2 className="lyd-heading-2">2. Content Preview</h2>
            <p className="lyd-text-secondary">Überprüfen Sie die importierten Inhalte</p>
          </div>
          <div className="lyd-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
              
              {/* Content Info */}
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Artikel-Information</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <div>
                    <strong>Titel:</strong>
                    <div style={{ marginTop: '4px' }}>{importData.content.title}</div>
                  </div>
                  <div>
                    <strong>Slug:</strong>
                    <div style={{ marginTop: '4px', fontFamily: 'monospace' }}>/{importData.content.slug}</div>
                  </div>
                  <div>
                    <strong>Plattformen:</strong>
                    <div style={{ marginTop: '4px' }}>{renderPlatformBadges(importData.content.platforms)}</div>
                  </div>
                  <div>
                    <strong>Kategorie:</strong>
                    <div style={{ marginTop: '4px' }}>{importData.content.category}</div>
                  </div>
                  <div>
                    <strong>Format:</strong>
                    <div style={{ marginTop: '4px' }}>
                      <span className="lyd-badge secondary">{importData.content.format.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Source Info */}
              <div>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>KI-Quelle</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                  <div>
                    <strong>Agent:</strong>
                    <div style={{ marginTop: '4px' }}>{importData.source.agent}</div>
                  </div>
                  <div>
                    <strong>Modell:</strong>
                    <div style={{ marginTop: '4px' }}>{importData.source.model}</div>
                  </div>
                  <div>
                    <strong>Erstellt:</strong>
                    <div style={{ marginTop: '4px' }}>
                      {new Date(importData.source.timestamp).toLocaleString('de-DE')}
                    </div>
                  </div>
                  <div>
                    <strong>Assets:</strong>
                    <div style={{ marginTop: '4px' }}>
                      {importData.assets?.length || 0} Dateien
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div style={{ marginTop: 'var(--spacing-lg)' }}>
              <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Zusammenfassung</h3>
              <div style={{ 
                padding: 'var(--spacing-md)', 
                background: 'var(--lyd-bg-secondary)', 
                borderRadius: 'var(--border-radius-md)',
                border: '1px solid var(--lyd-border)'
              }}>
                {importData.content.excerpt}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================================
          VALIDATION RESULTS
          ============================================================================ */}
      {isValidating && (
        <div className="lyd-card">
          <div className="lyd-card-body">
            <LoadingSpinner 
              size="lg" 
              label="Validiere Import-Daten..." 
              variant="gradient"
            />
          </div>
        </div>
      )}

      {validationResult && !isValidating && (
        <>
          {/* Security Check */}
          <SecurityCheckResults validationResult={validationResult} />

          {/* SEO Preview */}
          {validationResult.seo && (
            <div className="lyd-card">
              <div className="lyd-card-header">
                <h2 className="lyd-heading-2">3. SEO Preview</h2>
                <p className="lyd-text-secondary">So wird Ihr Artikel in Suchmaschinen dargestellt</p>
              </div>
              <div className="lyd-card-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                  <SERPPreview
                    title={importData!.content.seo.metaTitle || importData!.content.title}
                    url={`liveyourdreams.online/blog/${importData!.content.slug}`}
                    description={importData!.content.seo.metaDescription || importData!.content.excerpt}
                  />
                  
                  <OpenGraphPreview
                    title={importData!.content.seo.og?.title || importData!.content.title}
                    description={importData!.content.seo.og?.description || importData!.content.excerpt}
                    image={importData!.content.featuredImage?.src}
                    url={`liveyourdreams.online/blog/${importData!.content.slug}`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Import Action */}
          <div className="lyd-card">
            <div className="lyd-card-header">
              <h2 className="lyd-heading-2">4. Import durchführen</h2>
              <p className="lyd-text-secondary">
                {validationResult.summary?.readyForImport 
                  ? 'Ihr Import ist bereit für die Verarbeitung'
                  : 'Bitte beheben Sie die Probleme vor dem Import'
                }
              </p>
            </div>
            <div className="lyd-card-body">
              {isImporting ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                  <LoadingSpinner size="lg" label="Import wird durchgeführt..." variant="gradient" />
                  <div style={{ marginTop: 'var(--spacing-md)' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '8px', 
                      background: 'var(--lyd-gray-200)', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${uploadProgress}%`, 
                        height: '100%', 
                        background: 'var(--lyd-primary)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '0.875rem' }}>
                      {uploadProgress}% abgeschlossen
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                  <button
                    className={`lyd-button primary ${!validationResult.summary?.readyForImport ? 'disabled' : ''}`}
                    onClick={executeImport}
                    disabled={!validationResult.summary?.readyForImport || isImporting}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m3 3V10" />
                    </svg>
                    Validieren & als Draft anlegen
                  </button>

                  {validationResult.summary?.confidence && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.875rem' }}>Konfidenz:</span>
                      <span 
                        className={`lyd-badge ${
                          validationResult.summary.confidence === 'high' ? 'success' : 
                          validationResult.summary.confidence === 'medium' ? 'warning' : 'error'
                        }`}
                      >
                        {validationResult.summary.confidence === 'high' ? 'Hoch' :
                         validationResult.summary.confidence === 'medium' ? 'Mittel' : 'Niedrig'}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

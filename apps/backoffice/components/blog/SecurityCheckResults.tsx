/**
 * LYD Blog System v1.1 - Security Check Results Component
 * 
 * Zeigt Validierungs- und Sicherheitsergebnisse für Import-Daten
 * Basierend auf technischem Briefing v1.0 - Security-First Approach
 */

'use client';

interface SecurityCheckResultsProps {
  validationResult: {
    valid: boolean;
    errors?: any[];
    warnings?: string[];
    securityIssues?: string[];
    recommendations?: string[];
    summary?: {
      totalWarnings: number;
      totalSecurityIssues: number;
      totalRecommendations: number;
      readyForImport: boolean;
      confidence: 'low' | 'medium' | 'high';
    };
    sanitization?: {
      content?: any;
      htmlBlocks?: any[];
    };
    assets?: {
      totalAssets: number;
      totalSizeMB: number;
      maxAllowedSizeMB: number;
      withinSizeLimit: boolean;
      assets: any[];
    };
    seo?: any;
    platforms?: any[];
  };
}

export function SecurityCheckResults({ validationResult }: SecurityCheckResultsProps) {
  const {
    valid,
    errors = [],
    warnings = [],
    securityIssues = [],
    recommendations = [],
    summary,
    sanitization,
    assets,
    seo,
    platforms
  } = validationResult;

  // Status determination
  const getStatusConfig = () => {
    if (securityIssues.length > 0) {
      return {
        status: 'error',
        color: 'var(--lyd-error)',
        bgColor: '#fef2f2',
        borderColor: '#fecaca',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M15 9l-6 6"/>
            <path d="M9 9l6 6"/>
          </svg>
        ),
        title: 'Sicherheitsprobleme gefunden',
        message: 'Import nicht möglich - Sicherheitsprobleme müssen behoben werden'
      };
    } else if (warnings.length > 0) {
      return {
        status: 'warning',
        color: 'var(--lyd-warning)',
        bgColor: '#fffbeb',
        borderColor: '#fed7aa',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        ),
        title: 'Warnungen gefunden',
        message: 'Import möglich - Empfehlungen beachten'
      };
    } else {
      return {
        status: 'success',
        color: 'var(--lyd-success)',
        bgColor: '#f0fdf4',
        borderColor: '#bbf7d0',
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        ),
        title: 'Validation erfolgreich',
        message: 'Alle Checks bestanden - Import bereit'
      };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="lyd-card">
      <div className="lyd-card-header">
        <h2 className="lyd-heading-2">Sicherheits- & Validierungs-Check</h2>
        <p className="lyd-text-secondary">Automatische Überprüfung der Import-Daten</p>
      </div>
      <div className="lyd-card-body">
        
        {/* Status Summary */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-md)',
            background: statusConfig.bgColor,
            border: `1px solid ${statusConfig.borderColor}`,
            borderRadius: 'var(--border-radius-md)',
            marginBottom: 'var(--spacing-lg)'
          }}
        >
          <div style={{ color: statusConfig.color, flexShrink: 0 }}>
            {statusConfig.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '600', marginBottom: '4px', color: statusConfig.color }}>
              {statusConfig.title}
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              {statusConfig.message}
            </div>
          </div>
          {summary && (
            <div style={{ 
              display: 'flex', 
              gap: 'var(--spacing-sm)', 
              fontSize: '0.875rem',
              flexShrink: 0
            }}>
              <span className={`lyd-badge ${statusConfig.status}`}>
                Konfidenz: {summary.confidence === 'high' ? 'Hoch' : 
                           summary.confidence === 'medium' ? 'Mittel' : 'Niedrig'}
              </span>
            </div>
          )}
        </div>

        {/* Detailed Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
          
          {/* Issues & Warnings */}
          <div>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Probleme & Warnungen</h3>
            
            {/* Schema Errors */}
            {errors.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: 'var(--lyd-error)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Schema Fehler ({errors.length})
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  fontSize: '0.875rem',
                  color: 'var(--lyd-error)'
                }}>
                  {errors.slice(0, 5).map((error, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      <strong>{error.path}:</strong> {error.message}
                    </li>
                  ))}
                  {errors.length > 5 && (
                    <li style={{ color: 'var(--lyd-gray-500)', fontStyle: 'italic' }}>
                      ... und {errors.length - 5} weitere Fehler
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Security Issues */}
            {securityIssues.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: 'var(--lyd-error)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  🔒 Sicherheitsprobleme ({securityIssues.length})
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  fontSize: '0.875rem',
                  color: 'var(--lyd-error)'
                }}>
                  {securityIssues.map((issue, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: 'var(--lyd-warning)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  ⚠️ Warnungen ({warnings.length})
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  fontSize: '0.875rem',
                  color: 'var(--lyd-warning)'
                }}>
                  {warnings.map((warning, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600', 
                  color: 'var(--lyd-info)',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  💡 Empfehlungen ({recommendations.length})
                </h4>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '20px',
                  fontSize: '0.875rem',
                  color: 'var(--lyd-info)'
                }}>
                  {recommendations.map((rec, index) => (
                    <li key={index} style={{ marginBottom: '4px' }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* All Clear */}
            {errors.length === 0 && securityIssues.length === 0 && warnings.length === 0 && (
              <div style={{ 
                textAlign: 'center', 
                padding: 'var(--spacing-lg)',
                color: 'var(--lyd-success)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
                <div style={{ fontWeight: '600' }}>Keine Probleme gefunden</div>
                <div style={{ fontSize: '0.875rem', marginTop: '4px' }}>
                  Alle Validierungs-Checks erfolgreich bestanden
                </div>
              </div>
            )}
          </div>

          {/* Technical Details */}
          <div>
            <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Technische Details</h3>
            
            {/* Content Sanitization */}
            {sanitization && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  HTML Sanitization
                </h4>
                <div style={{ fontSize: '0.875rem' }}>
                  {sanitization.content && (
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: sanitization.content.success ? 'var(--lyd-success)' : 'var(--lyd-error)' }}>
                        {sanitization.content.success ? '✓' : '✗'}
                      </span>
                      {' '}Content: {sanitization.content.originalLength} → {sanitization.content.sanitizedLength} Zeichen
                      {sanitization.content.contentReduced && (
                        <span style={{ color: 'var(--lyd-warning)', marginLeft: '8px' }}>
                          (Inhalt reduziert)
                        </span>
                      )}
                    </div>
                  )}
                  
                  {sanitization.htmlBlocks && sanitization.htmlBlocks.length > 0 && (
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>HTML-Blocks:</div>
                      {sanitization.htmlBlocks.map((block: any, index: number) => (
                        <div key={index} style={{ marginLeft: '12px', marginBottom: '4px' }}>
                          <span style={{ color: block.success ? 'var(--lyd-success)' : 'var(--lyd-error)' }}>
                            {block.success ? '✓' : '✗'}
                          </span>
                          {' '}{block.id}: {block.originalHtmlLength} → {block.sanitizedHtmlLength} Zeichen
                          {block.hasCss && <span style={{ marginLeft: '8px', color: 'var(--lyd-info)' }}>+CSS</span>}
                          {block.hasJs && <span style={{ marginLeft: '8px', color: 'var(--lyd-warning)' }}>+JS</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Asset Information */}
            {assets && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Assets ({assets.totalAssets})
                </h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <div style={{ marginBottom: '4px' }}>
                    Größe: {assets.totalSizeMB}MB / {assets.maxAllowedSizeMB}MB
                    <span style={{ 
                      marginLeft: '8px',
                      color: assets.withinSizeLimit ? 'var(--lyd-success)' : 'var(--lyd-error)'
                    }}>
                      {assets.withinSizeLimit ? '✓' : '✗'}
                    </span>
                  </div>
                  {assets.assets.length > 0 && (
                    <details style={{ marginTop: '8px' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                        Asset Details ({assets.assets.length})
                      </summary>
                      <div style={{ marginTop: '8px', marginLeft: '12px' }}>
                        {assets.assets.map((asset: any, index: number) => (
                          <div key={index} style={{ 
                            marginBottom: '4px',
                            padding: '4px 8px',
                            background: 'var(--lyd-gray-50)',
                            borderRadius: '4px'
                          }}>
                            <div style={{ fontWeight: '600' }}>{asset.name}</div>
                            <div style={{ color: 'var(--lyd-gray-600)' }}>
                              {asset.mime} • {asset.estimatedSizeMB}MB
                            </div>
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              </div>
            )}

            {/* SEO Validation */}
            {seo && (
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  SEO Check
                </h4>
                <div style={{ fontSize: '0.875rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                    <span>Meta Title</span>
                    <span style={{ color: seo.hasMetaTitle ? 'var(--lyd-success)' : 'var(--lyd-warning)' }}>
                      {seo.hasMetaTitle ? '✓' : '⚠️'}
                    </span>
                    
                    <span>Meta Description</span>
                    <span style={{ color: seo.hasMetaDescription ? 'var(--lyd-success)' : 'var(--lyd-warning)' }}>
                      {seo.hasMetaDescription ? '✓' : '⚠️'}
                    </span>
                    
                    <span>Focus Keyword</span>
                    <span style={{ color: seo.hasFocusKeyword ? 'var(--lyd-success)' : 'var(--lyd-warning)' }}>
                      {seo.hasFocusKeyword ? '✓' : '⚠️'}
                    </span>
                    
                    <span>JSON-LD</span>
                    <span style={{ color: seo.hasJsonLd ? 'var(--lyd-success)' : 'var(--lyd-warning)' }}>
                      {seo.hasJsonLd ? '✓' : '⚠️'}
                    </span>
                    
                    <span>Titel-Länge</span>
                    <span style={{ color: seo.titleOptimal ? 'var(--lyd-success)' : 'var(--lyd-warning)' }}>
                      {seo.titleLength}/60 {seo.titleOptimal ? '✓' : '⚠️'}
                    </span>
                    
                    <span>Excerpt-Länge</span>
                    <span style={{ color: seo.excerptOptimal ? 'var(--lyd-success)' : 'var(--lyd-warning)' }}>
                      {seo.excerptLength}/160 {seo.excerptOptimal ? '✓' : '⚠️'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Validation */}
            {platforms && platforms.length > 0 && (
              <div>
                <h4 style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: '600',
                  marginBottom: 'var(--spacing-sm)'
                }}>
                  Platform-Validierung
                </h4>
                <div style={{ fontSize: '0.875rem' }}>
                  {platforms.map((platform: any, index: number) => (
                    <div key={index} style={{ marginBottom: '8px' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '4px'
                      }}>
                        <span style={{ fontWeight: '600' }}>{platform.platform}</span>
                        <span style={{ color: platform.categoryMatch ? 'var(--lyd-success)' : 'var(--lyd-warning)' }}>
                          {platform.categoryMatch ? '✓ Kategorie passend' : '⚠️ Kategorie prüfen'}
                        </span>
                      </div>
                      {platform.recommendations && platform.recommendations.length > 0 && (
                        <div style={{ 
                          marginLeft: '12px', 
                          fontSize: '0.8125rem',
                          color: 'var(--lyd-gray-600)'
                        }}>
                          {platform.recommendations.join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * LYD Blog System v1.1 - SERP Preview Component
 * 
 * Zeigt eine Google-Suchergebnis Vorschau für SEO-Optimierung
 * Basierend auf technischem Briefing v1.0 - Sektion 11.4
 */

'use client';

interface SERPPreviewProps {
  title: string;
  url: string;
  description: string;
  publishedDate?: string;
}

export function SERPPreview({ title, url, description, publishedDate }: SERPPreviewProps) {
  // Truncate title to Google's limit (≈ 60 characters)
  const truncatedTitle = title.length > 60 ? `${title.substring(0, 57)}...` : title;
  
  // Truncate description to Google's limit (≈ 160 characters) 
  const truncatedDescription = description.length > 160 ? `${description.substring(0, 157)}...` : description;
  
  // Clean URL display
  const displayUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  
  return (
    <div className="lyd-serp-preview">
      <div className="lyd-serp-title">
        {truncatedTitle}
      </div>
      <div className="lyd-serp-url">
        {displayUrl}
        {publishedDate && (
          <span style={{ marginLeft: '8px', color: '#70757a' }}>
            • {new Date(publishedDate).toLocaleDateString('de-DE')}
          </span>
        )}
      </div>
      <div className="lyd-serp-description">
        {truncatedDescription}
      </div>
      
      {/* SEO Indicators */}
      <div style={{ 
        marginTop: '12px', 
        display: 'flex', 
        gap: '8px', 
        fontSize: '0.75rem',
        color: '#70757a'
      }}>
        {title.length > 60 && (
          <span style={{ color: '#ea4335' }}>⚠️ Titel zu lang</span>
        )}
        {description.length > 160 && (
          <span style={{ color: '#ea4335' }}>⚠️ Beschreibung zu lang</span>
        )}
        {title.length >= 30 && title.length <= 60 && (
          <span style={{ color: '#34a853' }}>✓ Titel optimal</span>
        )}
        {description.length >= 120 && description.length <= 160 && (
          <span style={{ color: '#34a853' }}>✓ Beschreibung optimal</span>
        )}
      </div>
    </div>
  );
}

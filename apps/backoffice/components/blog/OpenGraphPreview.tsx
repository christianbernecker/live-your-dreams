/**
 * LYD Blog System v1.1 - Open Graph Preview Component
 * 
 * Zeigt eine Social Media Card Vorschau (Facebook, LinkedIn, etc.)
 * Basierend auf technischem Briefing v1.0 - SEO-First Approach
 */

'use client';

interface OpenGraphPreviewProps {
  title: string;
  description: string;
  image?: string;
  url: string;
  siteName?: string;
  type?: string;
}

export function OpenGraphPreview({ 
  title, 
  description, 
  image, 
  url, 
  siteName = 'Live Your Dreams',
  type = 'article'
}: OpenGraphPreviewProps) {
  
  // Truncate for optimal social sharing
  const truncatedTitle = title.length > 95 ? `${title.substring(0, 92)}...` : title;
  const truncatedDescription = description.length > 200 ? `${description.substring(0, 197)}...` : description;
  const displayUrl = url.replace(/^https?:\/\//, '').toLowerCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Open Graph Card */}
      <div className="lyd-og-preview">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="lyd-og-image"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling?.setAttribute('style', 'display: flex');
            }}
          />
        ) : (
          <div 
            className="lyd-og-image" 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, var(--lyd-primary, #3b82f6), var(--lyd-royal-blue, #1d4ed8))',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}
          >
            {siteName}
          </div>
        )}
        
        {/* Fallback placeholder (hidden by default) */}
        <div 
          className="lyd-og-image" 
          style={{
            display: image ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, var(--lyd-primary, #3b82f6), var(--lyd-royal-blue, #1d4ed8))',
            color: 'white',
            fontSize: '0.875rem',
            fontWeight: '600'
          }}
        >
          {siteName}
        </div>
        
        <div className="lyd-og-content">
          <div className="lyd-og-url">{displayUrl}</div>
          <div className="lyd-og-title">{truncatedTitle}</div>
          <div className="lyd-og-description">{truncatedDescription}</div>
        </div>
      </div>

      {/* Open Graph Indicators */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        fontSize: '0.75rem',
        color: 'var(--lyd-gray-500)',
        flexWrap: 'wrap'
      }}>
        <span className="lyd-badge secondary">
          {type.toUpperCase()}
        </span>
        
        {image && (
          <span style={{ color: 'var(--lyd-success)' }}>✓ Bild vorhanden</span>
        )}
        {!image && (
          <span style={{ color: 'var(--lyd-warning)' }}>⚠️ Kein Bild</span>
        )}
        
        {title.length <= 95 && (
          <span style={{ color: 'var(--lyd-success)' }}>✓ Titel optimal</span>
        )}
        {title.length > 95 && (
          <span style={{ color: 'var(--lyd-warning)' }}>⚠️ Titel zu lang</span>
        )}
        
        {description.length <= 200 && description.length >= 120 && (
          <span style={{ color: 'var(--lyd-success)' }}>✓ Beschreibung optimal</span>
        )}
        {description.length > 200 && (
          <span style={{ color: 'var(--lyd-warning)' }}>⚠️ Beschreibung zu lang</span>
        )}
        {description.length < 120 && (
          <span style={{ color: 'var(--lyd-warning)' }}>⚠️ Beschreibung zu kurz</span>
        )}
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <details style={{ fontSize: '0.75rem', color: 'var(--lyd-gray-500)' }}>
          <summary>Debug Info</summary>
          <div style={{ marginTop: '8px', background: 'var(--lyd-gray-100)', padding: '8px', borderRadius: '4px' }}>
            <div>Title Length: {title.length}/95</div>
            <div>Description Length: {description.length}/200</div>
            <div>Image: {image ? 'Present' : 'Missing'}</div>
            <div>Type: {type}</div>
            <div>Site: {siteName}</div>
          </div>
        </details>
      )}
    </div>
  );
}

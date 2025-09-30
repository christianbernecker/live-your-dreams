import { HTMLMediaItem, ImageMediaItem, MEDIA_PLACEHOLDER_REGEX, MediaItem, extractPlaceholders } from '@/types/media';

/**
 * Parses content and replaces media placeholders with actual media
 * Syntax: {{image:intro-photo}} or {{html:stats-chart}}
 */
export function renderMediaInContent(
  content: string,
  media: MediaItem[] | null
): string {
  if (!media || media.length === 0) {
    // Return placeholders as-is with visual indicator
    return content.replace(MEDIA_PLACEHOLDER_REGEX, (match, type, id) => {
      return `<div class="media-placeholder" style="
        padding: var(--spacing-md);
        margin: var(--spacing-md) 0;
        border: 2px dashed var(--lyd-line);
        border-radius: var(--border-radius-lg);
        background: var(--lyd-accent);
        text-align: center;
        color: var(--lyd-gray-600);
        font-family: monospace;
      ">
        <div style="font-size: 2rem; margin-bottom: var(--spacing-xs);">${type === 'image' ? '📸' : '📊'}</div>
        <div style="font-weight: 600;">{{${type}:${id}}}</div>
        <div style="font-size: 0.875rem; margin-top: var(--spacing-xs);">Media fehlt oder nicht hochgeladen</div>
      </div>`;
    });
  }

  // Replace placeholders with actual media
  return content.replace(MEDIA_PLACEHOLDER_REGEX, (match, type, id) => {
    const mediaItem = media.find(item => item.id === id && item.type === type);

    if (!mediaItem) {
      // Media not found - show placeholder
      return `<div class="media-placeholder" style="
        padding: var(--spacing-md);
        margin: var(--spacing-md) 0;
        border: 2px dashed var(--lyd-warning);
        border-radius: var(--border-radius-lg);
        background: rgba(255, 193, 7, 0.1);
        text-align: center;
        color: var(--lyd-warning);
        font-family: monospace;
      ">
        <div style="font-size: 2rem; margin-bottom: var(--spacing-xs);">⚠️</div>
        <div style="font-weight: 600;">{{${type}:${id}}}</div>
        <div style="font-size: 0.875rem; margin-top: var(--spacing-xs);">Media-ID nicht gefunden</div>
      </div>`;
    }

    if (type === 'image') {
      return renderImageMedia(mediaItem as ImageMediaItem);
    } else if (type === 'html') {
      return renderHTMLMedia(mediaItem as HTMLMediaItem);
    }

    return match; // Fallback
  });
}

/**
 * Renders an image media item
 */
function renderImageMedia(item: ImageMediaItem): string {
  if (!item.url) {
    return `<div class="media-placeholder" style="
      padding: var(--spacing-lg);
      margin: var(--spacing-lg) 0;
      border: 2px dashed var(--lyd-primary);
      border-radius: var(--border-radius-lg);
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%);
      text-align: center;
      color: var(--lyd-gray-700);
    ">
      <div style="font-size: 3rem; margin-bottom: var(--spacing-sm);">📸</div>
      <div style="font-weight: 700; font-size: 1rem; margin-bottom: var(--spacing-xs); color: var(--lyd-primary);">
        Bild-Platzhalter: ${item.id}
      </div>
      <div style="font-size: 0.95rem; margin-bottom: var(--spacing-sm); line-height: 1.5; color: var(--lyd-text);">
        <strong>Was ist zu sehen:</strong><br/>
        ${item.description}
      </div>
      <div style="font-size: 0.75rem; color: var(--lyd-gray-500); font-style: italic;">
        Bild noch nicht hochgeladen • Wird nach Upload hier angezeigt
      </div>
    </div>`;
  }

  return `
    <figure style="margin: var(--spacing-lg) 0; text-align: center;">
      <img 
        src="${item.url}" 
        alt="${item.alt}" 
        ${item.width ? `width="${item.width}"` : ''}
        ${item.height ? `height="${item.height}"` : ''}
        style="max-width: 100%; height: auto; border-radius: var(--border-radius-md); box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
        loading="lazy"
      />
      ${item.caption ? `<figcaption style="margin-top: var(--spacing-sm); font-size: 0.875rem; color: var(--lyd-gray-600); font-style: italic;">${item.caption}</figcaption>` : ''}
    </figure>
  `;
}

/**
 * Renders an HTML media item (iframe/embed)
 */
function renderHTMLMedia(item: HTMLMediaItem): string {
  if (!item.html) {
    return `<div class="media-placeholder" style="
      padding: var(--spacing-lg);
      margin: var(--spacing-lg) 0;
      border: 2px dashed var(--lyd-success);
      border-radius: var(--border-radius-lg);
      background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
      text-align: center;
      color: var(--lyd-gray-700);
    ">
      <div style="font-size: 3rem; margin-bottom: var(--spacing-sm);">📊</div>
      <div style="font-weight: 700; font-size: 1rem; margin-bottom: var(--spacing-xs); color: var(--lyd-success);">
        HTML-Embed-Platzhalter: ${item.id}
      </div>
      <div style="font-size: 0.95rem; margin-bottom: var(--spacing-sm); line-height: 1.5; color: var(--lyd-text);">
        <strong>Was zeigt die Grafik:</strong><br/>
        ${item.description}
      </div>
      ${item.data ? `
        <div style="
          margin-top: var(--spacing-md);
          padding: var(--spacing-sm);
          background: rgba(255, 255, 255, 0.7);
          border-radius: var(--border-radius-sm);
          text-align: left;
          font-size: 0.875rem;
          font-family: monospace;
          color: var(--lyd-gray-700);
          max-height: 150px;
          overflow-y: auto;
        ">
          <strong style="display: block; margin-bottom: var(--spacing-xs); font-family: var(--font-family-primary);">📈 Datengrundlage:</strong>
          <pre style="margin: 0; white-space: pre-wrap; word-break: break-word;">${item.data}</pre>
        </div>
      ` : ''}
      <div style="font-size: 0.75rem; color: var(--lyd-gray-500); font-style: italic; margin-top: var(--spacing-sm);">
        HTML-Code noch nicht eingefügt • Wird nach Eingabe hier eingebettet
      </div>
    </div>`;
  }

  return `
    <div class="html-embed" style="margin: var(--spacing-lg) 0;">
      ${item.html}
      ${item.description ? `<div style="margin-top: var(--spacing-sm); font-size: 0.875rem; color: var(--lyd-gray-600); text-align: center; font-style: italic;">${item.description}</div>` : ''}
    </div>
  `;
}

/**
 * Detects missing media items that are referenced but not provided
 */
export function detectMissingMedia(
  content: string,
  media: MediaItem[] | null
): Array<{ type: string; id: string }> {
  const placeholders = extractPlaceholders(content);
  const missing: Array<{ type: string; id: string }> = [];

  placeholders.forEach(placeholder => {
    const found = media?.find(
      item => item.id === placeholder.id && item.type === placeholder.type
    );
    if (!found) {
      missing.push(placeholder);
    }
  });

  return missing;
}

/**
 * Generates default media array from content placeholders
 * Useful for initializing media field when importing JSON
 */
export function generateDefaultMediaFromContent(content: string): MediaItem[] {
  const placeholders = extractPlaceholders(content);
  
  return placeholders.map(placeholder => {
    if (placeholder.type === 'image') {
      return {
        id: placeholder.id,
        type: 'image',
        url: null,
        alt: `Bild ${placeholder.id}`,
        description: `Beschreibung für Bild ${placeholder.id}`,
        isFeatured: placeholder.id === 'featured',
        position: placeholder.id === 'featured' ? 'header' : 'content'
      } as ImageMediaItem;
    } else {
      return {
        id: placeholder.id,
        type: 'html',
        html: null,
        description: `HTML Embed ${placeholder.id}`,
        data: undefined,
        position: 'content'
      } as HTMLMediaItem;
    }
  });
}

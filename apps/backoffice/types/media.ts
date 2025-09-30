/**
 * Media System Types
 * Unified system for Images & HTML Embeds in Blog Posts
 */

export type MediaType = 'image' | 'html';

export interface BaseMediaItem {
  id: string;                    // Unique identifier for placeholder (e.g., "intro-photo", "stats-chart")
  type: MediaType;
  isFeatured?: boolean;          // Featured image for post header/thumbnails
  position?: 'header' | 'content' | 'footer';  // Rendering position hint
}

export interface ImageMediaItem extends BaseMediaItem {
  type: 'image';
  url: string | null;            // Image URL (Unsplash/Pexels or Vercel Blob)
  alt: string;                   // Alt text for accessibility
  description: string;           // WAS ist zu sehen (für KI & Preview)
  caption?: string;              // Optional caption/credit
  width?: number;                // Optional dimensions
  height?: number;
}

export interface HTMLMediaItem extends BaseMediaItem {
  type: 'html';
  html: string | null;           // Sanitized HTML/iframe embed
  description: string;           // WAS zeigt die Grafik (für KI & Preview)
  data?: string;                 // Datengrundlage als JSON/Text
  allowedDomains?: string[];     // Whitelist for iframe src
}

export type MediaItem = ImageMediaItem | HTMLMediaItem;

/**
 * HTML Embed Whitelist Configuration
 */
export const ALLOWED_EMBED_DOMAINS = [
  // Video
  'youtube.com',
  'www.youtube.com',
  'vimeo.com',
  'player.vimeo.com',
  
  // Charts & Data
  'datawrapper.dwcdn.net',
  'public.flourish.studio',
  
  // Maps
  'www.google.com',
  'maps.google.com',
  
  // Own Services
  'liveyourdreams.online',
  '*.liveyourdreams.online',
] as const;

export const ALLOWED_SCRIPT_DOMAINS = [
  'cdn.jsdelivr.net',
  'cdnjs.cloudflare.com',
  'unpkg.com',
] as const;

/**
 * Media Validation Helpers
 */
export function isImageMedia(item: MediaItem): item is ImageMediaItem {
  return item.type === 'image';
}

export function isHTMLMedia(item: MediaItem): item is HTMLMediaItem {
  return item.type === 'html';
}

export function getFeaturedImage(media: MediaItem[] | null): ImageMediaItem | null {
  if (!media) return null;
  const featured = media.find(item => item.isFeatured && item.type === 'image');
  return featured as ImageMediaItem || null;
}

/**
 * Placeholder Pattern for Content
 * Syntax: {{image:intro-photo}} or {{html:stats-chart}}
 */
export const MEDIA_PLACEHOLDER_REGEX = /\{\{(image|html):([a-z0-9-]+)\}\}/gi;

export function extractPlaceholders(content: string): Array<{ type: MediaType; id: string }> {
  const matches = content.matchAll(MEDIA_PLACEHOLDER_REGEX);
  return Array.from(matches).map(match => ({
    type: match[1] as MediaType,
    id: match[2]
  }));
}

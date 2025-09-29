/**
 * LYD Blog System v1.1 - HTML Sanitizer
 * 
 * Sichere Verarbeitung von HTML/MDX/Markdown Content
 * Whitelist-basierter Ansatz für XSS-Schutz
 */

import DOMPurify from 'isomorphic-dompurify';
import { JSDOM } from 'jsdom';

// ============================================================================
// ALLOWED HTML ELEMENTS & ATTRIBUTES (Security Whitelist)
// ============================================================================

const ALLOWED_TAGS = [
  // Text Content
  'p', 'br', 'hr', 'div', 'span',
  
  // Headings
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  
  // Lists
  'ul', 'ol', 'li',
  
  // Text Formatting
  'strong', 'em', 'b', 'i', 'u', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
  
  // Links (with restrictions)
  'a',
  
  // Images (with restrictions)
  'img',
  
  // Media
  'figure', 'figcaption',
  
  // Tables
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  
  // Code
  'code', 'pre',
  
  // Quotes
  'blockquote', 'cite', 'q',
  
  // SVG (limited subset for icons/graphics)
  'svg', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline',
  'g', 'defs', 'use', 'symbol', 'title', 'desc',
  
  // iframes (ONLY whitelisted domains)
  'iframe'
] as const;

const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  // Global attributes
  '*': ['class', 'id', 'style', 'data-*'],
  
  // Links
  'a': ['href', 'target', 'rel', 'title'],
  
  // Images
  'img': ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'],
  
  // Tables
  'th': ['scope', 'colspan', 'rowspan'],
  'td': ['colspan', 'rowspan'],
  'table': ['summary'],
  
  // iframes (CRITICAL: Only whitelisted)
  'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'sandbox', 'loading', 'title'],
  
  // SVG
  'svg': ['xmlns', 'viewBox', 'width', 'height', 'fill', 'stroke', 'stroke-width'],
  'path': ['d', 'fill', 'stroke', 'stroke-width'],
  'rect': ['x', 'y', 'width', 'height', 'fill', 'stroke', 'stroke-width'],
  'circle': ['cx', 'cy', 'r', 'fill', 'stroke', 'stroke-width'],
  'ellipse': ['cx', 'cy', 'rx', 'ry', 'fill', 'stroke', 'stroke-width'],
  'line': ['x1', 'y1', 'x2', 'y2', 'stroke', 'stroke-width'],
  'polygon': ['points', 'fill', 'stroke', 'stroke-width'],
  'polyline': ['points', 'fill', 'stroke', 'stroke-width'],
  'g': ['transform', 'fill', 'stroke', 'stroke-width'],
  'use': ['href', 'x', 'y', 'transform'],
};

// ============================================================================
// WHITELISTED IFRAME DOMAINS (Security Critical)
// ============================================================================

const ALLOWED_IFRAME_DOMAINS = [
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com',
  // Nicht erlaubt: youtube.com (Tracking), andere Video-Plattformen
] as const;

// ============================================================================
// SANITIZATION CONFIGURATION
// ============================================================================

type SanitizationResult = 
  | {
      success: true;
      content: string;
      warnings?: string[];
    }
  | {
      success: false;
      errors: string[];
    }

interface SanitizationOptions {
  allowIframes?: boolean;
  allowSVG?: boolean;
  maxLength?: number;
  strictMode?: boolean;
}

// ============================================================================
// CONTENT FORMAT PROCESSORS
// ============================================================================

/**
 * Sanitize HTML content based on format type
 */
export async function sanitizeHtmlContent(
  content: string, 
  format: 'md' | 'mdx' | 'html',
  options: SanitizationOptions = {}
): Promise<SanitizationResult> {
  try {
    const {
      allowIframes = true,
      allowSVG = true,
      maxLength = 100000,
      strictMode = false
    } = options;

    // Input validation
    if (!content || typeof content !== 'string') {
      return {
        success: false,
        errors: ['Content is required and must be string']
      };
    }

    if (content.length > maxLength) {
      return {
        success: false,
        errors: [`Content too large: ${content.length} > ${maxLength} characters`]
      };
    }

    // Create DOM for server-side processing
    const window = new JSDOM('<!DOCTYPE html><html><body></body></html>').window;
    const purify = DOMPurify(window);

    // Configure DOMPurify based on format
    let allowedTags = [...ALLOWED_TAGS];
    let allowedAttributes = { ...ALLOWED_ATTRIBUTES };

    // Format-specific processing
    if (format === 'md' || format === 'mdx') {
      // Markdown: More restrictive (no iframes by default)
      if (!allowIframes) {
        allowedTags = allowedTags.filter(tag => tag !== 'iframe');
        delete allowedAttributes['iframe'];
      }
    }

    if (!allowSVG) {
      const svgTags = ['svg', 'path', 'rect', 'circle', 'ellipse', 'line', 'polygon', 'polyline', 'g', 'defs', 'use', 'symbol', 'title', 'desc'];
      allowedTags = allowedTags.filter(tag => !svgTags.includes(tag));
      svgTags.forEach(tag => delete allowedAttributes[tag]);
    }

    // Configure purification
    purify.setConfig({
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: Object.values(allowedAttributes).flat(),
      ALLOW_DATA_ATTR: true,
      ALLOW_ARIA_ATTR: true,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SANITIZE_DOM: true,
      SANITIZE_NAMED_PROPS: true,
      KEEP_CONTENT: true,
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_TRUSTED_TYPE: false
    });

    // Add custom hook for iframe domain validation
    purify.addHook('uponSanitizeElement', (node, data) => {
      if (data.tagName === 'iframe') {
        const src = node.getAttribute('src');
        if (src) {
          const isAllowed = ALLOWED_IFRAME_DOMAINS.some(domain => 
            src.includes(domain)
          );
          
          if (!isAllowed) {
            node.remove();
            return;
          }

          // Force secure attributes
          node.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-presentation');
          node.setAttribute('loading', 'lazy');
          node.setAttribute('referrerpolicy', 'no-referrer');
          
          // Limit size
          const width = node.getAttribute('width');
          const height = node.getAttribute('height');
          if (!width) node.setAttribute('width', '100%');
          if (!height) node.setAttribute('height', '315');
        }
      }
    });

    // Add hook for link security
    purify.addHook('uponSanitizeElement', (node, data) => {
      if (data.tagName === 'a') {
        const href = node.getAttribute('href');
        if (href) {
          // External links: add security attributes
          if (href.startsWith('http') && !href.includes('liveyourdreams.online')) {
            node.setAttribute('rel', 'nofollow noopener noreferrer');
            node.setAttribute('target', '_blank');
          }
        }
      }
    });

    // Sanitize content
    const sanitized = purify.sanitize(content, { 
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false 
    });

    // Collect warnings
    const warnings: string[] = [];
    
    // Check if content was significantly altered
    const originalLength = content.length;
    const sanitizedLength = sanitized.length;
    
    if (sanitizedLength < originalLength * 0.8) {
      warnings.push(`Content significantly reduced: ${originalLength} -> ${sanitizedLength} characters`);
    }

    return {
      success: true,
      content: sanitized,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    console.error('Sanitization error:', error);
    
    return {
      success: false,
      errors: [`Sanitization failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// ============================================================================
// MARKDOWN-SPECIFIC SANITIZATION
// ============================================================================

/**
 * Sanitize Markdown content (removes HTML, keeps Markdown syntax)
 */
export async function sanitizeMarkdown(content: string): Promise<SanitizationResult> {
  // For pure Markdown, we're more restrictive
  return sanitizeHtmlContent(content, 'md', {
    allowIframes: false,
    allowSVG: false,
    strictMode: true
  });
}

// ============================================================================
// HTML BLOCK VALIDATION (für complex graphics)
// ============================================================================

/**
 * Validate and sanitize HTML blocks from import
 */
export async function validateHtmlBlock(
  htmlBlock: {
    id: string;
    html: string;
    css?: string;
    js?: string;
  }
): Promise<SanitizationResult & { processedBlock?: any }> {
  try {
    // Sanitize HTML
    const htmlResult = await sanitizeHtmlContent(htmlBlock.html, 'html', {
      allowIframes: true,
      allowSVG: true,
      maxLength: 50000 // 50KB HTML limit
    });

    if (!htmlResult.success) {
      return htmlResult;
    }

    // Basic CSS validation (remove dangerous properties)
    let sanitizedCSS = htmlBlock.css || '';
    if (sanitizedCSS) {
      // Remove dangerous CSS properties
      const dangerousProperties = [
        'expression', 'javascript:', 'vbscript:', 'onload', 'onerror',
        'position: fixed', 'position: absolute', 'z-index: 999',
        '@import', 'behavior:', '-moz-binding', '-webkit-binding'
      ];
      
      dangerousProperties.forEach(prop => {
        const regex = new RegExp(prop.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        sanitizedCSS = sanitizedCSS.replace(regex, '/* REMOVED */');
      });

      // Limit CSS size
      if (sanitizedCSS.length > 10000) {
        return {
          success: false,
          errors: ['CSS too large (max 10KB)']
        };
      }
    }

    // JavaScript validation (very restrictive)
    let sanitizedJS = htmlBlock.js || '';
    if (sanitizedJS) {
      // For security: very limited JS allowed
      const allowedJSPatterns = [
        /console\.log/gi,
        /document\.querySelector/gi,
        /addEventListener/gi,
        // Add more as needed, but be very careful
      ];

      const hasDisallowedJS = sanitizedJS.match(/eval|function|var |let |const |class |import |require/gi);
      if (hasDisallowedJS) {
        return {
          success: false,
          errors: ['JavaScript contains disallowed patterns']
        };
      }

      // Limit JS size
      if (sanitizedJS.length > 5000) {
        return {
          success: false,
          errors: ['JavaScript too large (max 5KB)']
        };
      }
    }

    return {
      success: true,
      content: htmlResult.content,
      warnings: htmlResult.warnings,
      processedBlock: {
        id: htmlBlock.id,
        html: htmlResult.content,
        css: sanitizedCSS,
        js: sanitizedJS
      }
    };

  } catch (error) {
    return {
      success: false,
      errors: [`HTML block validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// ============================================================================
// CONTENT SECURITY POLICY HELPERS
// ============================================================================

/**
 * Generate CSP directives for HTML blocks
 */
export function generateCSPForHtmlBlocks(htmlBlocks: any[]): string {
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'", // Nur für HTML-Blocks
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self'",
    "frame-src " + ALLOWED_IFRAME_DOMAINS.map(domain => `https://${domain}`).join(' '),
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ];

  return cspDirectives.join('; ');
}

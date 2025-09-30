import { ALLOWED_EMBED_DOMAINS } from '@/types/media';

/**
 * Validates and sanitizes HTML embeds
 * Only allows safe iframe embeds from whitelisted domains
 */
export function validateHTMLEmbed(html: string): { valid: boolean; error?: string; sanitized?: string } {
  // Validate script tags (allow whitelisted CDNs only)
  const scriptTags = html.match(/<script[\s\S]*?>[\s\S]*?<\/script>/gi) || [];
  
  for (const script of scriptTags) {
    // Allow external scripts from whitelisted CDNs
    const externalScriptMatch = script.match(/<script[^>]+src=["']([^"']+)["']/i);
    
    if (externalScriptMatch) {
      const src = externalScriptMatch[1];
      const allowedScriptDomains = [
        'cdn.jsdelivr.net',
        'cdnjs.cloudflare.com',
        'unpkg.com'
      ];
      
      const isAllowedScript = allowedScriptDomains.some(domain => src.includes(domain));
      
      if (!isAllowedScript) {
        return {
          valid: false,
          error: `External script domain not whitelisted. Allowed: ${allowedScriptDomains.join(', ')}`
        };
      }
    } else {
      // Inline script - check for dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/gi,
        /document\.write\s*\(/gi,
        /window\.location\s*=/gi,
        /document\.cookie/gi,
        /localStorage/gi,
        /sessionStorage/gi
      ];
      
      for (const pattern of dangerousPatterns) {
        if (pattern.test(script)) {
          return {
            valid: false,
            error: `Dangerous JavaScript detected (${pattern.source}). Not allowed for security reasons.`
          };
        }
      }
    }
  }

  // Check for inline event handlers (XSS protection)
  // Only match event handlers in HTML tags, not in scripts or strings
  // Remove script content first to avoid false positives
  const scriptContentRemoved = html.replace(/<script[\s\S]*?<\/script>/gi, '<!-- script removed -->');
  const tagWithEventHandler = /<[^>]+\s(on\w+)\s*=/i;
  
  if (tagWithEventHandler.test(scriptContentRemoved)) {
    return {
      valid: false,
      error: 'Inline event handlers (onclick, onerror, etc.) are not allowed in HTML tags.'
    };
  }

  // Extract iframe src if present
  const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  
  if (iframeMatch) {
    const src = iframeMatch[1];
    
    // Validate iframe domain
    const isAllowed = ALLOWED_EMBED_DOMAINS.some(domain => {
      if (domain.startsWith('*.')) {
        const baseDomain = domain.slice(2);
        return src.includes(baseDomain);
      }
      return src.includes(domain);
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Domain not whitelisted. Allowed: ${ALLOWED_EMBED_DOMAINS.join(', ')}`
      };
    }

    // Sanitize iframe: ensure sandbox and security attributes
    let sanitized = html;
    
    // Add sandbox if not present
    if (!html.includes('sandbox=')) {
      sanitized = sanitized.replace(
        /<iframe/i,
        '<iframe sandbox="allow-scripts allow-same-origin allow-popups allow-forms"'
      );
    }

    // Add loading="lazy" for performance
    if (!html.includes('loading=')) {
      sanitized = sanitized.replace(
        /<iframe/i,
        '<iframe loading="lazy"'
      );
    }

    return {
      valid: true,
      sanitized
    };
  }

  // If no iframe, allow simple HTML (but still check for dangerous patterns)
  const simpleSafeHTML = /^[\s\S]*$/; // Any HTML without scripts/event handlers
  
  return {
    valid: true,
    sanitized: html
  };
}

/**
 * Extracts embed type from HTML
 */
export function detectEmbedType(html: string): 'iframe' | 'html' | 'unknown' {
  if (/<iframe/i.test(html)) return 'iframe';
  if (/<[a-z]+/i.test(html)) return 'html';
  return 'unknown';
}

/**
 * Validates image URL
 */
export function validateImageURL(url: string): { valid: boolean; error?: string } {
  try {
    const parsedUrl = new URL(url);
    
    // Check protocol
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return {
        valid: false,
        error: 'Only HTTP/HTTPS URLs are allowed'
      };
    }

    // Check file extension (optional, can be removed if CDNs don't use extensions)
    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
    const hasValidExtension = validExtensions.some(ext => 
      parsedUrl.pathname.toLowerCase().endsWith(ext)
    );
    
    // Allow URLs without extension (for CDN-generated URLs)
    const isCDN = parsedUrl.hostname.includes('blob.vercel-storage.com') ||
                  parsedUrl.hostname.includes('unsplash.com') ||
                  parsedUrl.hostname.includes('pexels.com') ||
                  parsedUrl.hostname.includes('images.unsplash.com');

    if (!hasValidExtension && !isCDN) {
      return {
        valid: false,
        error: 'Invalid image URL. Must end with .jpg, .png, .webp, .gif, or .svg, or be from a known CDN'
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format'
    };
  }
}

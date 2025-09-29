/**
 * LYD Blog System v1.1 - MICRO Step 5
 * 
 * Native HTML Sanitizer - Pure JavaScript/Regex
 * KEINE externen Dependencies (DOMPurify, etc.)
 */

// ============================================================================
// SIMPLE TYPES
// ============================================================================

export type SanitizationResult = {
  success: true;
  content: string;
  warnings?: string[];
} | {
  success: false;
  errors: string[];
};

// ============================================================================
// SECURITY PATTERNS (Regex-basiert)
// ============================================================================

const DANGEROUS_PATTERNS = [
  // Scripts
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  
  // Event Handlers
  /\bon\w+\s*=\s*[^>\s]+/gi, // onclick, onload, etc.
  
  // JavaScript URLs
  /javascript\s*:/gi,
  
  // Data URLs with JavaScript
  /data\s*:\s*text\/html/gi,
  /data\s*:\s*application\/javascript/gi,
  
  // Style elements (can contain JavaScript)
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  
  // Link elements (external resources)
  /<link\b[^>]*>/gi,
  
  // Meta elements
  /<meta\b[^>]*>/gi,
  
  // Objects and embeds
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^>]*>/gi,
  
  // Forms (can be used for data exfiltration)
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
  
  // iframes (will be handled separately)
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi
];

// ============================================================================
// ALLOWED IFRAME DOMAINS
// ============================================================================

const ALLOWED_IFRAME_DOMAINS = [
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'vimeo.com',
  'player.vimeo.com'
];

// ============================================================================
// CORE SANITIZATION FUNCTION
// ============================================================================

export async function sanitizeHtmlContent(
  content: string,
  format: 'md' | 'mdx' | 'html' = 'html'
): Promise<SanitizationResult> {
  try {
    if (!content || typeof content !== 'string') {
      return {
        success: false,
        errors: ['Content must be a non-empty string']
      };
    }

    // Size limit
    if (content.length > 100000) { // 100KB
      return {
        success: false,
        errors: [`Content too large: ${content.length} characters (max: 100,000)`]
      };
    }

    let sanitized = content;
    const warnings: string[] = [];

    // 1. Remove dangerous patterns
    DANGEROUS_PATTERNS.forEach((pattern, index) => {
      const matches = sanitized.match(pattern);
      if (matches) {
        warnings.push(`Removed ${matches.length} dangerous element(s)`);
        sanitized = sanitized.replace(pattern, '<!-- SECURITY: Removed dangerous content -->');
      }
    });

    // 2. Handle iframes separately (whitelist approach)
    const iframePattern = /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi;
    const iframes = sanitized.match(iframePattern);
    
    if (iframes) {
      for (const iframe of iframes) {
        const srcMatch = iframe.match(/src\s*=\s*["']([^"']+)["']/i);
        if (srcMatch) {
          const src = srcMatch[1];
          const isAllowed = ALLOWED_IFRAME_DOMAINS.some(domain => src.includes(domain));
          
          if (isAllowed) {
            // Sanitize iframe attributes
            const sanitizedIframe = iframe
              .replace(/\son\w+\s*=\s*[^>\s]+/gi, '') // Remove event handlers
              .replace(/sandbox\s*=\s*["'][^"']*["']/gi, 'sandbox="allow-scripts allow-same-origin"')
              .replace(/frameborder\s*=\s*["']?\d+["']?/gi, 'frameborder="0"');
            
            sanitized = sanitized.replace(iframe, sanitizedIframe);
          } else {
            warnings.push(`Removed iframe from disallowed domain: ${src}`);
            sanitized = sanitized.replace(iframe, '<!-- SECURITY: iframe from disallowed domain removed -->');
          }
        } else {
          warnings.push('Removed iframe without valid src');
          sanitized = sanitized.replace(iframe, '<!-- SECURITY: iframe without src removed -->');
        }
      }
    }

    // 3. Remove eval and dangerous JavaScript functions
    const jsPatterns = [
      /eval\s*\(/gi,
      /Function\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi
    ];

    jsPatterns.forEach(pattern => {
      if (pattern.test(sanitized)) {
        warnings.push('Removed dangerous JavaScript function');
        sanitized = sanitized.replace(pattern, 'BLOCKED_FUNCTION(');
      }
    });

    // 4. Validate remaining content
    const originalLength = content.length;
    const sanitizedLength = sanitized.length;
    
    if (sanitizedLength < originalLength * 0.7) {
      warnings.push(`Content significantly reduced: ${originalLength} → ${sanitizedLength} characters`);
    }

    // 5. Basic HTML structure validation
    const unclosedTags = (sanitized.match(/<[^/>][^>]*>/g) || []).length - 
                        (sanitized.match(/<\/[^>]+>/g) || []).length;
    
    if (unclosedTags > 5) {
      warnings.push(`Potentially ${unclosedTags} unclosed HTML tags detected`);
    }

    return {
      success: true,
      content: sanitized,
      warnings: warnings.length > 0 ? warnings : undefined
    };

  } catch (error) {
    return {
      success: false,
      errors: [`Sanitization failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// ============================================================================
// SIMPLIFIED VALIDATION FUNCTIONS
// ============================================================================

export function validateBasicHtml(html: string): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  // Check for dangerous patterns
  if (/<script/i.test(html)) {
    issues.push('Contains script tags');
  }

  if (/on\w+\s*=/i.test(html)) {
    issues.push('Contains event handlers');
  }

  if (/javascript:/i.test(html)) {
    issues.push('Contains JavaScript URLs');
  }

  if (html.length > 50000) {
    issues.push('HTML content too large (max 50KB)');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export function extractTextContent(html: string): string {
  // Simple text extraction (removes all HTML tags)
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function estimateReadingTime(content: string): number {
  const text = extractTextContent(content);
  const words = text.split(/\s+/).length;
  return Math.ceil(words / 200); // Assume 200 words per minute
}

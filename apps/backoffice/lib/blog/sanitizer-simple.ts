/**
 * LYD Blog System v1.1 - Simple HTML Sanitizer
 * 
 * Einfache Alternative ohne externe Dependencies
 * Für schnelle Production-Deployment ohne Build-Probleme
 */

// ============================================================================
// SIMPLE SANITIZATION RESULT TYPE
// ============================================================================

export type SanitizationResult = 
  | {
      success: true;
      content: string;
      warnings?: string[];
    }
  | {
      success: false;
      errors: string[];
    }

// ============================================================================
// BASIC HTML SANITIZATION (ohne DOMPurify)
// ============================================================================

const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi, // onclick, onload, etc.
  /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
  /<link\b[^>]*>/gi,
  /<meta\b[^>]*>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^>]*>/gi,
  /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi
];

/**
 * Basic HTML sanitization ohne externe Dependencies
 */
export async function sanitizeHtmlContent(
  content: string, 
  format: 'md' | 'mdx' | 'html'
): Promise<SanitizationResult> {
  try {
    if (!content || typeof content !== 'string') {
      return {
        success: false,
        errors: ['Content is required and must be string']
      };
    }

    if (content.length > 100000) { // 100KB limit
      return {
        success: false,
        errors: ['Content too large (max 100KB)']
      };
    }

    let sanitized = content;
    const warnings: string[] = [];
    
    // Remove dangerous patterns
    DANGEROUS_PATTERNS.forEach(pattern => {
      const matches = sanitized.match(pattern);
      if (matches) {
        warnings.push(`Removed ${matches.length} dangerous elements`);
        sanitized = sanitized.replace(pattern, '<!-- REMOVED FOR SECURITY -->');
      }
    });

    // Basic security checks
    if (sanitized.includes('eval(')) {
      sanitized = sanitized.replace(/eval\s*\(/gi, 'BLOCKED_eval(');
      warnings.push('Blocked eval() calls');
    }

    // Check for significant content reduction
    if (sanitized.length < content.length * 0.8) {
      warnings.push(`Content significantly reduced: ${content.length} -> ${sanitized.length} characters`);
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

/**
 * Validate HTML block (simplified)
 */
export async function validateHtmlBlock(htmlBlock: {
  id: string;
  html: string;
  css?: string;
  js?: string;
}): Promise<SanitizationResult & { processedBlock?: any }> {
  
  const htmlResult = await sanitizeHtmlContent(htmlBlock.html, 'html');
  
  if (!htmlResult.success) {
    return htmlResult;
  }

  // Basic CSS/JS validation
  const warnings = htmlResult.warnings || [];
  
  if (htmlBlock.css && htmlBlock.css.length > 10000) {
    return {
      success: false,
      errors: ['CSS too large (max 10KB)']
    };
  }
  
  if (htmlBlock.js && htmlBlock.js.length > 5000) {
    return {
      success: false,
      errors: ['JavaScript too large (max 5KB)']
    };
  }

  return {
    success: true,
    content: htmlResult.content,
    warnings,
    processedBlock: {
      id: htmlBlock.id,
      html: htmlResult.content,
      css: htmlBlock.css || '',
      js: htmlBlock.js || ''
    }
  };
}

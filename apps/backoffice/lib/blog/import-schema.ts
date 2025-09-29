/**
 * LYD Blog System v1.1 - Import Schema Validation
 * Basierend auf technischem Briefing v1.0
 * 
 * Zod Schema für robuste JSON v1.1 Import Validation
 * Unterstützt MD/MDX/HTML Content + HTML-Blocks + Assets
 */

import { z } from 'zod';

// ============================================================================
// HTML BLOCK SCHEMA (für komplexe Grafiken/Interaktivität)
// ============================================================================

const HtmlBlockSchema = z.object({
  id: z.string()
    .min(1, 'HTML Block ID ist erforderlich')
    .regex(/^[a-z0-9-]+$/, 'HTML Block ID darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten'),
  title: z.string()
    .min(1, 'HTML Block Title ist erforderlich')
    .max(100, 'HTML Block Title zu lang (max 100 Zeichen)')
    .optional(),
  html: z.string()
    .min(1, 'HTML Content ist erforderlich')
    .max(50000, 'HTML Content zu groß (max 50KB)'), // Prevent XSS via size
  css: z.string()
    .max(10000, 'CSS Content zu groß (max 10KB)')
    .optional(),
  js: z.string()
    .max(5000, 'JavaScript Content zu groß (max 5KB)')
    .optional(),
  sandbox: z.object({
    allowedIframes: z.array(
      z.string().url('Ungültige iframe URL')
    ).default([]),
    allow: z.string()
      .optional()
      .default('fullscreen; picture-in-picture'),
    height: z.number()
      .min(100, 'Minimale Höhe: 100px')
      .max(2000, 'Maximale Höhe: 2000px')
      .default(420)
  }).optional()
});

// ============================================================================
// SEO & METADATA SCHEMAS
// ============================================================================

const OpenGraphSchema = z.object({
  title: z.string()
    .min(10, 'OG Title zu kurz (min 10 Zeichen)')
    .max(60, 'OG Title zu lang (max 60 Zeichen)')
    .optional(),
  description: z.string()
    .min(40, 'OG Description zu kurz (min 40 Zeichen)')
    .max(160, 'OG Description zu lang (max 160 Zeichen)')
    .optional(),
  image: z.string()
    .optional(), // kann asset: oder URL sein
  type: z.string()
    .default('article')
    .optional()
});

const SEOSchema = z.object({
  metaTitle: z.string()
    .min(10, 'Meta Title zu kurz (min 10 Zeichen)')
    .max(120, 'Meta Title zu lang (max 120 Zeichen)')
    .optional(),
  metaDescription: z.string()
    .min(40, 'Meta Description zu kurz (min 40 Zeichen)')
    .max(200, 'Meta Description zu lang (max 200 Zeichen)')
    .optional(),
  focusKeyword: z.string()
    .min(2, 'Focus Keyword zu kurz')
    .max(50, 'Focus Keyword zu lang')
    .optional(),
  keywords: z.array(
    z.string()
      .min(2, 'Keyword zu kurz')
      .max(30, 'Keyword zu lang')
  ).max(10, 'Zu viele Keywords (max 10)')
    .default([]),
  canonicalUrl: z.string()
    .url('Ungültige Canonical URL')
    .optional(),
  og: OpenGraphSchema.optional()
});

// ============================================================================
// IMAGE & ASSET SCHEMAS
// ============================================================================

const ImageSchema = z.object({
  src: z.string()
    .min(1, 'Image src ist erforderlich'),
  alt: z.string()
    .min(3, 'Alt Text zu kurz (min 3 Zeichen)')
    .max(125, 'Alt Text zu lang (max 125 Zeichen)'),
  width: z.number()
    .min(100, 'Bildbreite zu klein (min 100px)')
    .max(4000, 'Bildbreite zu groß (max 4000px)')
    .optional(),
  height: z.number()
    .min(100, 'Bildhöhe zu klein (min 100px)')
    .max(4000, 'Bildhöhe zu groß (max 4000px)')
    .optional()
});

const FeaturedImageSchema = z.object({
  src: z.string()
    .min(1, 'Featured Image src ist erforderlich'),
  alt: z.string()
    .min(3, 'Featured Image Alt Text zu kurz (min 3 Zeichen)')
    .max(125, 'Featured Image Alt Text zu lang (max 125 Zeichen)')
});

// ============================================================================
// ASSET SCHEMA (für Base64 oder externe Referenzen)
// ============================================================================

const AssetSchema = z.object({
  name: z.string()
    .min(1, 'Asset Name ist erforderlich')
    .regex(/^[a-z0-9.-]+\.(webp|jpg|jpeg|png|svg|css|js)$/i, 'Ungültiger Asset Name oder Dateierweiterung'),
  mime: z.string()
    .regex(/^(image\/(webp|jpeg|png|svg\+xml)|text\/(css|javascript)|application\/javascript)$/, 'Ungültiger MIME-Type'),
  encoding: z.enum(['base64', 'url'])
    .default('base64'),
  data: z.string()
    .min(1, 'Asset Data ist erforderlich')
    .max(10 * 1024 * 1024, 'Asset zu groß (max 10MB)') // Base64 kann ~33% größer sein
});

// ============================================================================
// PLATFORM & CONTENT VALIDATION
// ============================================================================

const PlatformSchema = z.enum(['WOHNEN', 'MAKLER', 'ENERGIE'], {
  errorMap: () => ({ message: 'Ungültige Plattform. Erlaubt: WOHNEN, MAKLER, ENERGIE' })
});

const ContentFormatSchema = z.enum(['md', 'mdx', 'html'], {
  errorMap: () => ({ message: 'Ungültiges Format. Erlaubt: md, mdx, html' })
});

// ============================================================================
// CONTENT SCHEMA (Hauptinhalt)
// ============================================================================

const ContentSchema = z.object({
  // Multi-Platform Distribution
  platforms: z.array(PlatformSchema)
    .min(1, 'Mindestens eine Plattform muss ausgewählt werden')
    .max(3, 'Maximal 3 Plattformen erlaubt'),
  
  // Taxonomie
  category: z.string()
    .min(2, 'Kategorie zu kurz')
    .max(50, 'Kategorie zu lang'),
  subcategory: z.string()
    .min(2, 'Unterkategorie zu kurz')
    .max(50, 'Unterkategorie zu lang')
    .optional(),
  tags: z.array(
    z.string()
      .min(2, 'Tag zu kurz')
      .max(30, 'Tag zu lang')
  ).max(15, 'Zu viele Tags (max 15)')
    .default([]),

  // Core Content
  title: z.string()
    .min(10, 'Titel zu kurz (min 10 Zeichen)')
    .max(120, 'Titel zu lang (max 120 Zeichen)')
    .refine(
      (title) => !/^\s|\s$/.test(title), 
      'Titel darf nicht mit Leerzeichen beginnen oder enden'
    ),
  slug: z.string()
    .min(5, 'Slug zu kurz (min 5 Zeichen)')
    .max(100, 'Slug zu lang (max 100 Zeichen)')
    .regex(
      /^[a-z0-9-]+$/, 
      'Slug darf nur Kleinbuchstaben, Zahlen und Bindestriche enthalten'
    )
    .refine(
      (slug) => !slug.startsWith('-') && !slug.endsWith('-'), 
      'Slug darf nicht mit Bindestrich beginnen oder enden'
    ),
  excerpt: z.string()
    .min(40, 'Excerpt zu kurz (min 40 Zeichen)')
    .max(200, 'Excerpt zu lang (max 200 Zeichen)')
    .refine(
      (excerpt) => !/^\s|\s$/.test(excerpt), 
      'Excerpt darf nicht mit Leerzeichen beginnen oder enden'
    ),

  // SEO
  seo: SEOSchema,

  // Content Format & Body
  format: ContentFormatSchema.default('mdx'),
  body: z.string()
    .max(100000, 'Content zu groß (max 100KB)')
    .optional(),

  // Rich Content
  htmlBlocks: z.array(HtmlBlockSchema)
    .max(10, 'Zu viele HTML-Blocks (max 10)')
    .default([]),
  featuredImage: FeaturedImageSchema.optional(),
  images: z.array(ImageSchema)
    .max(20, 'Zu viele Bilder (max 20)')
    .default([]),

  // Structured Data
  jsonLd: z.record(z.any())
    .optional()
    .refine((jsonLd) => {
      if (!jsonLd) return true;
      return jsonLd['@context'] === 'https://schema.org' && 
             (jsonLd['@type'] === 'BlogPosting' || jsonLd['@type'] === 'Article');
    }, 'JSON-LD muss Schema.org BlogPosting oder Article sein')
});

// ============================================================================
// SOURCE METADATA SCHEMA
// ============================================================================

const SourceSchema = z.object({
  agent: z.string()
    .min(1, 'Agent Name ist erforderlich'),
  model: z.string()
    .min(1, 'Model Name ist erforderlich'),
  timestamp: z.string()
    .datetime('Ungültiges Timestamp Format (ISO 8601 erforderlich)')
});

// ============================================================================
// MAIN IMPORT SCHEMA v1.1
// ============================================================================

export const ImportSchema = z.object({
  version: z.literal('1.1', {
    errorMap: () => ({ message: 'Nur Version 1.1 wird unterstützt' })
  }),
  source: SourceSchema,
  content: ContentSchema,
  assets: z.array(AssetSchema)
    .max(50, 'Zu viele Assets (max 50)')
    .default([])
}).superRefine((data, ctx) => {
  // Content Validation: Body ODER htmlBlocks erforderlich
  const hasBody = data.content.body && data.content.body.trim().length > 0;
  const hasHtmlBlocks = data.content.htmlBlocks && data.content.htmlBlocks.length > 0;
  
  if (!hasBody && !hasHtmlBlocks) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Entweder "body" oder "htmlBlocks" muss vorhanden sein',
      path: ['content']
    });
  }

  // Asset Reference Validation
  const referencedAssets = new Set<string>();
  
  // Check featuredImage asset references
  if (data.content.featuredImage?.src.startsWith('asset:')) {
    const assetName = data.content.featuredImage.src.replace('asset:', '');
    referencedAssets.add(assetName);
  }
  
  // Check images asset references
  data.content.images?.forEach((img) => {
    if (img.src.startsWith('asset:')) {
      const assetName = img.src.replace('asset:', '');
      referencedAssets.add(assetName);
    }
  });
  
  // Check OG image asset references
  if (data.content.seo.og?.image?.startsWith('asset:')) {
    const assetName = data.content.seo.og.image.replace('asset:', '');
    referencedAssets.add(assetName);
  }
  
  // Verify all referenced assets exist
  const availableAssets = new Set(data.assets.map(asset => asset.name));
  for (const referencedAsset of referencedAssets) {
    if (!availableAssets.has(referencedAsset)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Referenziertes Asset nicht gefunden: ${referencedAsset}`,
        path: ['assets']
      });
    }
  }

  // Platform-spezifische Content-Validierung
  const platforms = data.content.platforms;
  const category = data.content.category.toLowerCase();
  
  // WOHNEN: Content-Kategorien prüfen
  if (platforms.includes('WOHNEN')) {
    const wohnenCategories = ['ratgeber', 'markt', 'recht', 'diy', 'verkauf', 'kauf'];
    if (!wohnenCategories.some(cat => category.includes(cat))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Kategorie "${data.content.category}" passt nicht zu WOHNEN Platform`,
        path: ['content', 'category']
      });
    }
  }
  
  // MAKLER: Premium/Investment Content
  if (platforms.includes('MAKLER')) {
    const maklerCategories = ['premium', 'investment', 'referenz', 'luxury', 'off-market'];
    if (!maklerCategories.some(cat => category.includes(cat))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Kategorie "${data.content.category}" passt nicht zu MAKLER Platform`,
        path: ['content', 'category']
      });
    }
  }
  
  // ENERGIE: GEG/Förderung/Technik
  if (platforms.includes('ENERGIE')) {
    const energieCategories = ['geg', 'förderung', 'technik', 'modernisierung', 'energieausweis', 'sanierung'];
    if (!energieCategories.some(cat => category.includes(cat))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Kategorie "${data.content.category}" passt nicht zu ENERGIE Platform`,
        path: ['content', 'category']
      });
    }
  }
});

// ============================================================================
// TYPE EXPORTS (für TypeScript Usage)
// ============================================================================

export type ImportData = z.infer<typeof ImportSchema>;
export type ContentData = z.infer<typeof ContentSchema>;
export type HtmlBlock = z.infer<typeof HtmlBlockSchema>;
export type AssetData = z.infer<typeof AssetSchema>;
export type Platform = z.infer<typeof PlatformSchema>;
export type ContentFormat = z.infer<typeof ContentFormatSchema>;

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateImport(data: unknown): { 
  success: true; 
  data: ImportData; 
} | { 
  success: false; 
  error: z.ZodError; 
} {
  try {
    const parsed = ImportSchema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error; // Re-throw non-Zod errors
  }
}

export function getValidationErrors(error: z.ZodError): Array<{
  path: string;
  message: string;
  code: string;
}> {
  return error.errors.map(err => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code
  }));
}

// ============================================================================
// IMPORT SIZE LIMITS (für Performance & Security)
// ============================================================================

export const IMPORT_LIMITS = {
  MAX_JSON_SIZE: 2 * 1024 * 1024,        // 2MB JSON
  MAX_ASSET_SIZE: 10 * 1024 * 1024,      // 10MB per Asset
  MAX_TOTAL_ASSETS_SIZE: 50 * 1024 * 1024, // 50MB total Assets
  MAX_HTML_BLOCK_SIZE: 50 * 1024,        // 50KB per HTML Block
  MAX_CSS_SIZE: 10 * 1024,               // 10KB per CSS
  MAX_JS_SIZE: 5 * 1024,                 // 5KB per JavaScript
  MAX_CONTENT_SIZE: 100 * 1024,          // 100KB Content Body
  
  // Array Limits
  MAX_HTML_BLOCKS: 10,
  MAX_IMAGES: 20,
  MAX_ASSETS: 50,
  MAX_TAGS: 15,
  MAX_KEYWORDS: 10
} as const;

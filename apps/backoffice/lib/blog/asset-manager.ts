/**
 * LYD Blog System v1.1 - Asset Manager
 * 
 * Handles upload and management of blog assets (images, CSS, JS, etc.)
 * Supports both Base64 inline assets and URL references
 */

import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { createHash } from 'crypto';
import path from 'path';
import { AssetData } from './import-schema';

// ============================================================================
// CONFIGURATION
// ============================================================================

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const S3_BUCKET = process.env.AWS_S3_BUCKET || 'lyd-blog-assets';
const CDN_BASE_URL = process.env.CDN_BASE_URL || `https://${S3_BUCKET}.s3.eu-central-1.amazonaws.com`;

// ============================================================================
// ASSET PROCESSING TYPES
// ============================================================================

interface AssetUploadResult {
  success: true;
  assetUrls: Record<string, string>; // asset name -> final URL
  uploadedCount: number;
  warnings?: string[];
} | {
  success: false;
  errors: string[];
}

interface ProcessedAsset {
  name: string;
  url: string;
  size: number;
  mime: string;
  hash: string;
}

// ============================================================================
// MIME TYPE VALIDATION
// ============================================================================

const ALLOWED_MIME_TYPES = {
  // Images
  'image/webp': ['.webp'],
  'image/jpeg': ['.jpg', '.jpeg'],  
  'image/png': ['.png'],
  'image/svg+xml': ['.svg'],
  
  // Stylesheets
  'text/css': ['.css'],
  
  // Scripts (very limited)
  'text/javascript': ['.js'],
  'application/javascript': ['.js'],
} as const;

const MAX_ASSET_SIZE = 10 * 1024 * 1024; // 10MB per asset
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total

// ============================================================================
// ASSET VALIDATION
// ============================================================================

function validateAsset(asset: AssetData): { valid: true } | { valid: false; error: string } {
  // MIME type validation
  if (!Object.keys(ALLOWED_MIME_TYPES).includes(asset.mime)) {
    return { valid: false, error: `Unsupported MIME type: ${asset.mime}` };
  }
  
  // File extension validation
  const allowedExtensions = ALLOWED_MIME_TYPES[asset.mime as keyof typeof ALLOWED_MIME_TYPES];
  const fileExtension = path.extname(asset.name).toLowerCase();
  
  if (!allowedExtensions.includes(fileExtension as any)) {
    return { valid: false, error: `File extension ${fileExtension} doesn't match MIME type ${asset.mime}` };
  }
  
  // Size validation for Base64
  if (asset.encoding === 'base64') {
    const estimatedSize = (asset.data.length * 3) / 4; // Base64 is ~33% larger
    if (estimatedSize > MAX_ASSET_SIZE) {
      return { valid: false, error: `Asset too large: ${Math.round(estimatedSize / 1024 / 1024)}MB > ${MAX_ASSET_SIZE / 1024 / 1024}MB` };
    }
  }
  
  // Filename validation
  if (!/^[a-z0-9._-]+$/i.test(asset.name)) {
    return { valid: false, error: 'Invalid filename. Only alphanumeric characters, dots, dashes, and underscores allowed.' };
  }
  
  return { valid: true };
}

// ============================================================================
// ASSET PROCESSING
// ============================================================================

/**
 * Process Base64 asset data
 */
function processBase64Asset(asset: AssetData): Buffer | null {
  try {
    if (asset.encoding !== 'base64') {
      throw new Error('Asset is not Base64 encoded');
    }
    
    // Remove data URL prefix if present
    const base64Data = asset.data.replace(/^data:[^;]+;base64,/, '');
    
    // Validate Base64 format
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
      throw new Error('Invalid Base64 format');
    }
    
    return Buffer.from(base64Data, 'base64');
    
  } catch (error) {
    console.error(`Base64 processing error for ${asset.name}:`, error);
    return null;
  }
}

/**
 * Generate asset hash for deduplication
 */
function generateAssetHash(buffer: Buffer): string {
  return createHash('sha256').update(buffer).digest('hex').substring(0, 16);
}

/**
 * Generate S3 key for asset
 */
function generateS3Key(slug: string, assetName: string, hash: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  // Pattern: /blog/2025/09/my-article-slug/filename-hash16.ext
  const extension = path.extname(assetName);
  const basename = path.basename(assetName, extension);
  
  return `blog/${year}/${month}/${slug}/${basename}-${hash}${extension}`;
}

// ============================================================================
// S3 UPLOAD FUNCTIONS
// ============================================================================

/**
 * Check if asset already exists in S3
 */
async function checkAssetExists(s3Key: string): Promise<boolean> {
  try {
    await s3Client.send(new HeadObjectCommand({
      Bucket: S3_BUCKET,
      Key: s3Key
    }));
    return true;
  } catch (error: any) {
    if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
      return false;
    }
    throw error;
  }
}

/**
 * Upload asset to S3
 */
async function uploadToS3(
  buffer: Buffer, 
  s3Key: string, 
  mime: string,
  metadata: Record<string, string> = {}
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: S3_BUCKET,
    Key: s3Key,
    Body: buffer,
    ContentType: mime,
    Metadata: {
      'uploaded-by': 'lyd-blog-system',
      'upload-date': new Date().toISOString(),
      ...metadata
    },
    // Public read access for blog assets
    ACL: 'public-read',
    // Cache for 1 year
    CacheControl: 'public, max-age=31536000, immutable'
  });
  
  const result = await s3Client.send(command);
  
  if (result.$metadata.httpStatusCode !== 200) {
    throw new Error(`S3 upload failed: ${result.$metadata.httpStatusCode}`);
  }
  
  return `${CDN_BASE_URL}/${s3Key}`;
}

// ============================================================================
// MAIN ASSET UPLOAD FUNCTION
// ============================================================================

/**
 * Upload assets from import data
 */
export async function uploadAssets(
  assets: AssetData[], 
  slug: string
): Promise<AssetUploadResult> {
  try {
    if (!assets || assets.length === 0) {
      return { 
        success: true, 
        assetUrls: {}, 
        uploadedCount: 0 
      };
    }
    
    const warnings: string[] = [];
    const assetUrls: Record<string, string> = {};
    let totalSize = 0;
    const processedAssets: ProcessedAsset[] = [];
    
    // 1. VALIDATION PHASE
    for (const asset of assets) {
      const validation = validateAsset(asset);
      if (!validation.valid) {
        return {
          success: false,
          errors: [`Asset validation failed for ${asset.name}: ${validation.error}`]
        };
      }
    }
    
    // 2. PROCESSING PHASE
    for (const asset of assets) {
      try {
        let buffer: Buffer;
        
        if (asset.encoding === 'base64') {
          const processed = processBase64Asset(asset);
          if (!processed) {
            return {
              success: false,
              errors: [`Failed to process Base64 data for ${asset.name}`]
            };
          }
          buffer = processed;
          
        } else if (asset.encoding === 'url') {
          // For URL assets, we would fetch them here
          // For now, we'll just pass through the URL
          assetUrls[asset.name] = asset.data;
          continue;
          
        } else {
          return {
            success: false,
            errors: [`Unsupported asset encoding: ${asset.encoding} for ${asset.name}`]
          };
        }
        
        // Size check
        totalSize += buffer.length;
        if (totalSize > MAX_TOTAL_SIZE) {
          return {
            success: false,
            errors: [`Total asset size exceeds limit: ${Math.round(totalSize / 1024 / 1024)}MB > ${MAX_TOTAL_SIZE / 1024 / 1024}MB`]
          };
        }
        
        // Generate hash for deduplication
        const hash = generateAssetHash(buffer);
        const s3Key = generateS3Key(slug, asset.name, hash);
        
        // Check if asset already exists (deduplication)
        const exists = await checkAssetExists(s3Key);
        
        let finalUrl: string;
        
        if (exists) {
          // Asset already exists, use existing URL
          finalUrl = `${CDN_BASE_URL}/${s3Key}`;
          warnings.push(`Asset ${asset.name} already exists, using cached version`);
        } else {
          // Upload new asset
          finalUrl = await uploadToS3(buffer, s3Key, asset.mime, {
            'original-name': asset.name,
            'import-slug': slug,
            'content-hash': hash
          });
        }
        
        assetUrls[asset.name] = finalUrl;
        processedAssets.push({
          name: asset.name,
          url: finalUrl,
          size: buffer.length,
          mime: asset.mime,
          hash
        });
        
      } catch (error) {
        console.error(`Asset processing error for ${asset.name}:`, error);
        return {
          success: false,
          errors: [`Failed to process asset ${asset.name}: ${error instanceof Error ? error.message : 'Unknown error'}`]
        };
      }
    }
    
    return {
      success: true,
      assetUrls,
      uploadedCount: processedAssets.length,
      warnings: warnings.length > 0 ? warnings : undefined
    };
    
  } catch (error) {
    console.error('Asset upload error:', error);
    return {
      success: false,
      errors: [`Asset upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

// ============================================================================
// ASSET CLEANUP (for failed imports)
// ============================================================================

/**
 * Clean up uploaded assets if import fails
 */
export async function cleanupAssets(assetUrls: Record<string, string>): Promise<void> {
  // Implementation would delete assets from S3
  // For now, we'll leave them as they might be referenced elsewhere
  console.log('Asset cleanup called for:', Object.keys(assetUrls));
}

// ============================================================================
// ASSET VALIDATION HELPERS
// ============================================================================

/**
 * Validate image dimensions and quality
 */
export function validateImageAsset(buffer: Buffer, mime: string): {
  valid: true;
  width: number;
  height: number;
} | {
  valid: false;
  error: string;
} {
  // This would use a library like sharp to validate image properties
  // For now, we'll do basic validation
  
  if (mime.startsWith('image/')) {
    // Basic image validation
    const maxDimension = 4000;
    const minDimension = 100;
    
    // Note: In a real implementation, we'd extract actual dimensions
    // For now, we'll assume validation passes
    return {
      valid: true,
      width: 1200,
      height: 800
    };
  }
  
  return { valid: false, error: 'Not an image' };
}

/**
 * Generate responsive image variants
 */
export async function generateImageVariants(
  buffer: Buffer,
  s3Key: string
): Promise<Record<string, string>> {
  // This would generate different sizes (400w, 800w, 1200w, etc.)
  // For now, return the original
  return {
    original: `${CDN_BASE_URL}/${s3Key}`
  };
}

// ============================================================================
// ASSET METADATA HELPERS
// ============================================================================

/**
 * Extract and validate asset metadata
 */
export function extractAssetMetadata(asset: AssetData): Record<string, any> {
  return {
    originalName: asset.name,
    mime: asset.mime,
    encoding: asset.encoding,
    size: asset.encoding === 'base64' ? Math.round((asset.data.length * 3) / 4) : 0,
    uploadedAt: new Date().toISOString()
  };
}

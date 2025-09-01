import sharp, { Sharp } from 'sharp';
import { fileTypeFromBuffer } from 'file-type';

/**
 * Unterstützte Bild-MIME-Types
 */
export const SUPPORTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif'
] as const;

/**
 * Unterstützte 360°-MIME-Types
 */
export const SUPPORTED_360_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png'
] as const;

/**
 * Unterstützte Grundriss-MIME-Types
 */
export const SUPPORTED_FLOORPLAN_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/svg+xml',
  'application/pdf'
] as const;

/**
 * Standard-Bildgrößen für responsive Anzeige
 */
export const IMAGE_VARIANTS = {
  thumbnail: { width: 300, height: 200, quality: 85 },
  medium: { width: 800, height: 600, quality: 90 },
  large: { width: 1920, height: 1440, quality: 95 },
  xlarge: { width: 3840, height: 2880, quality: 98 }
} as const;

/**
 * Bildmetadaten-Interface
 */
export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  density?: number;
  hasAlpha: boolean;
  orientation?: number;
  colorSpace?: string;
  exif?: {
    [key: string]: any;
  };
}

/**
 * Verarbeitetes Bild mit Varianten
 */
export interface ProcessedImage {
  original: {
    buffer: Buffer;
    metadata: ImageMetadata;
  };
  variants: {
    [K in keyof typeof IMAGE_VARIANTS]: {
      buffer: Buffer;
      metadata: ImageMetadata;
    };
  };
}

/**
 * File Upload Validierung
 */
export async function validateUploadedFile(
  buffer: Buffer,
  originalName: string,
  maxSizeBytes: number = 50 * 1024 * 1024, // 50MB
  allowedTypes: readonly string[] = SUPPORTED_IMAGE_TYPES
): Promise<{
  isValid: boolean;
  error?: string;
  mimeType?: string;
  fileSize: number;
}> {
  const fileSize = buffer.length;
  
  // Größe prüfen
  if (fileSize > maxSizeBytes) {
    return {
      isValid: false,
      error: `Datei zu groß. Maximum: ${Math.round(maxSizeBytes / 1024 / 1024)}MB`,
      fileSize
    };
  }
  
  // MIME-Type aus Buffer ermitteln (sicherer als originalName)
  const fileTypeResult = await fileTypeFromBuffer(buffer);
  const detectedMimeType = fileTypeResult?.mime;
  
  if (!detectedMimeType) {
    return {
      isValid: false,
      error: 'Unbekannter Dateityp oder beschädigte Datei',
      fileSize
    };
  }
  
  // Erlaubte Typen prüfen
  if (!allowedTypes.includes(detectedMimeType)) {
    const allowedExtensions = allowedTypes
      .map(type => type.split('/')[1])
      .join(', ');
    return {
      isValid: false,
      error: `Dateityp nicht unterstützt. Erlaubt: ${allowedExtensions}`,
      fileSize,
      mimeType: detectedMimeType
    };
  }
  
  return {
    isValid: true,
    fileSize,
    mimeType: detectedMimeType
  };
}

/**
 * Bildmetadaten extrahieren
 */
export async function extractImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: buffer.length,
    density: metadata.density,
    hasAlpha: metadata.hasAlpha || false,
    orientation: metadata.orientation,
    colorSpace: metadata.space,
    exif: metadata.exif
  };
}

/**
 * 360°-Bild validieren (Seitenverhältnis 2:1)
 */
export function is360Image(metadata: ImageMetadata): boolean {
  if (!metadata.width || !metadata.height) return false;
  
  const aspectRatio = metadata.width / metadata.height;
  
  // 360°-Bilder haben typischerweise 2:1 Seitenverhältnis
  // Toleranz: ±0.1
  return Math.abs(aspectRatio - 2.0) <= 0.1;
}

/**
 * Bild in verschiedene Größen konvertieren
 */
export async function processImageVariants(
  buffer: Buffer,
  options: {
    formats?: ('webp' | 'jpeg')[];
    stripMetadata?: boolean;
    preserveOrientation?: boolean;
  } = {}
): Promise<ProcessedImage> {
  const {
    formats = ['webp', 'jpeg'],
    stripMetadata = true,
    preserveOrientation = true
  } = options;
  
  // Original-Metadaten
  const originalMetadata = await extractImageMetadata(buffer);
  
  // Base Sharp Instance
  let baseImage = sharp(buffer);
  
  if (stripMetadata) {
    baseImage = baseImage.withMetadata({
      orientation: preserveOrientation ? originalMetadata.orientation : undefined
    });
  }
  
  // Auto-Rotation basierend auf EXIF
  if (preserveOrientation && originalMetadata.orientation) {
    baseImage = baseImage.rotate();
  }
  
  // Varianten generieren
  const variants = {} as ProcessedImage['variants'];
  
  for (const [variantName, config] of Object.entries(IMAGE_VARIANTS)) {
    const { width, height, quality } = config;
    
    // Resize mit Smart Crop (entropy-basiert)
    const processedBuffer = await baseImage
      .clone()
      .resize(width, height, {
        fit: 'cover',
        position: 'entropy'
      })
      .jpeg({ quality, progressive: true })
      .toBuffer();
    
    const processedMetadata = await extractImageMetadata(processedBuffer);
    
    variants[variantName as keyof typeof IMAGE_VARIANTS] = {
      buffer: processedBuffer,
      metadata: processedMetadata
    };
  }
  
  return {
    original: {
      buffer,
      metadata: originalMetadata
    },
    variants
  };
}

/**
 * Wasserzeichen hinzufügen (für Copyright-Schutz)
 */
export async function addWatermark(
  imageBuffer: Buffer,
  watermarkText: string = 'Live Your Dreams',
  options: {
    position?: 'bottom-right' | 'bottom-left' | 'center';
    opacity?: number;
    fontSize?: number;
  } = {}
): Promise<Buffer> {
  const {
    position = 'bottom-right',
    opacity = 0.7,
    fontSize = 24
  } = options;
  
  const image = sharp(imageBuffer);
  const { width, height } = await image.metadata();
  
  if (!width || !height) {
    throw new Error('Ungültige Bildabmessungen');
  }
  
  // SVG-Wasserzeichen erstellen
  const textColor = `rgba(255, 255, 255, ${opacity})`;
  const shadowColor = `rgba(0, 0, 0, 0.5)`;
  
  let x: number, y: number;
  switch (position) {
    case 'bottom-right':
      x = width - 20;
      y = height - 20;
      break;
    case 'bottom-left':
      x = 20;
      y = height - 20;
      break;
    case 'center':
      x = width / 2;
      y = height / 2;
      break;
  }
  
  const watermarkSvg = `
    <svg width="${width}" height="${height}">
      <defs>
        <filter id="shadow">
          <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="${shadowColor}"/>
        </filter>
      </defs>
      <text
        x="${x}"
        y="${y}"
        font-family="Arial, sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="${textColor}"
        text-anchor="${position === 'bottom-left' ? 'start' : position === 'center' ? 'middle' : 'end'}"
        filter="url(#shadow)"
      >
        ${watermarkText}
      </text>
    </svg>
  `;
  
  return await image
    .composite([{
      input: Buffer.from(watermarkSvg),
      blend: 'over'
    }])
    .toBuffer();
}

/**
 * Thumbnail mit Smart Crop generieren
 */
export async function generateSmartThumbnail(
  buffer: Buffer,
  width: number = 300,
  height: number = 200,
  quality: number = 85
): Promise<Buffer> {
  return await sharp(buffer)
    .resize(width, height, {
      fit: 'cover',
      position: 'entropy' // Smart Crop basierend auf Bildinhalt
    })
    .jpeg({ quality, progressive: true })
    .toBuffer();
}

/**
 * Bildoptimierung für Web
 */
export async function optimizeForWeb(
  buffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'avif';
  } = {}
): Promise<Buffer> {
  const {
    maxWidth = 1920,
    maxHeight = 1440,
    quality = 90,
    format = 'webp'
  } = options;
  
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  // Resize nur wenn nötig
  let resizedImage = image;
  if (metadata.width && metadata.width > maxWidth || 
      metadata.height && metadata.height > maxHeight) {
    resizedImage = image.resize(maxWidth, maxHeight, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }
  
  // Format-spezifische Optimierung
  switch (format) {
    case 'webp':
      return await resizedImage.webp({ quality }).toBuffer();
    case 'avif':
      return await resizedImage.avif({ quality }).toBuffer();
    case 'jpeg':
    default:
      return await resizedImage.jpeg({ 
        quality, 
        progressive: true,
        mozjpeg: true 
      }).toBuffer();
  }
}

/**
 * EXIF-Daten bereinigen (Datenschutz)
 */
export async function stripPersonalMetadata(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .withMetadata({
      // Entferne GPS und andere private Daten, behalte nur Basis-Metadaten
      exif: {},
    })
    .toBuffer();
}

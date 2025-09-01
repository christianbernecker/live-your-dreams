'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  LdsCard,
  LdsCardContent,
  LdsButton,
  LdsBadge
} from '@liveyourdreams/design-system-react';

import { 
  SUPPORTED_IMAGE_TYPES,
  SUPPORTED_360_TYPES,
  SUPPORTED_FLOORPLAN_TYPES,
  validateUploadedFile,
  is360Image,
  extractImageMetadata
} from '@/lib/media/image-processing';

/**
 * Media Types für Upload
 */
export type MediaType = 'image' | '360' | 'floorplan' | 'document';

/**
 * Upload-Status
 */
export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

/**
 * Media File Interface
 */
export interface MediaFile {
  id: string;
  file: File;
  type: MediaType;
  preview?: string;
  status: UploadStatus;
  progress: number;
  error?: string;
  metadata?: {
    width?: number;
    height?: number;
    size: number;
    duration?: number; // Für Videos
  };
}

/**
 * MediaUploader Props
 */
interface MediaUploaderProps {
  /**
   * Erlaubte Media-Typen
   */
  acceptedTypes?: MediaType[];
  
  /**
   * Maximum Anzahl Files
   */
  maxFiles?: number;
  
  /**
   * Maximum Dateigröße in Bytes
   */
  maxFileSize?: number;
  
  /**
   * Existing media files
   */
  existingMedia?: MediaFile[];
  
  /**
   * Upload Callback
   */
  onUpload: (files: MediaFile[]) => Promise<void>;
  
  /**
   * File Remove Callback
   */
  onRemove?: (fileId: string) => void;
  
  /**
   * Upload Progress Callback
   */
  onProgress?: (fileId: string, progress: number) => void;
  
  /**
   * Property ID for upload context
   */
  propertyId?: string;
  
  /**
   * Room ID for room-specific media
   */
  roomId?: string;
  
  /**
   * Disabled state
   */
  disabled?: boolean;
}

/**
 * MediaUploader Component
 * 
 * Drag&Drop File Upload mit:
 * - Multi-File Support
 * - Auto-Detection von 360° Bildern
 * - Preview Generation
 * - Progress Tracking
 * - Error Handling
 */
export function MediaUploader({
  acceptedTypes = ['image', '360', 'floorplan'],
  maxFiles = 50,
  maxFileSize = 50 * 1024 * 1024, // 50MB
  existingMedia = [],
  onUpload,
  onRemove,
  onProgress,
  propertyId,
  roomId,
  disabled = false
}: MediaUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<MediaFile[]>(existingMedia);
  const [isUploading, setIsUploading] = useState(false);

  // Erlaubte MIME-Types basierend auf acceptedTypes
  const getAllowedMimeTypes = () => {
    let allowedTypes: string[] = [];
    
    if (acceptedTypes.includes('image')) {
      allowedTypes = [...allowedTypes, ...SUPPORTED_IMAGE_TYPES];
    }
    
    if (acceptedTypes.includes('360')) {
      allowedTypes = [...allowedTypes, ...SUPPORTED_360_TYPES];
    }
    
    if (acceptedTypes.includes('floorplan')) {
      allowedTypes = [...allowedTypes, ...SUPPORTED_FLOORPLAN_TYPES];
    }
    
    if (acceptedTypes.includes('document')) {
      allowedTypes = [...allowedTypes, 'application/pdf'];
    }
    
    return [...new Set(allowedTypes)]; // Remove duplicates
  };

  /**
   * Automatische Media-Type Detection
   */
  const detectMediaType = async (file: File): Promise<MediaType> => {
    // PDF = Document
    if (file.type === 'application/pdf') {
      return 'document';
    }
    
    // Für Bilder: 360° Detection
    if (SUPPORTED_IMAGE_TYPES.includes(file.type as any)) {
      try {
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const metadata = await extractImageMetadata(Buffer.from(uint8Array));
        
        // 360° Detection basierend auf Seitenverhältnis
        if (is360Image(metadata)) {
          return '360';
        }
        
        // Grundriss Detection (sehr große Bilder mit wenig Farben)
        const aspectRatio = metadata.width / metadata.height;
        if (aspectRatio > 1.2 && aspectRatio < 2.0 && metadata.width > 2000) {
          return 'floorplan';
        }
        
        return 'image';
      } catch (error) {
        console.error('Error detecting media type:', error);
        return 'image'; // Fallback
      }
    }
    
    return 'image'; // Default fallback
  };

  /**
   * File Processing nach Drop/Select
   */
  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || isUploading) return;
    
    // Check limits
    const totalFiles = uploadedFiles.length + acceptedFiles.length;
    if (totalFiles > maxFiles) {
      alert(`Maximum ${maxFiles} Dateien erlaubt. ${uploadedFiles.length} bereits hochgeladen.`);
      return;
    }
    
    setIsUploading(true);
    
    const newMediaFiles: MediaFile[] = [];
    
    for (const file of acceptedFiles) {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      try {
        // File Validation
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        const validation = await validateUploadedFile(
          Buffer.from(uint8Array), 
          file.name, 
          maxFileSize,
          getAllowedMimeTypes()
        );
        
        if (!validation.isValid) {
          newMediaFiles.push({
            id: fileId,
            file,
            type: 'image',
            status: 'error',
            progress: 0,
            error: validation.error
          });
          continue;
        }
        
        // Media Type Detection
        const detectedType = await detectMediaType(file);
        
        // Preview Generation (nur für Bilder)
        let preview: string | undefined;
        if (file.type.startsWith('image/')) {
          preview = URL.createObjectURL(file);
        }
        
        // Metadata Extraction
        let metadata: MediaFile['metadata'] = {
          size: file.size
        };
        
        if (file.type.startsWith('image/')) {
          const imageMetadata = await extractImageMetadata(Buffer.from(uint8Array));
          metadata.width = imageMetadata.width;
          metadata.height = imageMetadata.height;
        }
        
        newMediaFiles.push({
          id: fileId,
          file,
          type: detectedType,
          preview,
          status: 'idle',
          progress: 0,
          metadata
        });
        
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        newMediaFiles.push({
          id: fileId,
          file,
          type: 'image',
          status: 'error',
          progress: 0,
          error: 'Fehler beim Verarbeiten der Datei'
        });
      }
    }
    
    // Add to uploaded files
    setUploadedFiles(prev => [...prev, ...newMediaFiles]);
    
    // Start upload process
    try {
      await onUpload(newMediaFiles);
    } catch (error) {
      console.error('Upload failed:', error);
      // Update failed files
      setUploadedFiles(prev => 
        prev.map(file => 
          newMediaFiles.some(newFile => newFile.id === file.id)
            ? { ...file, status: 'error' as UploadStatus, error: 'Upload fehlgeschlagen' }
            : file
        )
      );
    }
    
    setIsUploading(false);
  }, [uploadedFiles, maxFiles, maxFileSize, onUpload, disabled, isUploading]);

  /**
   * Dropzone Setup
   */
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject
  } = useDropzone({
    onDrop: processFiles,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heic'],
      'application/pdf': ['.pdf']
    },
    disabled: disabled || isUploading,
    maxFiles,
    maxSize: maxFileSize,
    multiple: true
  });

  /**
   * File entfernen
   */
  const handleRemoveFile = (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    onRemove?.(fileId);
  };

  /**
   * Media Type Badge
   */
  const getMediaTypeBadge = (type: MediaType) => {
    const config = {
      image: { variant: 'default' as const, label: '📸 Bild' },
      '360': { variant: 'info' as const, label: '🔄 360°' },
      floorplan: { variant: 'secondary' as const, label: '📐 Grundriss' },
      document: { variant: 'warning' as const, label: '📄 Dokument' }
    };
    
    const { variant, label } = config[type] || config.image;
    
    return <LdsBadge variant={variant}>{label}</LdsBadge>;
  };

  /**
   * Status Badge
   */
  const getStatusBadge = (status: UploadStatus, error?: string) => {
    switch (status) {
      case 'uploading':
        return <LdsBadge variant="warning">📤 Uploading...</LdsBadge>;
      case 'processing':
        return <LdsBadge variant="info">⚙️ Processing...</LdsBadge>;
      case 'success':
        return <LdsBadge variant="success">✅ Fertig</LdsBadge>;
      case 'error':
        return <LdsBadge variant="destructive" title={error}>❌ Fehler</LdsBadge>;
      default:
        return <LdsBadge variant="default">⏳ Wartend</LdsBadge>;
    }
  };

  /**
   * Format file size
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      uploadedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Dropzone */}
      <LdsCard>
        <LdsCardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${isDragReject ? 'border-red-500 bg-red-50' : ''}
              ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="space-y-4">
              <div className="text-6xl">
                {isDragActive ? '⬇️' : isDragReject ? '❌' : '📁'}
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive 
                    ? 'Dateien hier ablegen...' 
                    : 'Dateien hochladen'
                  }
                </h3>
                
                <p className="text-gray-600 mb-4">
                  Drag & Drop oder klicken zum Auswählen
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {acceptedTypes.map(type => getMediaTypeBadge(type))}
                </div>
                
                <p className="text-sm text-gray-500">
                  Max. {maxFiles} Dateien, je {formatFileSize(maxFileSize)}
                </p>
              </div>
              
              {!isDragActive && (
                <LdsButton variant="outline" disabled={disabled || isUploading}>
                  {isUploading ? 'Uploading...' : 'Dateien auswählen'}
                </LdsButton>
              )}
            </div>
          </div>
        </LdsCardContent>
      </LdsCard>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <LdsCard>
          <LdsCardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                  Dateien ({uploadedFiles.length}/{maxFiles})
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id} 
                    className="border rounded-lg p-4 space-y-3"
                  >
                    {/* Preview */}
                    {file.preview && (
                      <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                        <img
                          src={file.preview}
                          alt={file.file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        {getMediaTypeBadge(file.type)}
                        {getStatusBadge(file.status, file.error)}
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.file.name}
                      </p>
                      
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{formatFileSize(file.file.size)}</span>
                        {file.metadata?.width && file.metadata?.height && (
                          <span>{file.metadata.width}×{file.metadata.height}</span>
                        )}
                      </div>
                      
                      {/* Progress Bar */}
                      {file.status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                      )}
                      
                      {/* Error Message */}
                      {file.error && (
                        <p className="text-xs text-red-600">{file.error}</p>
                      )}
                      
                      {/* Actions */}
                      <div className="flex justify-end">
                        <LdsButton
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id)}
                          disabled={file.status === 'uploading'}
                        >
                          Entfernen
                        </LdsButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </LdsCardContent>
        </LdsCard>
      )}
    </div>
  );
}

import React from 'react';
import { LdsCard, LdsCardHeader, LdsCardTitle, LdsCardContent, LdsButton } from '@liveyourdreams/design-system-react';

interface Document {
  id: string;
  name: string;
  url: string;
  size?: number;
  type: 'pdf' | 'image';
}

interface DocumentDownloadProps {
  documents: Document[];
}

export function DocumentDownload({ documents }: DocumentDownloadProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    return type === 'pdf' ? '📄' : '🖼️';
  };

  if (documents.length === 0) return null;

  return (
    <LdsCard>
      <LdsCardHeader>
        <LdsCardTitle>📋 Dokumente & Unterlagen</LdsCardTitle>
        <p className="text-sm text-gray-600 mt-2">
          Laden Sie weitere Informationen und Grundrisse herunter
        </p>
      </LdsCardHeader>
      <LdsCardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div key={doc.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getFileIcon(doc.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {doc.name}
                  </div>
                  {doc.size && (
                    <div className="text-sm text-gray-500">
                      {formatFileSize(doc.size)}
                    </div>
                  )}
                  <div className="mt-2">
                    <LdsButton
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(doc.url, '_blank')}
                    >
                      📥 Download
                    </LdsButton>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-gray-500 text-center">
          Alle Dokumente werden in einem neuen Fenster geöffnet
        </div>
      </LdsCardContent>
    </LdsCard>
  );
}

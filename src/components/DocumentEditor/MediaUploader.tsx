import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Film, Music, AlertCircle } from 'lucide-react';
import { useMediaUpload, MediaType } from '../../hooks/useMediaUpload';

interface MediaUploaderProps {
  documentId: string;
  onUploadComplete?: (urls: string[]) => void;
  onError?: (error: string) => void;
  acceptedTypes?: MediaType[];
  maxFiles?: number;
  maxSizePerFile?: number; // en bytes
}

const DEFAULT_MAX_FILES = 10;
const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function MediaUploader({
  documentId,
  onUploadComplete,
  onError,
  acceptedTypes = ['image', 'video', 'audio'],
  maxFiles = DEFAULT_MAX_FILES,
  maxSizePerFile = DEFAULT_MAX_SIZE
}: MediaUploaderProps) {
  const { uploading, progress, error: uploadError, uploadMedia, cancelUpload } = useMediaUpload();
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Réinitialiser l'erreur après 5 secondes
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const getAcceptedMimeTypes = () => {
    const mimeTypes: Record<string, string[]> = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
    };

    return acceptedTypes.reduce((acc, type) => {
      return { ...acc, ...Object.fromEntries([[type, mimeTypes[type]]]) };
    }, {});
  };

  const validateFiles = (files: File[]): boolean => {
    if (files.length > maxFiles) {
      setError(`Vous ne pouvez pas uploader plus de ${maxFiles} fichiers à la fois`);
      return false;
    }

    for (const file of files) {
      if (file.size > maxSizePerFile) {
        setError(`Le fichier ${file.name} dépasse la taille maximale de ${maxSizePerFile / 1024 / 1024}MB`);
        return false;
      }

      const fileType = file.type.split('/')[0] as MediaType;
      if (!acceptedTypes.includes(fileType)) {
        setError(`Le type de fichier ${fileType} n'est pas accepté`);
        return false;
      }
    }

    return true;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      setError(null);
      if (!validateFiles(acceptedFiles)) return;

      const type = acceptedFiles[0].type.split('/')[0] as MediaType;
      const urls = await uploadMedia(acceptedFiles, type, documentId);
      onUploadComplete?.(urls);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      setError(message);
      onError?.(message);
    }
  }, [documentId, uploadMedia, onUploadComplete, onError, maxFiles, maxSizePerFile, acceptedTypes]);

  const { getRootProps, getInputProps, isDragActive: isDragActiveProp, isDragReject } = useDropzone({
    onDrop,
    accept: getAcceptedMimeTypes(),
    multiple: true,
    maxFiles,
    maxSize: maxSizePerFile,
    onDropRejected: (rejections) => {
      const errors = rejections.map(rejection => 
        `${rejection.file.name}: ${rejection.errors[0].message}`
      );
      setError(errors.join(', '));
    }
  });

  const getTypeIcon = (type: MediaType) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-6 h-6" />;
      case 'video':
        return <Film className="w-6 h-6" />;
      case 'audio':
        return <Music className="w-6 h-6" />;
      default:
        return <Upload className="w-6 h-6" />;
    }
  };

  const getBorderColor = () => {
    if (isDragReject || error) return 'border-red-400';
    if (isDragActiveProp) return 'border-blue-400';
    return 'border-gray-300 hover:border-gray-400';
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          relative p-6 border-2 border-dashed rounded-lg
          transition-colors duration-200 cursor-pointer
          ${getBorderColor()}
          ${isDragActiveProp ? 'bg-blue-50' : ''}
          ${isDragReject || error ? 'bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-2 text-gray-500">
          <Upload className={`w-8 h-8 ${isDragReject || error ? 'text-red-500' : ''}`} />
          <div className="text-sm text-center">
            <p className="font-medium">
              {isDragActiveProp ? 'Déposez les fichiers ici' : 'Glissez-déposez vos fichiers ici'}
            </p>
            <p>
              ou <span className="text-blue-500">parcourez</span> vos fichiers
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4">
            {acceptedTypes.map(type => (
              <div
                key={type}
                className="flex items-center space-x-1 text-xs"
                title={`Max ${maxSizePerFile / 1024 / 1024}MB par fichier`}
              >
                {getTypeIcon(type)}
                <span className="capitalize">{type}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Maximum {maxFiles} fichiers, {maxSizePerFile / 1024 / 1024}MB par fichier
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      {uploading && progress.length > 0 && (
        <div className="space-y-2">
          {progress.map(p => (
            <div key={p.fileName} className="relative">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="truncate max-w-[80%]" title={p.fileName}>
                  {p.fileName}
                </span>
                <span>{Math.round(p.progress)}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-200"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              {uploading && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    cancelUpload();
                  }}
                  className="absolute -right-2 -top-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                  title="Annuler l'upload"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Message d'erreur */}
      {(error || uploadError) && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error || uploadError}</span>
        </div>
      )}
    </div>
  );
}

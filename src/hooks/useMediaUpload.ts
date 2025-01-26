import { useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type MediaType = 'image' | 'video' | 'audio';

interface UploadProgress {
  fileName: string;
  progress: number;
}

interface UseMediaUploadReturn {
  uploading: boolean;
  progress: UploadProgress[];
  error: string | null;
  uploadMedia: (files: File[], type: MediaType, documentId: string) => Promise<string[]>;
  cancelUpload: () => void;
}

export function useMediaUpload(): UseMediaUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const updateProgress = (fileName: string, progress: number) => {
    setProgress(prev => {
      const existing = prev.find(p => p.fileName === fileName);
      if (existing) {
        return prev.map(p => 
          p.fileName === fileName ? { ...p, progress } : p
        );
      }
      return [...prev, { fileName, progress }];
    });
  };

  const validateFile = (file: File, type: MediaType): boolean => {
    const maxSize = {
      image: 5 * 1024 * 1024, // 5MB
      video: 100 * 1024 * 1024, // 100MB
      audio: 20 * 1024 * 1024 // 20MB
    };

    const allowedTypes = {
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      video: ['video/mp4', 'video/webm'],
      audio: ['audio/mpeg', 'audio/wav', 'audio/ogg']
    };

    if (file.size > maxSize[type]) {
      throw new Error(`Le fichier ${file.name} dépasse la taille maximale autorisée`);
    }

    if (!allowedTypes[type].includes(file.type)) {
      throw new Error(`Le type de fichier ${file.type} n'est pas autorisé pour ${type}`);
    }

    return true;
  };

  const uploadMedia = useCallback(async (
    files: File[],
    type: MediaType,
    documentId: string
  ): Promise<string[]> => {
    try {
      setUploading(true);
      setError(null);
      setProgress([]);

      // Créer un nouveau AbortController pour cette session d'upload
      const controller = new AbortController();
      setAbortController(controller);

      // Valider tous les fichiers avant de commencer l'upload
      files.forEach(file => validateFile(file, type));

      const uploadPromises = files.map(async (file): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${documentId}/${type}/${uuidv4()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        // Créer un ReadableStream à partir du fichier
        const reader = file.stream().getReader();
        let uploadedBytes = 0;

        // Créer un TransformStream pour suivre la progression
        const transformStream = new TransformStream({
          transform(chunk, controller) {
            uploadedBytes += chunk.length;
            const progress = (uploadedBytes / file.size) * 100;
            updateProgress(file.name, progress);
            controller.enqueue(chunk);
          }
        });

        // Upload vers Supabase
        const { data, error } = await supabase.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
            duplex: 'half'
          });

        if (error) throw error;

        // Obtenir l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('media')
          .getPublicUrl(filePath);

        // Optimisation des images si nécessaire
        if (type === 'image') {
          const { data: { publicUrl: optimizedUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(filePath, {
              transform: {
                width: 800,
                height: 800,
                resize: 'contain'
              }
            });
          return optimizedUrl;
        }

        return publicUrl;
      });

      const urls = await Promise.all(uploadPromises);
      return urls;

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'upload';
      setError(message);
      throw err;

    } finally {
      setUploading(false);
      setAbortController(null);
      setProgress([]);
    }
  }, []);

  const cancelUpload = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setUploading(false);
      setProgress([]);
      setError('Upload annulé');
    }
  }, [abortController]);

  return {
    uploading,
    progress,
    error,
    uploadMedia,
    cancelUpload
  };
}
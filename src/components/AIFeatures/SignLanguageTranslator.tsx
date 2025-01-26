import React, { useState, useEffect } from 'react';
import { Play, Pause, RefreshCw, AlertCircle, Check } from 'lucide-react';

interface SignLanguageTranslatorProps {
  text: string;
  onTranslationComplete?: (videoUrl: string) => void;
  onError?: (error: string) => void;
  avatarStyle?: string;
}

interface TranslationStatus {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  message?: string;
}

export function SignLanguageTranslator({
  text,
  onTranslationComplete,
  onError,
  avatarStyle = 'default'
}: SignLanguageTranslatorProps) {
  const [translation, setTranslation] = useState<TranslationStatus>({
    status: 'idle',
    progress: 0
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const simulateTranslation = async () => {
      try {
        setTranslation({ status: 'processing', progress: 0 });

        // Simuler le processus de traduction avec des étapes
        const steps = [
          { progress: 20, message: 'Analyse du texte...' },
          { progress: 40, message: 'Génération des mouvements...' },
          { progress: 60, message: 'Animation de l\'avatar...' },
          { progress: 80, message: 'Rendu de la vidéo...' },
          { progress: 100, message: 'Finalisation...' }
        ];

        for (const step of steps) {
          await new Promise(resolve => {
            timeoutId = setTimeout(resolve, 1000);
          });
          setTranslation({
            status: 'processing',
            progress: step.progress,
            message: step.message
          });
        }

        // Simuler l'URL de la vidéo générée
        const videoUrl = 'URL_VIDEO_GENEREE';
        setPreviewUrl(videoUrl);
        setTranslation({
          status: 'complete',
          progress: 100,
          message: 'Traduction terminée'
        });
        onTranslationComplete?.(videoUrl);
      } catch (error) {
        setTranslation({
          status: 'error',
          progress: 0,
          message: 'Erreur lors de la traduction'
        });
        onError?.(error as string);
      }
    };

    if (text && text.length > 0) {
      simulateTranslation();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [text, onTranslationComplete, onError]);

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-4">
      {/* Barre de progression */}
      {translation.status === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{translation.message}</span>
            <span className="font-medium">{translation.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${translation.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Aperçu de la vidéo */}
      {translation.status === 'complete' && previewUrl && (
        <div className="relative rounded-lg overflow-hidden bg-gray-100">
          <video
            src={previewUrl}
            className="w-full aspect-video object-cover"
            loop
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <button
              onClick={togglePlayback}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-900"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Message d'état */}
      {translation.status === 'error' && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle size={20} />
          <span>{translation.message}</span>
        </div>
      )}

      {translation.status === 'complete' && (
        <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
          <Check size={20} />
          <span>Traduction terminée avec succès</span>
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Page } from '../../types';
import { useVideoSync } from '../../hooks/useVideoSync'; // Import du hook

interface PageViewProps {
  page: Page;
  layout?: 'side-by-side' | 'stacked' | 'grid';
  showAnnotations?: boolean;
}

export function PageView({ page, layout = 'side-by-side', showAnnotations = true }: PageViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Utilisation du hook useVideoSync pour synchroniser les annotations avec la vidéo
  const { videoRef, activeAnnotations, jumpToAnnotation } = useVideoSync(
    page.media.signLanguageVideo,
    page.annotations
  );

  // Gestion de la lecture/pause de la vidéo
  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Gestion du volume (muet/non muet)
  const handleVolumeToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Rendu du contenu HTML
  const renderContent = (content: string) => (
    <div
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );

  // Rendu des médias (vidéo, images, audio)
  const renderMedia = () => (
    <div className="space-y-4">
      {page.media.signLanguageVideo && (
        <div className="relative">
          <video
            ref={videoRef} // Référence à la vidéo
            src={page.media.signLanguageVideo}
            className="w-full rounded-lg"
            controls={false}
            muted={isMuted}
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-black/50 rounded-full px-4 py-2">
            <button
              onClick={handleVideoToggle}
              className="text-white hover:text-blue-400"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={handleVolumeToggle}
              className="text-white hover:text-blue-400"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          </div>
        </div>
      )}

      {page.media.images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {page.media.images.map((url, index) => (
            <img
              key={url}
              src={url}
              alt={`Image ${index + 1}`}
              className="w-full h-auto rounded-lg"
            />
          ))}
        </div>
      )}

      {page.media.audio && (
        <audio
          src={page.media.audio}
          className="w-full"
          controls
        />
      )}
    </div>
  );

  // Rendu des annotations
  const renderAnnotations = () => (
    showAnnotations && page.annotations.length > 0 && (
      <div className="mt-4 space-y-2">
        {page.annotations.map((annotation) => (
          <div
            key={annotation.id}
            className={`p-2 rounded-lg border transition-colors ${
              activeAnnotations.includes(annotation.id) // Utilisation de activeAnnotations
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-gray-50 border-gray-200'
            }`}
            style={{
              position: 'absolute',
              left: `${annotation.position.x}%`,
              top: `${annotation.position.y}%`,
            }}
            onMouseEnter={() => setActiveAnnotation(annotation.id)}
            onMouseLeave={() => setActiveAnnotation(null)}
            onClick={() => jumpToAnnotation(annotation.id)} // Sauter à l'annotation
          >
            <div className="text-sm font-medium text-gray-700">
              {annotation.type === 'note' && '📝 Note'}
              {annotation.type === 'translation' && '🌐 Traduction'}
              {annotation.type === 'definition' && '📚 Définition'}
            </div>
            <div className="text-sm text-gray-600">{annotation.content}</div>
            {annotation.timestamp && (
              <div className="text-xs text-gray-400 mt-1">
                {new Date(annotation.timestamp * 1000).toLocaleTimeString()} // Convertir en millisecondes
              </div>
            )}
          </div>
        ))}
      </div>
    )
  );

  // Classes CSS pour les différents layouts
  const layoutClasses = {
    'side-by-side': 'grid grid-cols-2 gap-8',
    'stacked': 'space-y-8',
    'grid': 'grid grid-cols-2 gap-4',
  };

  return (
    <div className="relative">
      <div className={layoutClasses[layout]}>
        <div className="space-y-4">
          {renderContent(page.content.primary)}
          {layout === 'stacked' && renderMedia()}
        </div>
        <div className="space-y-4">
          {renderContent(page.content.secondary)}
          {layout !== 'stacked' && renderMedia()}
        </div>
      </div>
      {renderAnnotations()}
    </div>
  );
}
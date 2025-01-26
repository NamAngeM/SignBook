import { useState, useEffect, useRef } from 'react';
import { Annotation } from '../types';

export function useVideoSync(videoUrl: string, annotations: Annotation[]) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeAnnotations, setActiveAnnotations] = useState<string[]>([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const active = annotations
        .filter(ann => {
          const timestamp = ann.timestamp || 0;
          return currentTime >= timestamp && 
                 currentTime <= timestamp + 3; // 3 secondes de durée
        })
        .map(ann => ann.id);
      
      setActiveAnnotations(active);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [annotations]);

  const jumpToAnnotation = (annotationId: string) => {
    const annotation = annotations.find(ann => ann.id === annotationId);
    if (annotation?.timestamp && videoRef.current) {
      videoRef.current.currentTime = annotation.timestamp;
      videoRef.current.play();
    }
  };

  return {
    videoRef,
    activeAnnotations,
    jumpToAnnotation
  };
}
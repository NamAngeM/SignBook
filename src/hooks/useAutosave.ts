import { useEffect, useRef } from 'react';
import { Document } from '../types';

export function useAutosave(
  document: Document,
  saveFunction: (doc: Document) => Promise<void>,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveFunction(document);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [document, saveFunction, delay]);
}
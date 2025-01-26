import { useState, useEffect, useCallback } from 'react';
import { Document, Page } from '../types';
import { documentService } from '../services/documentService';

interface UseDocumentReturn {
  document: Document | null;
  loading: boolean;
  error: string | null;
  saveDocument: (doc: Partial<Document>) => Promise<void>;
  addPage: () => void;
  removePage: (pageIndex: number) => void;
  updatePage: (pageIndex: number, updatedPage: Partial<Page>) => void;
  movePage: (fromIndex: number, toIndex: number) => void;
  setDocumentStatus: (status: Document['metadata']['status']) => Promise<void>;
  addAnnotation: (pageIndex: number, annotation: Omit<Document['pages'][0]['annotations'][0], 'id'>) => void;
  removeAnnotation: (pageIndex: number, annotationId: string) => void;
}

const createEmptyPage = (pageNumber: number): Page => ({
  id: crypto.randomUUID(),
  pageNumber,
  content: {
    primary: '',
    secondary: ''
  },
  media: {
    images: [],
  },
  layout: 'side-by-side',
  annotations: []
});

export function useDocument(documentId?: string): UseDocumentReturn {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger le document
  useEffect(() => {
    const loadDocument = async () => {
      if (!documentId) {
        // Créer un nouveau document vide
        setDocument({
          id: '',
          title: 'Nouveau document',
          description: '',
          language: {
            primary: 'fr',
            secondary: 'lsf'
          },
          pages: [createEmptyPage(0)],
          metadata: {
            author: 'Utilisateur',
            createdAt: new Date(),
            updatedAt: new Date(),
            tags: [],
            status: 'draft'
          }
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const doc = await documentService.getDocument(documentId);
        setDocument(doc);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement du document');
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  // Sauvegarder le document
  const saveDocument = useCallback(async (updates: Partial<Document>) => {
    if (!document) return;

    try {
      const updatedDoc = {
        ...document,
        ...updates,
        metadata: {
          ...document.metadata,
          ...updates.metadata,
          updatedAt: new Date()
        }
      };

      if (document.id) {
        await documentService.updateDocument(document.id, updatedDoc);
      } else {
        const newId = await documentService.createDocument(updatedDoc);
        updatedDoc.id = newId;
      }

      setDocument(updatedDoc);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
      throw err;
    }
  }, [document]);

  // Ajouter une nouvelle page
  const addPage = useCallback(() => {
    if (!document) return;

    const newPage = createEmptyPage(document.pages.length);
    setDocument({
      ...document,
      pages: [...document.pages, newPage]
    });
  }, [document]);

  // Supprimer une page
  const removePage = useCallback((pageIndex: number) => {
    if (!document) return;

    const newPages = document.pages.filter((_, index) => index !== pageIndex)
      .map((page, index) => ({
        ...page,
        pageNumber: index
      }));

    setDocument({
      ...document,
      pages: newPages
    });
  }, [document]);

  // Mettre à jour une page
  const updatePage = useCallback((pageIndex: number, updatedPage: Partial<Page>) => {
    if (!document) return;

    const newPages = [...document.pages];
    newPages[pageIndex] = {
      ...newPages[pageIndex],
      ...updatedPage
    };

    setDocument({
      ...document,
      pages: newPages
    });
  }, [document]);

  // Déplacer une page
  const movePage = useCallback((fromIndex: number, toIndex: number) => {
    if (!document) return;

    const newPages = [...document.pages];
    const [movedPage] = newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, movedPage);

    // Mettre à jour les numéros de page
    newPages.forEach((page, index) => {
      page.pageNumber = index;
    });

    setDocument({
      ...document,
      pages: newPages
    });
  }, [document]);

  // Changer le statut du document
  const setDocumentStatus = useCallback(async (status: Document['metadata']['status']) => {
    if (!document) return;

    await saveDocument({
      metadata: {
        ...document.metadata,
        status
      }
    });
  }, [document, saveDocument]);

  // Ajouter une annotation
  const addAnnotation = useCallback((pageIndex: number, annotation: Omit<Document['pages'][0]['annotations'][0], 'id'>) => {
    if (!document) return;

    const newAnnotation = {
      ...annotation,
      id: crypto.randomUUID()
    };

    const newPages = [...document.pages];
    newPages[pageIndex] = {
      ...newPages[pageIndex],
      annotations: [...newPages[pageIndex].annotations, newAnnotation]
    };

    setDocument({
      ...document,
      pages: newPages
    });
  }, [document]);

  // Supprimer une annotation
  const removeAnnotation = useCallback((pageIndex: number, annotationId: string) => {
    if (!document) return;

    const newPages = [...document.pages];
    newPages[pageIndex] = {
      ...newPages[pageIndex],
      annotations: newPages[pageIndex].annotations.filter(a => a.id !== annotationId)
    };

    setDocument({
      ...document,
      pages: newPages
    });
  }, [document]);

  return {
    document,
    loading,
    error,
    saveDocument,
    addPage,
    removePage,
    updatePage,
    movePage,
    setDocumentStatus,
    addAnnotation,
    removeAnnotation
  };
}
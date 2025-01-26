import React, { useState, useEffect } from 'react';
import { Document, Page } from '../../types';
import Toolbar from './Toolbar';
import ContentEditor from './ContentEditor';
import MediaUploader from './MediaUploader';
import { useAutosave } from '../../hooks/useAutosave';
import { useDocument } from '../../hooks/useDocument';

interface DocumentEditorProps {
  documentId?: string;
  onSave: (document: Document) => void;
  onCancel: () => void;
}

export function DocumentEditor({ documentId, onSave, onCancel }: DocumentEditorProps) {
  const { document, loading, error, saveDocument } = useDocument(documentId);
  const [currentPage, setCurrentPage] = useState(0);
  
  // Autosave toutes les 30 secondes
  useAutosave(document, saveDocument, 30000);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="flex flex-col h-screen">
      <Toolbar 
        document={document}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onSave={onSave}
        onCancel={onCancel}
      />
      
      <div className="flex-1 flex">
        <div className="w-2/3 p-4">
          <ContentEditor
            page={document.pages[currentPage]}
            onUpdate={(updatedPage) => {
              const newPages = [...document.pages];
              newPages[currentPage] = updatedPage;
              saveDocument({ ...document, pages: newPages });
            }}
          />
        </div>
        
        <div className="w-1/3 border-l p-4">
          <MediaUploader
            page={document.pages[currentPage]}
            onMediaUpload={(mediaType, url) => {
              const newPages = [...document.pages];
              newPages[currentPage].media[mediaType] = url;
              saveDocument({ ...document, pages: newPages });
            }}
          />
        </div>
      </div>
    </div>
  );
}
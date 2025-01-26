import React, { useState } from 'react';
import { useDocument } from '../../hooks/useDocument';
import { PageView } from '../DocumentViewer/PageView';
import { Toolbar } from './Toolbar';
import { ContentEditor } from './ContentEditor';
import { MediaUploader } from './MediaUploader';
import { Plus, Trash2, Save, Settings2 } from 'lucide-react';

interface DocumentEditorProps {
  documentId?: string;
}

export function DocumentEditor({ documentId }: DocumentEditorProps) {
  const {
    document,
    loading,
    error,
    saveDocument,
    addPage,
    removePage,
    updatePage,
    addAnnotation,
    removeAnnotation,
    setDocumentStatus
  } = useDocument(documentId);

  const [currentPage, setCurrentPage] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          <h3 className="font-semibold">Erreur</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Document non trouvé</div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      await saveDocument(document);
      // Afficher une notification de succès
    } catch (err) {
      // Gérer l'erreur
    }
  };

  const handlePageChange = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < document.pages.length) {
      setCurrentPage(pageIndex);
    }
  };

  const handleAddPage = () => {
    addPage();
    setCurrentPage(document.pages.length);
  };

  const handleRemovePage = () => {
    if (document.pages.length > 1) {
      removePage(currentPage);
      setCurrentPage(Math.max(0, currentPage - 1));
    }
  };

  const handleContentChange = (content: { primary: string; secondary: string }) => {
    updatePage(currentPage, {
      content
    });
  };

  const handleMediaUpload = async (files: File[]) => {
    // Implémenter la logique d'upload
    const uploadedUrls = await Promise.all(
      files.map(async (file) => {
        // Uploader le fichier et obtenir l'URL
        return 'url_temporaire';
      })
    );

    updatePage(currentPage, {
      media: {
        ...document.pages[currentPage].media,
        images: [...document.pages[currentPage].media.images, ...uploadedUrls]
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre d'outils principale */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold">{document.title}</h1>
              <span className="px-2 py-1 text-sm rounded-full bg-gray-100">
                {document.metadata.status}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Enregistrer
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg"
              >
                <Settings2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Navigation des pages */}
          <div className="col-span-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-medium">Pages</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddPage}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded"
                    title="Ajouter une page"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRemovePage}
                    className="p-1 text-gray-500 hover:text-red-500 rounded"
                    title="Supprimer la page"
                    disabled={document.pages.length <= 1}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {document.pages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => handlePageChange(index)}
                    className={`w-full p-2 text-left rounded ${
                      currentPage === index
                        ? 'bg-blue-50 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    Page {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Éditeur de contenu */}
          <div className="col-span-10">
            <div className="bg-white rounded-lg shadow">
              <ContentEditor
                content={document.pages[currentPage].content}
                onChange={handleContentChange}
              />
              
              <div className="p-4 border-t">
                <MediaUploader onUpload={handleMediaUpload} />
              </div>
            </div>

            {/* Prévisualisation */}
            <div className="mt-8">
              <h3 className="font-medium mb-4">Prévisualisation</h3>
              <div className="bg-white rounded-lg shadow p-6">
                <PageView
                  page={document.pages[currentPage]}
                  showAnnotations={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
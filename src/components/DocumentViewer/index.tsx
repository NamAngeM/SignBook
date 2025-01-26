import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Layout,
  Eye,
  Download,
  Share2,
  Printer,
  Book,
} from 'lucide-react';
import { Document } from '../../types';
import { PageView } from './PageView';

interface DocumentViewerProps {
  document: Document;
  onClose?: () => void;
  onEdit?: () => void;
}

interface ViewerToolbarProps {
  currentPage: number;
  totalPages: number;
  layout: 'side-by-side' | 'stacked' | 'grid';
  showAnnotations: boolean;
  onPageChange: (page: number) => void;
  onLayoutChange: (layout: 'side-by-side' | 'stacked' | 'grid') => void;
  onAnnotationsToggle: () => void;
  onPrint: () => void;
  onDownload: () => void;
  onShare: () => void;
}

const ViewerToolbar: React.FC<ViewerToolbarProps> = ({
  currentPage,
  totalPages,
  layout,
  showAnnotations,
  onPageChange,
  onLayoutChange,
  onAnnotationsToggle,
  onPrint,
  onDownload,
  onShare,
}) => (
  <div className="flex items-center justify-between border-b bg-white px-4 py-2">
    <div className="flex items-center space-x-4">
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="px-3 font-medium">
          Page {currentPage + 1} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <select
          value={layout}
          onChange={(e) => onLayoutChange(e.target.value as any)}
          className="rounded-md border-gray-300 text-sm"
        >
          <option value="side-by-side">Côte à côte</option>
          <option value="stacked">Empilé</option>
          <option value="grid">Grille</option>
        </select>

        <button
          onClick={onAnnotationsToggle}
          className={`p-2 rounded-md ${
            showAnnotations ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
          }`}
        >
          <Eye size={18} />
        </button>
      </div>
    </div>

    <div className="flex items-center space-x-2">
      <button
        onClick={onPrint}
        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        <Printer size={18} />
      </button>
      <button
        onClick={onDownload}
        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        <Download size={18} />
      </button>
      <button
        onClick={onShare}
        className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
      >
        <Share2 size={18} />
      </button>
    </div>
  </div>
);

export function DocumentViewer({ document, onClose, onEdit }: DocumentViewerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [layout, setLayout] = useState<'side-by-side' | 'stacked' | 'grid'>('side-by-side');
  const [showAnnotations, setShowAnnotations] = useState(true);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      const pdf = await exportService.toPDF(document);
      const url = URL.createObjectURL(pdf);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.title}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };
  
  const handleShare = async () => {
    try {
      const shareUrl = await shareService.generateShareLink(document.id);
      // Afficher une modale avec le lien de partage
      // Ou utiliser l'API Web Share si disponible
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          text: document.description,
          url: shareUrl
        });
      }
    } catch (error) {
      console.error('Error sharing document:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center space-x-3">
          <Book className="text-blue-600" size={24} />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {document.title}
            </h1>
            <p className="text-sm text-gray-500">
              {document.metadata.author} · Mis à jour le{' '}
              {new Date(document.metadata.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Modifier
          </button>
        )}
      </div>

      <ViewerToolbar
        currentPage={currentPage}
        totalPages={document.pages.length}
        layout={layout}
        showAnnotations={showAnnotations}
        onPageChange={setCurrentPage}
        onLayoutChange={setLayout}
        onAnnotationsToggle={() => setShowAnnotations(!showAnnotations)}
        onPrint={handlePrint}
        onDownload={handleDownload}
        onShare={handleShare}
      />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-7xl mx-auto">
          <PageView
            page={document.pages[currentPage]}
            layout={layout}
            showAnnotations={showAnnotations}
          />
        </div>
      </div>

      {document.metadata.tags.length > 0 && (
        <div className="px-8 py-4 border-t">
          <div className="flex items-center space-x-2">
            {document.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
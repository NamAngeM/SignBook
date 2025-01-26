import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookViewerProps {
  book: Book;
  onClose: () => void;
}

export function BookViewer({ book, onClose }: BookViewerProps) {
  const [currentPage, setCurrentPage] = React.useState(0);

  const handlePreviousPage = () => {
    setCurrentPage(Math.max(0, currentPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(Math.min(book.pages.length - 1, currentPage + 1));
  };

  const page = book.pages[currentPage];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{book.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              {page.imageUrl && (
                <img
                  src={page.imageUrl}
                  alt={`Page ${page.pageNumber}`}
                  className="w-full rounded-lg mb-4"
                />
              )}
              <div className="prose max-w-none">
                {page.content}
              </div>
            </div>

            <div>
              {page.signLanguageVideo && (
                <video
                  src={page.signLanguageVideo}
                  controls
                  className="w-full rounded-lg"
                />
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 border rounded-md disabled:opacity-50"
          >
            <ChevronLeft size={20} />
            Précédent
          </button>
          <span>
            Page {currentPage + 1} sur {book.pages.length}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === book.pages.length - 1}
            className="flex items-center gap-2 px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Suivant
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
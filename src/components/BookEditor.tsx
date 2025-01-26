import React, { useState } from 'react';
import { Book, Plus, Trash2, Video, Image as ImageIcon } from 'lucide-react';

interface BookEditorProps {
  initialBook?: Book;
  onSave: (book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function BookEditor({ initialBook, onSave, onCancel }: BookEditorProps) {
  const [title, setTitle] = useState(initialBook?.title || '');
  const [description, setDescription] = useState(initialBook?.description || '');
  const [pages, setPages] = useState<Omit<BookPage, 'id'>[]>(
    initialBook?.pages.map(p => ({
      content: p.content,
      signLanguageVideo: p.signLanguageVideo,
      imageUrl: p.imageUrl,
      pageNumber: p.pageNumber,
    })) || []
  );

  const handleAddPage = () => {
    setPages([
      ...pages,
      {
        content: '',
        pageNumber: pages.length + 1,
      },
    ]);
  };

  const handleUpdatePage = (index: number, updates: Partial<BookPage>) => {
    setPages(
      pages.map((page, i) =>
        i === index ? { ...page, ...updates } : page
      )
    );
  };

  const handleDeletePage = (index: number) => {
    setPages(pages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      description,
      pages,
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Titre
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Pages</h3>
            <button
              type="button"
              onClick={handleAddPage}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              <Plus size={20} />
              Ajouter une page
            </button>
          </div>

          {pages.map((page, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Page {page.pageNumber}</h4>
                <button
                  type="button"
                  onClick={() => handleDeletePage(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contenu
                </label>
                <textarea
                  value={page.content}
                  onChange={(e) => handleUpdatePage(index, { content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vidéo LSF
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id={`video-${index}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Ici, vous devrez implémenter la logique pour uploader la vidéo
                          // et obtenir son URL
                          handleUpdatePage(index, { signLanguageVideo: URL.createObjectURL(file) });
                        }
                      }}
                    />
                    <label
                      htmlFor={`video-${index}`}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <Video size={20} />
                      Choisir une vidéo
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id={`image-${index}`}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Ici, vous devrez implémenter la logique pour uploader l'image
                          // et obtenir son URL
                          handleUpdatePage(index, { imageUrl: URL.createObjectURL(file) });
                        }
                      }}
                    />
                    <label
                      htmlFor={`image-${index}`}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                    >
                      <ImageIcon size={20} />
                      Choisir une image
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import {
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Settings,
  Eye,
  Download,
  Share2,
  Book,
} from 'lucide-react';
import { Document } from '../../types';

interface ToolbarProps {
  document: Document;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSave: () => void;
  onCancel: () => void;
  onAddPage: () => void;
  onDeletePage: () => void;
  onExport: () => void;
  onPreview: () => void;
  onShare: () => void;
}

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  label,
  onClick,
  disabled = false,
  variant = 'secondary',
}) => {
  const baseClasses = "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      title={label}
    >
      {icon}
      <span className="ml-2 hidden sm:inline">{label}</span>
    </button>
  );
};

export function Toolbar({
  document,
  currentPage,
  onPageChange,
  onSave,
  onCancel,
  onAddPage,
  onDeletePage,
  onExport,
  onPreview,
  onShare,
}: ToolbarProps) {
  const [showSettings, setShowSettings] = useState(false);

  const totalPages = document.pages.length;

  return (
    <div className="border-b bg-white px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-50"
              title="Page précédente"
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
              title="Page suivante"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <ToolbarButton
            icon={<Plus size={18} />}
            label="Ajouter une page"
            onClick={onAddPage}
          />
          <ToolbarButton
            icon={<Trash2 size={18} />}
            label="Supprimer la page"
            onClick={onDeletePage}
            variant="danger"
            disabled={totalPages <= 1}
          />
        </div>

        <div className="flex items-center space-x-2">
          <ToolbarButton
            icon={<Eye size={18} />}
            label="Aperçu"
            onClick={onPreview}
          />
          <ToolbarButton
            icon={<Download size={18} />}
            label="Exporter"
            onClick={onExport}
          />
          <ToolbarButton
            icon={<Share2 size={18} />}
            label="Partager"
            onClick={onShare}
          />
          <ToolbarButton
            icon={<Settings size={18} />}
            label="Paramètres"
            onClick={() => setShowSettings(!showSettings)}
          />
          <div className="w-px h-6 bg-gray-200 mx-2" />
          <ToolbarButton
            icon={<Save size={18} />}
            label="Enregistrer"
            onClick={onSave}
            variant="primary"
          />
          <ToolbarButton
            icon={<X size={18} />}
            label="Annuler"
            onClick={onCancel}
          />
        </div>
      </div>

      {showSettings && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Paramètres du document</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                value={document.title}
                onChange={(e) => {
                  // Mettre à jour le titre
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={document.description}
                onChange={(e) => {
                  // Mettre à jour la description
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <input
                type="text"
                value={document.metadata.tags.join(', ')}
                onChange={(e) => {
                  // Mettre à jour les tags
                }}
                placeholder="Séparez les tags par des virgules"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Statut
              </label>
              <select
                value={document.metadata.status}
                onChange={(e) => {
                  // Mettre à jour le statut
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="draft">Brouillon</option>
                <option value="published">Publié</option>
                <option value="archived">Archivé</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
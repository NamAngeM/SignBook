import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Plus, 
  Trash2, 
  Video, 
  Image as ImageIcon,
  Mic,
  MicOff,
  Wand2,
  User,
  Bot,
  RefreshCw,
  AlertCircle,
  X
} from 'lucide-react';
import { VoiceInput } from './AIFeatures/VoiceInput';
import { SignLanguageTranslator } from './AIFeatures/SignLanguageTranslator';
import { ContentSuggestions } from './AIFeatures/ContentSuggestions';
import { AvatarCustomizer } from './AIFeatures/AvatarCustomizer';
import { AIAssistant } from './AIFeatures/AIAssistant';
import { 
  AIContentSuggestion, 
  AccessibilityIssue, 
  AvatarConfig,
  Book as BookType
} from '../types';

interface BookEditorProps {
  initialBook?: BookType;
  onSave: (book: Omit<BookType, 'id' | 'createdAt' | 'updatedAt'>) => void;
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

  // États pour les fonctionnalités IA
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AIContentSuggestion[]>([]);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>({
    gender: 'neutral',
    age: 'adult',
    style: 'casual',
    skinTone: '#E0B0A0',
    hairColor: '#4A3728',
    hairStyle: 'short',
    outfit: 'casual-1',
    expression: 'neutral'
  });

  const handleVoiceTranscript = (text: string) => {
    const currentPage = pages[currentPageIndex];
    handleUpdatePage(currentPageIndex, {
      ...currentPage,
      content: currentPage.content + ' ' + text
    });
  };

  const handleSuggestionSelect = (suggestion: AIContentSuggestion) => {
    const currentPage = pages[currentPageIndex];
    switch (suggestion.type) {
      case 'text':
        handleUpdatePage(currentPageIndex, {
          ...currentPage,
          content: currentPage.content + '\n' + suggestion.content
        });
        break;
      case 'image':
        handleUpdatePage(currentPageIndex, {
          ...currentPage,
          imageUrl: suggestion.preview
        });
        break;
      case 'video':
        handleUpdatePage(currentPageIndex, {
          ...currentPage,
          signLanguageVideo: suggestion.preview
        });
        break;
    }
  };

  const handleAvatarChange = (newConfig: AvatarConfig) => {
    setAvatarConfig(newConfig);
    if (pages[currentPageIndex]?.content) {
      handleSignLanguageTranslation(currentPageIndex);
    }
  };

  const handleSignLanguageTranslation = async (pageIndex: number) => {
    try {
      setIsTranslating(true);
      const page = pages[pageIndex];
      
      // Simuler l'appel à l'API de traduction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mise à jour de la page avec la vidéo traduite
      handleUpdatePage(pageIndex, {
        ...page,
        signLanguageVideo: 'URL_VIDEO_GENEREE'
      });
    } catch (error) {
      console.error('Erreur lors de la traduction:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleUpdatePage = (index: number, updatedPage: Partial<Omit<BookPage, 'id'>>) => {
    const newPages = [...pages];
    newPages[index] = { ...newPages[index], ...updatedPage };
    setPages(newPages);
  };

  const handleAddPage = () => {
    setPages([...pages, { content: '', signLanguageVideo: '', imageUrl: '', pageNumber: pages.length + 1 }]);
  };

  const handleDeletePage = (index: number) => {
    const newPages = pages.filter((_, i) => i !== index);
    setPages(newPages);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, description, pages });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {initialBook ? 'Modifier le livre' : 'Créer un nouveau livre'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAIAssistant(!showAIAssistant)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
          >
            <Bot size={20} />
            Assistant IA
          </button>
        </div>
      </div>

      {/* Barre d'outils IA */}
      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
        <div className="flex gap-4">
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            onError={error => console.error('Erreur de reconnaissance vocale:', error)}
          />
          
          <button
            onClick={() => setShowAvatarCustomizer(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg"
          >
            <User size={20} />
            Personnaliser l'avatar
          </button>
        </div>

        <ContentSuggestions
          currentContent={pages[currentPageIndex]?.content || ''}
          onSuggestionSelect={handleSuggestionSelect}
          maxSuggestions={3}
        />
      </div>

      {/* Modals */}
      {showAIAssistant && (
        <AIAssistant
          suggestions={aiSuggestions}
          accessibilityIssues={accessibilityIssues}
          onClose={() => setShowAIAssistant(false)}
          onApplySuggestion={handleSuggestionSelect}
          onFixAccessibility={handleFixAccessibility}
        />
      )}

      {showAvatarCustomizer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Personnaliser l'avatar</h3>
              <button
                onClick={() => setShowAvatarCustomizer(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            <AvatarCustomizer
              onAvatarChange={handleAvatarChange}
              initialConfig={avatarConfig}
            />
          </div>
        </div>
      )}

      {isTranslating && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md">
          <SignLanguageTranslator
            text={pages[currentPageIndex]?.content || ''}
            onTranslationComplete={videoUrl => {
              handleUpdatePage(currentPageIndex, {
                ...pages[currentPageIndex],
                signLanguageVideo: videoUrl
              });
              setIsTranslating(false);
            }}
            avatarStyle={avatarConfig.style}
          />
        </div>
      )}

      {/* Reste du formulaire existant */}
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

          <div
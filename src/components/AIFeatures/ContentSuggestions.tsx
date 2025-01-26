import React, { useState, useEffect } from 'react';
import { 
  Lightbulb, 
  Image as ImageIcon, 
  Type, 
  Video,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface Suggestion {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  preview?: string;
  confidence: number;
}

interface ContentSuggestionsProps {
  currentContent: string;
  onSuggestionSelect: (suggestion: Suggestion) => void;
  onRefresh?: () => void;
  maxSuggestions?: number;
}

export function ContentSuggestions({
  currentContent,
  onSuggestionSelect,
  onRefresh,
  maxSuggestions = 3
}: ContentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentContent) {
      generateSuggestions();
    }
  }, [currentContent]);

  const generateSuggestions = async () => {
    setIsLoading(true);
    try {
      // Simuler l'appel à l'API de suggestions
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Exemple de suggestions générées
      const newSuggestions: Suggestion[] = [
        {
          id: '1',
          type: 'text',
          content: 'Suggestion de texte basée sur le contenu actuel...',
          confidence: 0.85
        },
        {
          id: '2',
          type: 'image',
          content: 'Une image illustrant le concept principal',
          preview: 'URL_IMAGE',
          confidence: 0.75
        },
        {
          id: '3',
          type: 'video',
          content: 'Vidéo explicative suggérée',
          preview: 'URL_VIDEO',
          confidence: 0.65
        }
      ].slice(0, maxSuggestions);

      setSuggestions(newSuggestions);
    } catch (error) {
      console.error('Erreur lors de la génération des suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-5 h-5" />;
      case 'image':
        return <ImageIcon className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Suggestions IA</h3>
        <button
          onClick={() => {
            generateSuggestions();
            onRefresh?.();
          }}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
          disabled={isLoading}
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map(suggestion => (
            <div
              key={suggestion.id}
              className="group flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onSuggestionSelect(suggestion)}
            >
              <div className={`p-2 rounded-lg ${
                suggestion.type === 'text' ? 'bg-purple-100 text-purple-600' :
                suggestion.type === 'image' ? 'bg-green-100 text-green-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {getIconForType(suggestion.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 mb-1">
                      {suggestion.type === 'text' ? 'Suggestion de texte' :
                       suggestion.type === 'image' ? 'Image suggérée' :
                       'Vidéo suggérée'}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {suggestion.content}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                </div>

                {suggestion.preview && (
                  <div className="mt-2">
                    {suggestion.type === 'image' ? (
                      <img
                        src={suggestion.preview}
                        alt="Aperçu"
                        className="w-full h-24 object-cover rounded"
                      />
                    ) : (
                      <video
                        src={suggestion.preview}
                        className="w-full h-24 object-cover rounded"
                      />
                    )}
                  </div>
                )}
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Aucune suggestion pour le moment</p>
          </div>
        )}
      </div>
    </div>
  );
}
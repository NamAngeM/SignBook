import React from 'react';
import { 
  Bot, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight,
  X
} from 'lucide-react';

interface AIAssistantProps {
  suggestions: AIContentSuggestion[];
  accessibilityIssues: AccessibilityIssue[];
  onClose: () => void;
  onApplySuggestion: (suggestion: AIContentSuggestion) => void;
  onFixAccessibility: (issue: AccessibilityIssue) => void;
}

export function AIAssistant({
  suggestions,
  accessibilityIssues,
  onClose,
  onApplySuggestion,
  onFixAccessibility
}: AIAssistantProps) {
  return (
    <div className="fixed right-4 top-20 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Assistant SignBook</h3>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Suggestions de contenu */}
        {suggestions.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Suggestions d'amélioration</h4>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-blue-50 p-3 rounded-lg flex items-start gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {suggestion.type === 'text' ? 'Suggestion de texte' :
                         suggestion.type === 'image' ? 'Image suggérée' : 'Vidéo suggérée'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.round(suggestion.confidence * 100)}% de confiance
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{suggestion.content}</p>
                  </div>
                  <button
                    onClick={() => onApplySuggestion(suggestion)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Problèmes d'accessibilité */}
        {accessibilityIssues.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Problèmes d'accessibilité</h4>
            <div className="space-y-2">
              {accessibilityIssues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-start gap-3 ${
                    issue.severity === 'high' ? 'bg-red-50' :
                    issue.severity === 'medium' ? 'bg-yellow-50' : 'bg-gray-50'
                  }`}
                >
                  <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
                    issue.severity === 'high' ? 'text-red-500' :
                    issue.severity === 'medium' ? 'text-yellow-500' : 'text-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{issue.message}</p>
                    <button
                      onClick={() => onFixAccessibility(issue)}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-1"
                    >
                      Corriger automatiquement
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pas de suggestions ni de problèmes */}
        {suggestions.length === 0 && accessibilityIssues.length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-600">
              Tout est parfait ! Votre livre respecte les meilleures pratiques d'accessibilité.
            </p>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-50 rounded-b-lg">
        <p className="text-xs text-gray-500 text-center">
          Propulsé par l'IA de SignBook - Suggestions mises à jour en temps réel
        </p>
      </div>
    </div>
  );
}
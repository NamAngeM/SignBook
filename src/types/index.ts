export interface Document {
  id: string;
  title: string;
  description: string;
  language: {
    primary: string;
    secondary: string;
  };
  pages: Page[];
  metadata: {
    author: string;
    createdAt: Date;
    updatedAt: Date;
    tags: string[];
    status: 'draft' | 'published' | 'archived';
  };
}

export interface Page {
  id: string;
  pageNumber: number;
  content: {
    primary: string;
    secondary: string;
  };
  media: {
    signLanguageVideo?: string;
    images: string[];
    audio?: string;
  };
  layout: 'side-by-side' | 'stacked' | 'grid';
  annotations: Annotation[];
}

export interface Annotation {
  id: string;
  type: 'note' | 'translation' | 'definition';
  content: string;
  position: { x: number; y: number };
  timestamp?: number; // Pour les annotations vidéo
}

// Types pour les fonctionnalités IA
export interface AIContentSuggestion {
  id: string;
  type: 'text' | 'image' | 'video';
  content: string;
  preview?: string;
  confidence: number;
}

export interface AccessibilityIssue {
  type: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AvatarConfig {
  gender: 'male' | 'female' | 'neutral';
  age: 'young' | 'adult' | 'senior';
  style: 'casual' | 'professional' | 'formal';
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  outfit: string;
  expression: string;
}

export interface TranslationStatus {
  status: 'idle' | 'processing' | 'complete' | 'error';
  progress: number;
  message?: string;
}

export interface VoiceRecognitionConfig {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

// Types pour les événements de reconnaissance vocale
export interface VoiceRecognitionEvent {
  results: {
    transcript: string;
    confidence: number;
    isFinal: boolean;
  }[];
}

// Types pour les services IA
export interface AITranslationService {
  translateToSignLanguage: (text: string, config?: AvatarConfig) => Promise<string>;
  generatePreview: (text: string) => Promise<string>;
}

export interface AIContentService {
  generateSuggestions: (content: string, maxSuggestions?: number) => Promise<AIContentSuggestion[]>;
  analyzeSentiment: (text: string) => Promise<{
    sentiment: 'positive' | 'neutral' | 'negative';
    confidence: number;
  }>;
}

export interface AIAccessibilityService {
  checkAccessibility: (content: string) => Promise<{
    score: number;
    issues: AccessibilityIssue[];
  }>;
  suggestImprovements: (content: string) => Promise<string[]>;
}
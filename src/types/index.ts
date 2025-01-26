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
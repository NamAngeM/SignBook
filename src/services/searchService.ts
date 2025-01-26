import { Document } from '../types';

export interface SearchResult {
  documentId: string;
  pageNumber: number;
  matchType: 'primary' | 'secondary';
  excerpt: string;
  highlight: [number, number];
}

export const searchService = {
  async searchInDocument(
    document: Document,
    query: string
  ): Promise<SearchResult[]> {
    const results: SearchResult[] = [];

    document.pages.forEach((page, pageNumber) => {
      // Recherche dans le contenu principal
      const primaryMatches = page.content.primary.toLowerCase()
        .indexOf(query.toLowerCase());
      if (primaryMatches !== -1) {
        results.push({
          documentId: document.id,
          pageNumber,
          matchType: 'primary',
          excerpt: page.content.primary.substring(
            Math.max(0, primaryMatches - 50),
            primaryMatches + 50
          ),
          highlight: [primaryMatches, primaryMatches + query.length]
        });
      }

      // Recherche dans le contenu LSF
      const secondaryMatches = page.content.secondary.toLowerCase()
        .indexOf(query.toLowerCase());
      if (secondaryMatches !== -1) {
        results.push({
          documentId: document.id,
          pageNumber,
          matchType: 'secondary',
          excerpt: page.content.secondary.substring(
            Math.max(0, secondaryMatches - 50),
            secondaryMatches + 50
          ),
          highlight: [secondaryMatches, secondaryMatches + query.length]
        });
      }
    });

    return results;
  }
};
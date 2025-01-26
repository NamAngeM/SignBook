import { Document } from '../types';

export const shareService = {
  async generateShareLink(documentId: string): Promise<string> {
    // Générer un lien de partage temporaire
    const response = await fetch('/.netlify/functions/generateShareLink', {
      method: 'POST',
      body: JSON.stringify({ documentId })
    });
    const { shareUrl } = await response.json();
    return shareUrl;
  },

  async shareByEmail(documentId: string, email: string): Promise<void> {
    await fetch('/.netlify/functions/shareByEmail', {
      method: 'POST',
      body: JSON.stringify({ documentId, email })
    });
  }
};
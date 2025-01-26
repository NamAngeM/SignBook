import html2pdf from 'html2pdf.js';
import { Document } from '../types';

export const exportService = {
  async toPDF(document: Document): Promise<Blob> {
    const content = document.pages.map(page => `
      <div class="page">
        <h2>${document.title}</h2>
        <div class="content">
          <div class="primary">${page.content.primary}</div>
          <div class="secondary">${page.content.secondary}</div>
        </div>
        ${page.media.images.map(img => `<img src="${img}" />`).join('')}
      </div>
    `).join('');

    const options = {
      margin: 1,
      filename: `${document.title}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    return html2pdf().set(options).from(content).outputPdf('blob');
  },

  async toEPUB(document: Document): Promise<Blob> {
    // Implémenter l'export EPUB
    return new Blob();
  }
};
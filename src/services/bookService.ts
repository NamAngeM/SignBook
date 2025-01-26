import axios from 'axios';

export interface BookData {
  id?: string;
  title: string;
  description: string;
  coverImage?: string;
  pages: BookPage[];
  createdAt: Date;
  updatedAt: Date;
}

const API_URL = '/.netlify/functions';

export const bookService = {
  async getBooks() {
    const { data } = await axios.get(`${API_URL}/books`);
    return data.data.map(book => ({
      ...book.data,
      id: book.ref['@ref'].id
    }));
  },

  async getBook(id: string) {
    const { data } = await axios.get(`${API_URL}/books?id=${id}`);
    return {
      ...data.data,
      id: data.ref['@ref'].id
    };
  },

  async createBook(bookData: Omit<BookData, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data } = await axios.post(`${API_URL}/books`, bookData);
    return data.ref['@ref'].id;
  },

  async updateBook(id: string, bookData: Partial<BookData>) {
    const { data } = await axios.put(`${API_URL}/books`, {
      id,
      ...bookData
    });
    return data;
  },

  async deleteBook(id: string) {
    await axios.delete(`${API_URL}/books?id=${id}`);
  },

  async uploadMedia(file: File, path: string) {
    // Créer un FormData pour l'upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', path);

    const { data } = await axios.post(`${API_URL}/uploadMedia`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return data.url;
  }
};
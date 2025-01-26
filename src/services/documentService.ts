import { client } from './faunaClient';
import { query as q } from 'faunadb';
import { Document, Page } from '../types';

export const documentService = {
  async createDocument(document: Omit<Document, 'id'>): Promise<string> {
    const result = await client.query(
      q.Create(q.Collection('documents'), {
        data: {
          ...document,
          metadata: {
            ...document.metadata,
            createdAt: q.Now(),
            updatedAt: q.Now()
          }
        }
      })
    );
    return result.ref.id;
  },

  async getDocument(id: string): Promise<Document> {
    const result = await client.query(
      q.Get(q.Ref(q.Collection('documents'), id))
    );
    return result.data;
  },

  async updateDocument(id: string, document: Partial<Document>): Promise<void> {
    await client.query(
      q.Update(q.Ref(q.Collection('documents'), id), {
        data: {
          ...document,
          metadata: {
            ...document.metadata,
            updatedAt: q.Now()
          }
        }
      })
    );
  },

  async deleteDocument(id: string): Promise<void> {
    await client.query(
      q.Delete(q.Ref(q.Collection('documents'), id))
    );
  },

  async getDocuments(filter?: {
    status?: Document['metadata']['status'];
    tags?: string[];
  }): Promise<Document[]> {
    let query = q.Match(q.Index('all_documents'));

    if (filter?.status) {
      query = q.Filter(
        query,
        q.Lambda('doc',
          q.Equals(
            q.Select(['data', 'metadata', 'status'], q.Get(q.Var('doc'))),
            filter.status
          )
        )
      );
    }

    if (filter?.tags && filter.tags.length > 0) {
      query = q.Filter(
        query,
        q.Lambda('doc',
          q.All(
            filter.tags.map(tag =>
              q.Contains(
                tag,
                q.Select(['data', 'metadata', 'tags'], q.Get(q.Var('doc')))
              )
            )
          )
        )
      );
    }

    const result = await client.query(
      q.Map(
        q.Paginate(query),
        q.Lambda('ref', q.Get(q.Var('ref')))
      )
    );

    return result.data.map(doc => ({
      id: doc.ref.id,
      ...doc.data
    }));
  }
};
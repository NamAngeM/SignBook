import { Handler } from '@netlify/functions';
import { Client, query as q } from 'faunadb';

const client = new Client({
  secret: process.env.FAUNA_SECRET_KEY
});

export const handler: Handler = async (event, context) => {
  try {
    switch (event.httpMethod) {
      case 'GET':
        if (event.queryStringParameters?.id) {
          // Récupérer un livre spécifique
          const result = await client.query(
            q.Get(q.Ref(q.Collection('books'), event.queryStringParameters.id))
          );
          return {
            statusCode: 200,
            body: JSON.stringify(result)
          };
        } else {
          // Récupérer tous les livres
          const result = await client.query(
            q.Map(
              q.Paginate(q.Documents(q.Collection('books'))),
              q.Lambda('ref', q.Get(q.Var('ref')))
            )
          );
          return {
            statusCode: 200,
            body: JSON.stringify(result)
          };
        }

      case 'POST':
        // Créer un nouveau livre
        const data = JSON.parse(event.body);
        const result = await client.query(
          q.Create(q.Collection('books'), {
            data: {
              ...data,
              createdAt: q.Now(),
              updatedAt: q.Now()
            }
          })
        );
        return {
          statusCode: 201,
          body: JSON.stringify(result)
        };

      case 'PUT':
        // Mettre à jour un livre
        const { id, ...updateData } = JSON.parse(event.body);
        const updateResult = await client.query(
          q.Update(q.Ref(q.Collection('books'), id), {
            data: {
              ...updateData,
              updatedAt: q.Now()
            }
          })
        );
        return {
          statusCode: 200,
          body: JSON.stringify(updateResult)
        };

      case 'DELETE':
        // Supprimer un livre
        const deleteId = event.queryStringParameters?.id;
        await client.query(
          q.Delete(q.Ref(q.Collection('books'), deleteId))
        );
        return {
          statusCode: 204,
          body: ''
        };

      default:
        return {
          statusCode: 405,
          body: 'Method Not Allowed'
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
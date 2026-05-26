import { QdrantClient } from '@qdrant/js-client-rest';

const qdrantUrl = process.env.QDRANT_URL || 'http://localhost:6333';
const qdrantApiKey = process.env.QDRANT_API_KEY || process.env.Qdrant_api || process.env.qdrant_api;

export const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  ...(qdrantApiKey ? { apiKey: qdrantApiKey } : {})
});

export const initQdrant = async () => {
  try {
    const collectionName = 'resumes';
    const collections = await qdrantClient.getCollections();
    const exists = collections.collections.some(c => c.name === collectionName);

    if (!exists) {
      console.log(`[Qdrant] Collection '${collectionName}' not found. Creating it...`);
      await qdrantClient.createCollection(collectionName, {
        vectors: {
          size: 768, // size matching 'nomic-embed-text' dimensions
          distance: 'Cosine',
        },
      });
      console.log(`[Qdrant] Collection '${collectionName}' created successfully.`);
    } else {
      console.log(`[Qdrant] Collection '${collectionName}' exists.`);
    }
  } catch (error) {
    console.error(`[Qdrant] Initialization warning: Qdrant may not be running yet at ${qdrantUrl}. Details: ${error.message}`);
  }
};

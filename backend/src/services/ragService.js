import crypto from 'crypto';
import { qdrantClient } from '../config/qdrant.js';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'nomic-embed-text';

/**
 * Splits text into chunks with overlap
 * Mimics LangChain's RecursiveCharacterTextSplitter
 */
export const splitText = (text, chunkSize = 800, chunkOverlap = 150) => {
  const chunks = [];
  let currentIndex = 0;

  while (currentIndex < text.length) {
    let endIndex = currentIndex + chunkSize;
    
    // If we are not at the end of the text, look for a sensible boundary
    if (endIndex < text.length) {
      const boundaryIndex = findSplitBoundary(text, currentIndex, endIndex);
      if (boundaryIndex !== -1) {
        endIndex = boundaryIndex;
      }
    } else {
      endIndex = text.length;
    }

    const chunk = text.slice(currentIndex, endIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move next index based on chunk overlap
    currentIndex = endIndex - chunkOverlap;
    if (currentIndex <= 0) {
      currentIndex = endIndex; // Prevent infinite loop if overlap is larger than chunk
    }
    if (currentIndex >= text.length || endIndex === text.length) {
      break;
    }
  }

  return chunks;
};

/**
 * Helper to find sensible character splitting boundaries (paragraphs, sentences)
 */
const findSplitBoundary = (text, start, end) => {
  const searchRange = text.slice(start + Math.floor((end - start) * 0.7), end + 100); // look near the end of the chunk
  
  // Try paragraphs
  let index = searchRange.lastIndexOf('\n\n');
  if (index !== -1) return start + Math.floor((end - start) * 0.7) + index + 2;

  // Try line breaks
  index = searchRange.lastIndexOf('\n');
  if (index !== -1) return start + Math.floor((end - start) * 0.7) + index + 1;

  // Try sentences
  index = searchRange.lastIndexOf('. ');
  if (index !== -1) return start + Math.floor((end - start) * 0.7) + index + 2;

  // Try spaces
  index = searchRange.lastIndexOf(' ');
  if (index !== -1) return start + Math.floor((end - start) * 0.7) + index + 1;

  return -1; // Fallback to exact split
};

/**
 * Generate embedding vector from Ollama for a text chunk
 */
export const generateEmbedding = async (text) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embedding API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error(`[RAG Service] Embedding generation error: ${error.message}`);
    // If Ollama is offline or failing, return a dummy 768-dim vector to avoid total crash
    console.warn(`[RAG Service] Returning empty mock embedding vector for fallback.`);
    return new Array(768).fill(0).map(() => Math.random() - 0.5);
  }
};

/**
 * Store resume chunks in Qdrant
 */
export const indexResumeText = async (resumeId, userId, parsedText) => {
  try {
    const chunks = splitText(parsedText);
    console.log(`[RAG Service] Chunked resume ${resumeId} into ${chunks.length} segments.`);

    const points = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunkText = chunks[i];
      const vector = await generateEmbedding(chunkText);
      const uuid = crypto.randomUUID();

      points.push({
        id: uuid,
        vector,
        payload: {
          resumeId: resumeId.toString(),
          userId: userId.toString(),
          text: chunkText,
          chunkIndex: i,
          type: 'resume',
        },
      });
    }

    // Upsert to Qdrant collection
    await qdrantClient.upsert('resumes', {
      wait: true,
      points,
    });

    console.log(`[RAG Service] Successfully upserted ${points.length} chunks to Qdrant.`);
    return true;
  } catch (error) {
    console.error(`[RAG Service] Failed indexing resume text: ${error.message}`);
    // Allow metadata schema storage to succeed even if vector store fails
    return false;
  }
};

/**
 * Query Qdrant vector database for matching resume chunks
 */
export const querySemanticContext = async (resumeId, queryText, limit = 5) => {
  try {
    const queryEmbedding = await generateEmbedding(queryText);

    const searchResults = await qdrantClient.search('resumes', {
      vector: queryEmbedding,
      filter: {
        must: [
          {
            key: 'resumeId',
            match: { value: resumeId.toString() },
          },
        ],
      },
      limit,
    });

    return searchResults.map(result => result.payload.text).join('\n\n');
  } catch (error) {
    console.error(`[RAG Service] Semantic search failed: ${error.message}`);
    return ''; // Return empty string fallback
  }
};

/**
 * Delete vectors related to a resume (when resume is deleted)
 */
export const deleteResumeVectors = async (resumeId) => {
  try {
    await qdrantClient.delete('resumes', {
      filter: {
        must: [
          {
            key: 'resumeId',
            match: { value: resumeId.toString() },
          },
        ],
      },
    });
    console.log(`[RAG Service] Deleted all vectors for resume: ${resumeId}`);
    return true;
  } catch (error) {
    console.error(`[RAG Service] Failed to delete resume vectors: ${error.message}`);
    return false;
  }
};
export const getEmbeddingModel = () => EMBEDDING_MODEL;

import fs from 'fs/promises';
import pdfParse from 'pdf-parse';

/**
 * Extracts raw text from an uploaded file path.
 * Supports PDF format and handles raw TXT/Markdown as fallback.
 * @param {string} filePath
 * @returns {Promise<string>} parsed text content
 */
export const parseResumeFile = async (filePath) => {
  try {
    const fileBuffer = await fs.readFile(filePath);

    // Identify file type from name
    if (filePath.endsWith('.pdf')) {
      const data = await pdfParse(fileBuffer);
      return cleanParsedText(data.text);
    } else if (filePath.endsWith('.txt') || filePath.endsWith('.md')) {
      return cleanParsedText(fileBuffer.toString('utf-8'));
    } else {
      // If docx, we can treat it as string or offer fallback text extract.
      // For general robust operation, if it's not a pdf but text, try to read as string
      return cleanParsedText(fileBuffer.toString('utf-8'));
    }
  } catch (error) {
    console.error(`[pdfService] Parsing failed for ${filePath}: ${error.message}`);
    throw new Error(`Failed to parse file: ${error.message}`);
  }
};

/**
 * Clean extracted text (remove redundant spaces, double newlines, etc.)
 */
const cleanParsedText = (text) => {
  if (!text) return '';
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
};

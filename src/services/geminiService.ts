import { GoogleGenAI } from '@google/genai';

// Safe initialization to prevent crash if process.env is missing in browser runtime
const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey });

export const polishText = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) return '';
  if (!apiKey) {
    console.warn('API Key not found');
    return text;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a vintage typewriter editor. 
      Please fix the grammar and improve the flow of the following text, keeping it concise and elegant. 
      Maintain the original language (if Chinese, keep Chinese). 
      Return ONLY the polished text, no explanations.
      
      Text: ${text}`,
    });

    return response.text?.trim() || text;
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

export const continueThought = async (text: string): Promise<string> => {
  if (!text) return '';
  if (!apiKey) {
    console.warn('API Key not found');
    return '';
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful writing assistant. 
      Continue the following thought or paragraph in a style consistent with the input.
      Keep it brief (max 2-3 sentences).
      
      Input: ${text}`,
    });

    return response.text?.trim() || '';
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
};

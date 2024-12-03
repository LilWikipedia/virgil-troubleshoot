import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export const getGeminiResponse = async (
  prompt: string,
  fileContext: string
) => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY is not set');
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const context = `You are an AI assistant analyzing NDT (Non-Destructive Testing) data
  and resources to help troubleshoot issues with testing equipment and more. 
  
  Here is the context about the available files:
  ${fileContext}
  
  User question: ${prompt}
  
  Please provide a helpful response based on the available information.`;

  try {
    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
}
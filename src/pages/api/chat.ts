import { getGeminiResponse } from '@/integrations/gemini/client';
import { supabase } from '@/integrations/supabase/client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, files } = req.body;

    // Create a context string from the files
    const fileContext = files
      .map((file: any) => {
        return `File: ${file.filename}
        Path: ${file.file_path}
        Type: ${file.content_type || 'Unknown'}
        Size: ${file.size || 'Unknown'}
        Processed: ${file.processed ? 'Yes' : 'No'}
        Data: ${file.data ? JSON.stringify(file.data) : 'No data available'}`;
      })
      .join('\n\n');

    const response = await getGeminiResponse(message, fileContext);
    
    res.status(200).json({ response });
  } catch (error) {
    console.error('Error in chat handler:', error);
    res.status(500).json({ 
      message: 'Error processing request',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
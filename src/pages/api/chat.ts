import { getGeminiResponse } from '@/integrations/gemini/client';
import { NextApiRequest, NextApiResponse } from 'next';

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
        .map((file) => `${file.filename} (${file.file_path})`)
        .join(', ');

    const response = await getGeminiResponse(message, fileContext);
    
    res.status(200).json({ response });
    } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
    }
}

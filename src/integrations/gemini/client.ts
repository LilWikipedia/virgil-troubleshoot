import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const getGeminiResponse = async (
    prompt: string,
    fileContext: string
) => {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const context = `You are an AI assistant analyzing NDT (Non-Destructive Testing) data
    and resources to help troubleshoot issues with testing equipment and more. 
    Here is the context about the files: ${fileContext}
    
    User question: ${prompt}`;

    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
};

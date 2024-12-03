import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, files } = await req.json()

    // Create context from files
    const fileContext = files
      .map((file: any) => {
        return `File: ${file.filename}
        Path: ${file.file_path}
        Type: ${file.content_type || 'Unknown'}
        Size: ${file.size || 'Unknown'}
        Processed: ${file.processed ? 'Yes' : 'No'}
        Data: ${file.data ? JSON.stringify(file.data) : 'No data available'}`
      })
      .join('\n\n')

    // Check for API key
    const apiKey = Deno.env.get('GEMINI_API_KEY')
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    const context = `You are an AI assistant analyzing NDT (Non-Destructive Testing) data
    and resources to help troubleshoot issues with testing equipment and more. 
    
    Here is the context about the available files:
    ${fileContext}
    
    User question: ${message}
    
    Please provide a helpful response based on the available information.`

    const result = await model.generateContent(context)
    const response = await result.response
    const text = response.text()

    console.log('Generated response:', text) // Add logging for debugging

    return new Response(
      JSON.stringify({ response: text }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in chat function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to process chat request'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
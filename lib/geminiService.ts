import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = 'gemini-2.5-flash';

export const getAnswerFromPdf = async (pdfText: string, question: string): Promise<string> => {
  const systemInstruction = `You are a helpful AI assistant specialized in answering questions based on the content of a provided document. 
  Your task is to carefully analyze the text from the PDF and answer the user's question based *only* on the information contained within that text.
  - Do not use any external knowledge or information outside of the provided document.
  - If the answer to the question cannot be found in the document, you must clearly state that the information is not available in the provided text.
  - Be concise and direct in your answers.`;

  const prompt = `
--- PDF CONTENT START ---
${pdfText}
--- PDF CONTENT END ---

Based on the content of the PDF provided above, please answer the following question:

Question: "${question}"
`;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.2, // Lower temperature for more factual, less creative answers
        }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return `An error occurred while communicating with the AI model: ${error.message}`;
    }
    return "An unexpected error occurred while processing your request.";
  }
};

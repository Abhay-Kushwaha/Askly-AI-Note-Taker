import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const googleAI = {
  async processPDF(buffer) {
    try {
      const result = await geminiModel.generateContent([
        {
          inlineData: {
            data: buffer.toString('base64'), // Convert to base64 for Gemini
            mimeType: 'application/pdf'
          }
        },
        `Please analyze this PDF document thoroughly and provide a comprehensive summary. 

Focus on:
- Main topics and themes
- Key information and important details
- Structure and organization
- Any tables, charts, or visual elements
- Action items or important dates
- Key takeaways for study purposes

If this is an admission brochure, focus on:
- Admission requirements
- Important dates and deadlines
- Programs offered
- Application process
- Contact information
- Fees and financial information

Please extract and summarize the actual content, not just the document metadata.`
      ]);
      
      return result.response.text();
    } catch (error) {
      throw new Error(`Gemini processing failed: ${error.message}`);
    }
  },

  async processPDFWithFallback(buffer) {
    try {
      // Try with a simpler, more direct prompt
      const result = await geminiModel.generateContent([
        {
          inlineData: {
            data: buffer.toString('base64'),
            mimeType: 'application/pdf'
          }
        },
        "Extract and summarize all visible text content from this PDF. Focus on the actual readable content, not document structure."
      ]);
      
      return result.response.text();
    } catch (error) {
      throw new Error(`Gemini fallback processing failed: ${error.message}`);
    }
  }
};
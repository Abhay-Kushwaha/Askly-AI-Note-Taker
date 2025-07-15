import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const googleAI = {
  async summarizeText(text) {
    try {
      const result = await geminiModel.generateContent([
        {
          parts: [
            {
              text: text,
            },
          ],
        },
        `Summarize this academic content to enhance understanding.
        Focus on: key topics, definitions, examples, and learning takeaways.`,
      ]);
      return result.response.text();
    } catch (error) {
      console.error("Gemini summarization failed:", error);
      throw new Error(`Gemini failed to summarize text: ${error.message}`);
    }
  },
};

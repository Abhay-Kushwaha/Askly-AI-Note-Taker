import { OpenAIApi, Configuration } from "openai-edge";

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function getEmbeddings(text) {
    try {
        if (!text || typeof text !== "string" || text.trim() === "") {
            throw new Error("Embedding input is empty or invalid");
        }

        const response = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input: text.replace(/\n/g, " "),
        });

        const result = await response.json();

        if (!result?.data || !Array.isArray(result.data) || result.data.length === 0) {
            console.error("Embedding API returned unexpected structure:", result);
            throw new Error("Invalid embedding API response");
        }

        return result.data[0].embedding;
    } catch (error) {
        console.error("Error calling OpenAI Embeddings API:", error);
        throw error;
    }
}

import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import md5 from "md5";
import {
    Document,
    RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { googleAI } from "./google-ai-upload";
import { convertToAscii } from "./utils";

export const getPineconeClient = () => {
    return new Pinecone({
        environment: process.env.PINECONE_ENVIRONMENT,
        apiKey: process.env.PINECONE_API_KEY,
    });
};

export async function loadS3IntoPinecone(fileKey) {
    console.log("📥 Downloading PDF from S3...");
    const file_name = await downloadFromS3(fileKey);
    if (!file_name) throw new Error("❌ Could not download from S3");

    console.log("📚 Loading PDF into memory:", file_name);
    const loader = new PDFLoader(file_name);
    const pages = await loader.load();

    console.log("📖 Splitting and preparing documents...");
    const documents = await Promise.all(pages.map(prepareDocument));

    console.log("🧠 Embedding documents with Gemini + OpenAI...");
    const vectors = await Promise.all(documents.flat().map(embedDocument));

    const client = await getPineconeClient();
    const pineconeIndex = await client.index("askly-ai-app");
    const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

    console.log("🌲 Inserting vectors into Pinecone...");
    await namespace.upsert(vectors);

    return documents[0];
}

async function embedDocument(doc) {
    try {
        const summary = await googleAI.summarizeText(doc.pageContent);

        if (!summary || summary.trim().length === 0) {
            throw new Error("Gemini returned empty summary");
        }

        const embeddings = await getEmbeddings(summary);
        const hash = md5(doc.pageContent);

        return {
            id: hash,
            values: embeddings,
            metadata: {
                text: summary,
                pageNumber: doc.metadata.pageNumber,
            },
        };
    } catch (error) {
        console.error("❌ Error embedding document:", error);
        throw error;
    }
}

export const truncateStringByBytes = (str, bytes) => {
    const enc = new TextEncoder();
    return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page) {
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, " ");

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 100,
    });

    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: truncateStringByBytes(pageContent, 36000),
            },
        }),
    ]);

    return docs;
}

// app/api/extract-pdf/route.js
import { NextResponse } from 'next/server';
import { S3 } from "@aws-sdk/client-s3";
import { PDFExtract } from 'pdf.js-extract';

export async function POST(req) {
    try {
        const { fileKey } = await req.json();

        // Initialize S3
        const s3 = new S3({
            region: "eu-north-1",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
            },
        });

        // Get PDF from S3
        const response = await s3.getObject({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: fileKey,
        });

        // Convert stream to buffer
        const chunks = [];
        for await (const chunk of response.Body) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // Extract text from PDF
        const pdfExtract = new PDFExtract();
        const data = await pdfExtract.extractBuffer(buffer);

        // Combine all pages' text
        const text = data.pages
            .map(page => page.content.map(item => item.str).join(' '))
            .join('\n');

        return NextResponse.json({ text });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Failed to extract PDF text' },
            { status: 500 }
        );
    }
}
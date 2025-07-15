// app/api/upload-to-s3/route.js
import { S3 } from "@aws-sdk/client-s3";

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get("file");
        if (!file) {
            return new Response(JSON.stringify({ error: "No file provided" }), { status: 400 });
        }

        // Convert file to Buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const s3 = new S3({
            region: "eu-north-1",
            credentials: {
                accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
            },
        });

        const file_key = "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

        await s3.putObject({
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            Key: file_key,
            Body: buffer,
            ContentType: file.type,
        });

        return new Response(JSON.stringify({ file_key, file_name: file.name }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Upload failed" }), { status: 500 });
    }
}
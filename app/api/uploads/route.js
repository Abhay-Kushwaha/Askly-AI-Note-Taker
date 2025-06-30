import { NextResponse } from "next/server";
import { googleAI } from "@/lib/google-ai-upload";
import { db } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

export const dynamic = "force-dynamic";

// Ensure required env vars are present
["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "GEMINI_API_KEY"].forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing env: ${key}`);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const userId = "7400e09b-2d48-42d3-8530-4f35e7aedabe"; // TODO: replace with real auth
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Parse FormData
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "No file provided or invalid file" }, { status: 400 });
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Send PDF directly to Gemini for processing
    let summary = "";
    try {
      // Pass the buffer directly to Gemini
      summary = await googleAI.processPDF(buffer, file.name);
    } catch (err) {
      console.warn("Gemini PDF processing failed:", err.message);
    }

    if (!summary) {
      return NextResponse.json({
        error: "Summary not generated. Upload not saved.",
        fileSize: buffer.length,
        fileName: file.name,
      }, { status: 400 });
    }

    console.log("PDF summary generated successfully:", summary);
    
    // 2. Upload raw PDF to Cloudinary (only if summary was successful)
    const cloudinaryResult = await cloudinary.uploader.upload(
      `data:application/pdf;base64,${buffer.toString("base64")}`,
      { 
        resource_type: "raw", 
        public_id: file.name.replace(/\.[^/.]+$/, ""), // Remove extension for public_id
        folder: "pdf-uploads" // Optional: organize uploads in a folder
      }
    );

    // 3. Save to DB
    const upload = await db.upload.create({
      data: {
        userId,
        filename: file.name,
        content: buffer.toString("base64"), // store as base64 string for DB
        summary,
        cloudinaryUrl: cloudinaryResult.secure_url,
      },
    });

    return NextResponse.json({
      message: "Upload successful",
      upload: {
        id: upload.id,
        filename: upload.filename,
        summary: upload.summary,
        cloudinaryUrl: upload.cloudinaryUrl,
        createdAt: upload.createdAt,
      },
      directGeminiProcessing: true,
    });

  } catch (error) {
    console.error("Upload error:", error.message);
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // TODO: Replace with real auth in production
    const userId = "7400e09b-2d48-42d3-8530-4f35e7aedabe"; // Made consistent with POST
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const uploads = await db.upload.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        summary: true,
        cloudinaryUrl: true,
        createdAt: true
      }
    });

    return NextResponse.json({ uploads });

  } catch (error) {
    console.error("Get uploads error:", error.message);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message
    }, { status: 500 });
  }
}
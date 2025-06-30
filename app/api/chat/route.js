import { NextResponse } from "next/server";
import { googleAI } from "@/lib/google-ai-upload";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

function errorResponse(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req) {
  try {
    const userId = "7400e09b-2d48-42d3-8530-4f35e7aedabe";
    if (!userId) return errorResponse("Unauthorized", 401);

    const body = await req.json();
    const { question, uploadId } = body;

    if (!question || !uploadId) return errorResponse("Question and uploadId required");

    // 1. Fetch upload content to use as context
    const upload = await db.upload.findUnique({
      where: { id: uploadId },
      select: { content: true },
    });

    if (!upload) return errorResponse("Upload not found", 404);

    // 2. Ask question using upload content as context
    const answer = await googleAI.askQuestion({
      question,
      context: upload.content,
    });

    if (!answer) return errorResponse("AI failed to generate answer", 500);

    // 3. Store chat
    const chat = await db.chat.create({
      data: {
        userId,
        question,
        answer,
        uploadId,
      },
    });

    return NextResponse.json({ answer, chat });

  } catch (err) {
    console.error("Chat error:", err);
    return errorResponse("Internal server error", 500);
  }
}

export async function GET(req) {
  try {
    const userId = "7400e09b-2d48-42d3-8530-4f35e7aedabe"; // TODO: Replace with real auth
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await db.chat.findMany({
      where: { userId },
      include: {
        upload: {
          select: { filename: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ chats });

  } catch (error) {
    console.error("Get chats error:", error.message);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error.message 
    }, { status: 500 });
  }
}
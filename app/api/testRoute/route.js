
import { NextResponse } from "next/server";
import { googleAI } from "@/lib/google-ai-upload";
import { db } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
// import pdf from "pdf-parse"; 

export async function GET(req) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  if (action === "health-check") {
    return NextResponse.json({ message: "Upload route working" });
  }

  // Your main GET logic
  const userId = "7400e09b-2d48-42d3-8530-4f35e7aedabe";
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const uploads = await db.upload.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      filename: true,
      summary: true,
      cloudinaryUrl: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ uploads }, { status: 200 }, { message: "Uploads fetched successfully" });
}

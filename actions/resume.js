"use server";

import { db } from "@/lib/index";
import { users, resumes } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { revalidatePath } from "next/cache";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function saveResume(content) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Find user by clerkUserId
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .then((res) => res[0]);
  if (!user) throw new Error("User not found");

  try {
    // Check if resume exists
    const existing = await db
      .select()
      .from(resumes)
      .where(eq(resumes.userId, user.id))
      .then((res) => res[0]);
    let resume;
    if (existing) {
      // Update
      [resume] = await db
        .update(resumes)
        .set({ content, updatedAt: new Date() })
        .where(eq(resumes.userId, user.id))
        .returning();
    } else {
      // Insert
      [resume] = await db
        .insert(resumes)
        .values({
          userId: user.id,
          content,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }
    revalidatePath("/resume");
    return resume;
  } catch (error) {
    console.error("Error saving resume:", error);
    throw new Error("Failed to save resume");
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Find user by clerkUserId
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .then((res) => res[0]);
  if (!user) throw new Error("User not found");

  return await db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, user.id))
    .then((res) => res[0]);
}

export async function improveWithAI({ current, type }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Find user by clerkUserId
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .then((res) => res[0]);
  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer, improve the following ${type} description for a ${user.industry} professional.
    Make it more impactful, quantifiable, and aligned with industry standards.
    Current content: "${current}"

    Requirements:
    1. Use action verbs
    2. Include metrics and results where possible
    3. Highlight relevant technical skills
    4. Keep it concise but detailed
    5. Focus on achievements over responsibilities
    6. Use industry-specific keywords
    
    Format the response as a single paragraph without any additional text or explanations.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const improvedContent = response.text().trim();
    return improvedContent;
  } catch (error) {
    console.error("Error improving content:", error);
    throw new Error("Failed to improve content");
  }
}

"use server";

import { db } from "@/lib/index";
import { users, coverLetters } from "@/lib/schema";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { eq } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCoverLetter(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.select().from(users).where(eq(users.clerkUserId, userId)).then(res => res[0]);

  if (!user) throw new Error("User not found");

  const prompt = `
    Write a professional cover letter for a ${data.jobTitle} position at ${data.companyName
    }.
    
    About the candidate:
    - Industry: ${user.industry}
    - Years of Experience: ${user.experience}
    - Skills: ${user.skills?.join(", ")}
    - Professional Background: ${user.bio}
    
    Job Description:
    ${data.jobDescription}
    
    Requirements:
    1. Use a professional, enthusiastic tone
    2. Highlight relevant skills and experience
    3. Show understanding of the company's needs
    4. Keep it concise (max 400 words)
    5. Use proper business letter formatting in markdown
    6. Include specific examples of achievements
    7. Relate candidate's background to job requirements
    
    Format the letter in markdown.
  `;

  try {
    const result = await model.generateContent(prompt);
    const content = result.response.text().trim();

    const [coverLetter] = await db.insert(coverLetters).values({
      content,
      jobDescription: data.jobDescription,
      companyName: data.companyName,
      jobTitle: data.jobTitle,
      status: "completed",
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    return coverLetter;
  } catch (error) {
    console.error("Error generating cover letter:", error.message);
    throw new Error("Failed to generate cover letter");
  }
}

export async function getCoverLetters() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.select().from(users).where(eq(users.clerkUserId, userId)).then(res => res[0]);

  if (!user) throw new Error("User not found");

  return await db.select().from(coverLetters)
    .where(eq(coverLetters.userId, user.id))
    .orderBy(coverLetters.createdAt, "desc");
}

export async function getCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.select().from(users).where(eq(users.clerkUserId, userId)).then(res => res[0]);

  if (!user) throw new Error("User not found");

  return await db.select().from(coverLetters)
    .where(eq(coverLetters.id, id), eq(coverLetters.userId, user.id))
    .then(res => res[0]);
}

export async function deleteCoverLetter(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.select().from(users).where(eq(users.clerkUserId, userId)).then(res => res[0]);

  if (!user) throw new Error("User not found");

  return await db.delete(coverLetters)
    .where(eq(coverLetters.id, id), eq(coverLetters.userId, user.id))
    .returning();
}

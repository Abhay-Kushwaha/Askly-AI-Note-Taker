"use server";

import { db } from "@/lib/index";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateUser(data) {
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
    // Update the user
    const [updatedUser] = await db
      .update(users)
      .set({
        industry: data.industry,
        experience: data.experience,
        bio: data.bio,
        skills: data.skills,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id))
      .returning();

    revalidatePath("/");
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Failed to update profile");
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Find user by clerkUserId
  const user = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .then((res) => res[0]);
  if (!user) throw new Error("User not found");

  return {
    isOnboarded: !!user.industry,
  };
}

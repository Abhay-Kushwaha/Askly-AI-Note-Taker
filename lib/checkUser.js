import { currentUser } from "@clerk/nextjs/server";
import { db } from "./index";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    // Check if user exists
    const loggedInUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, user.id))
      .then((res) => res[0]);
    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    // Insert new user
    const [newUser] = await db
      .insert(users)
      .values({
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/resume(.*)",
  "/quiz(.*)",
  "/ai-cover-letter(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // 🛡️ If user is not authenticated AND trying to access a protected route
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url }); // <- Preserve the URL to come back after login
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // All routes EXCEPT static assets and Next.js internals
    "/((?!_next|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|css|js|ts|json|txt|pdf|docx?|xlsx?|woff2?|ttf|eot)).*)",
    // Also always match API and trpc routes
    "/(api|trpc)(.*)",
  ],
};

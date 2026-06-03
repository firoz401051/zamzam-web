import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Note: Monitoring initialization is disabled in proxy to prevent edge runtime issues
// and infinite error loops. Monitoring will be initialized in API routes instead.

const isProtectedRoute = createRouteMatcher([
  "/user(.*)",
  "/admin(.*)",
  "/employee(.*)",
  "/checkout(.*)",
  "/success(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { env } from "./lib/env";
const aj = arcjet({
  key: env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
          "CATEGORY:SEARCH_ENGINE",
          "CATEGORY:MONITOR",
          "CATEGORY:PREVIEW"
      ],
    }),
  ],
});
async function authMiddleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if(!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}
export const config = {
  // matcher tells Next.js which routes to run the middleware on.
  // This runs the middleware on all routes except for static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async (request:NextRequest) => {
    if (request.nextUrl.pathname.startsWith("/admin")) {
        return authMiddleware(request)
    }
    return NextResponse.next()
});
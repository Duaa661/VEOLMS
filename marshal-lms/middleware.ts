import { NextResponse } from "next/server";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { env } from "./lib/env";

const aj = arcjet({
  key: env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        "STRIPE_WEBHOOK",
      ],
    }),
  ],
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};

export default createMiddleware(aj, async () => {
  return NextResponse.next();
});
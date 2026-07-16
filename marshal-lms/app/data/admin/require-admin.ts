import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {cache} from 'react'
import { auth } from "@/lib/auth";

export  const requireAdmin=cache(async()=> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/not-admin");
  }

  return session;
})
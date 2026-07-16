"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, {fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
       fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function deleteCourse(
  courseId: string
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
      //  Rate limiting only some request allow
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      }

      return {
        status: "error",
        message: "Looks like you are a malicious user.",
      };
    }

    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "Course deleted successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: "Failed to delete course.",
    };
  }
}
"use server";

import { requireAdmin } from "@/app/data/admin/require-user";
import arcjet, {  fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";


const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max:5
  })
)
export async function CreateCourses(
  data: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
        const req=await request()
        const decision = await aj.protect(req, {
          fingerprint: session?.user.id as string
        })
    if (decision.isDenied()) {
      if (!decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Looks like you are a malicous user"
        }
      }
      else {
        return {
          status: "error",
          message: "You are a bot! if this is a mistake correct our support"
        }
      }
        }
    if (!session) {
      return {
        status: "error",
        message: "Unauthorized",
      };
    }

    // Validate form data
    const validation = courseSchema.safeParse(data);

    if (!validation.success) {
      return {
        status: "error",
        message: "Invalid form data",
      };
    }

    await prisma.course.create({
      data: {
        ...validation.data,
        userId: session.user.id,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to create course",
    };
  }
}
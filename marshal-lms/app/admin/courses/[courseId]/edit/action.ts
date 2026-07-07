"use server"

import { requireAdmin } from "@/app/data/admin/require-user"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { number, string } from "zod";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: []
  })
).withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5
  })
)
export async function editCourse(data:CourseSchemaType,courseId:string): Promise<ApiResponse> {
    const user = await requireAdmin();
    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint:user.user.id
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
    
        const result = courseSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message:"Invalid data"
            }
        }
        await prisma.course.update({
            where: {
                id: courseId,
                userId:user.user.id
            },
            data: {
                ...result.data
            }
        })
        return {
            status: 'success',
            message:'Course updated Sucessfully'
        }
    } catch (error) {
        return {
            status: 'success',
            message:'Failed to update Course'
        }
    }
}
export async function reorderforLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  try {
    if (!lessons.length) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }

    // // Optional: Verify the chapter exists
    // const chapter = await prisma.chapter.findUnique({
    //   where: {
    //     id: chapterId,
    //   },
    //   select: {
    //     id: true,
    //   },
    // });

    // if (!chapter) {
    //   return {
    //     status: "error",
    //     message: "Chapter not found",
    //   };
    // }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error) {
    console.error("Lesson reorder error:", error);

    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}
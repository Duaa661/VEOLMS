"use server"

import { requireAdmin } from "@/app/data/admin/require-user"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";

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
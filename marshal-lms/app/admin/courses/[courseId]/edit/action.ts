"use server"

import { requireAdmin } from "@/app/data/admin/require-user"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";

export async function editCourse(data:CourseSchemaType,courseId:string): Promise<ApiResponse> {
    const user = await requireAdmin();
    try {
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
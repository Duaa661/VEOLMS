"use server"

import { requireUser } from "@/app/data/user/require-user"
import { prisma } from "@/lib/db"
import { ApiResponse } from "@/lib/type"
import { revalidatePath } from "next/cache"

export async function markLessonComplete(
    lessonId: string,
    slug: string
): Promise<ApiResponse> {

    try {
        const session = await requireUser()

        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: session.id,
                    lessonId: lessonId,
                },
            },
            update: {
                completed: true,
            },
            create: {
                lessonId: lessonId,
                userId: session.id,
                completed: true,
            },
        })

        revalidatePath(`/dashboard/${slug}`)

        return {
            status: "success",
            message: "Progress updated",
        }

    } catch (error) {
        console.error("Mark lesson complete error:", error)

        return {
            status: "error",
            message: "Failed to mark lesson as complete",
        }
    }
}
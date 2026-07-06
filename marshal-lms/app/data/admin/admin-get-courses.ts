import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-user";

export async function admingetCourses() {
    await requireAdmin()
    const data = await prisma.course.findMany({
        orderBy: {
            createdAt:'desc'
        },
        select: {
            id: true,
            title: true,
            smallDescription: true,
            duration: true,
            level: true,
            status: true,
            price: true,
            fileKey: true,
            category:true,
            slug: true,
        }
    })
    return data;
}


export type AdminCourseType=Awaited<ReturnType<typeof admingetCourses>>[0]
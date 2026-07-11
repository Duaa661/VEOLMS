import { prisma } from "@/lib/db";

export async function getAllCourses() {
  return await prisma.course.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      price: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
    },
  });
}

export type PublicCourseType = Awaited<
  ReturnType<typeof getAllCourses>
>[number];
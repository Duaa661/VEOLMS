import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function getSingleCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      description: true,
      smallDescription: true,
      price: true,
      fileKey: true,
      level: true,
      duration: true,
      category: true,
      chapter: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },

            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
    // wrong slug
    if (!course) {
        return notFound()
    }
    return course
}

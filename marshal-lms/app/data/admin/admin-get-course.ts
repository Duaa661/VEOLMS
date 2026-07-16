import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export async function AdminGetCourses(id: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      status: true,
      slug: true,
      smallDescription: true,
      category: true,

      chapter: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          position: true,

          lessons: {
            orderBy: {
              position: "asc",
            },
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              videoUrl: true,
              position: true,
            },
          },
        },
      },
    },
  });
  if (!data) {
    notFound();
  }

  return data;
}

export type AdminCourseSingularType = NonNullable<
  Awaited<ReturnType<typeof AdminGetCourses>>
>;
import { prisma } from "@/lib/db";
import { requireUser } from "./require-user";

export default async function getEnrolledCourses() {
  const user = await requireUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          title: true,
          smallDescription: true,
          fileKey: true,
          price: true,
          level: true,
          slug: true,
          duration: true,
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
                  position: true,

                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}

export type EnrolledCourseType =
  Awaited<ReturnType<typeof getEnrolledCourses>>[0];
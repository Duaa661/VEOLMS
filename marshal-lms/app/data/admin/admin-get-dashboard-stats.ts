import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-user";

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [
    totalSignup,
    totalCustomers,
    totalCourses,
    totalLessons,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        enrollment: {
          some: {},
        },
      },
    }),

    // Total courses
    prisma.course.count(),

    // Total lessons
    prisma.lesson.count(),
  ]);

  return {
    totalSignup,
    totalCustomers,
    totalCourses,
    totalLessons,
  };
}
import "server-only"
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";

const adminGetEnrollmentStats = async () => {
  await requireAdmin();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const enrollments = await prisma.enrollment.findMany({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // Group by date
  const enrollmentMap = new Map<string, number>();

  enrollments.forEach((enrollment) => {
    const date = enrollment.createdAt.toISOString().split("T")[0];

    enrollmentMap.set(date, (enrollmentMap.get(date) ?? 0) + 1);
  });

  // Fill missing dates with 0 enrollments
  const chartData = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const formattedDate = date.toISOString().split("T")[0];

    chartData.push({
      date: formattedDate,
      enrollments: enrollmentMap.get(formattedDate) ?? 0,
    });
  }

  return chartData;
};

export default adminGetEnrollmentStats;
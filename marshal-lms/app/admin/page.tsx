import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import { adminGetDashboardStats } from "../data/admin/admin-get-dashboard-stats";
import adminGetEnrollmentStats from "../data/admin/admin-get-enrollement-stats";
import { adminGetRecentCourses } from "../data/admin/admin-get-recent-courses";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import EmptyState from "@/components/general/EmptyState";
import {
  AdminCourseCard,
  AdminCourseCardSkelton,
} from "./courses/_components/AdminCourseCard";
import { Suspense } from "react";

export default async function AdminIndexPage() {
  const stats = await adminGetDashboardStats();

  const enrollmentStats = await adminGetEnrollmentStats();

  return (
    <>
      <SectionCards stats={stats} />

      <ChartAreaInteractive data={enrollmentStats} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Recent Courses
          </h2>

          <Link
            href="/admin/courses"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            View All Courses
          </Link>
        </div>

        <Suspense fallback={<RenderRecentCourseSkeltonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
}


async function RenderRecentCourses() {
  const data = await adminGetRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create new Course"
        description="You don't have any courses. Create some to see them here."
        title="You don't have any courses yet!"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {data.map((course) => (
        <AdminCourseCard
          key={course.id}
          data={course}
        />
      ))}
    </div>
  );
}


function RenderRecentCourseSkeltonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCourseCardSkelton
          key={index}
        />
      ))}
    </div>
  );
}
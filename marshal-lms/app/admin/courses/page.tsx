import { admingetCourses } from "@/app/data/admin/admin-get-courses";
import EmptyState from "@/components/general/EmptyState";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";
import {
  AdminCourseCard,
  AdminCourseCardSkelton,
} from "./_components/AdminCourseCard";
import { CourseLevel, CourseStatus } from "@prisma/client";

type CourseItem = {
  id: string;
  title: string;
  smallDescription: string;
  fileKey: string;
  price: number;
  duration: number;
  level: CourseLevel;
  category: string;
  slug: string;
  status: CourseStatus;
};
const Page = () => {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Courses</h1>

        <Link className={buttonVariants()} href="/admin/courses/create">
          Create Course
        </Link>
      </div>

      <div>
        <Suspense fallback={<AdminCourseCardSkeltonLayout />}>
          <RenderCourses />
        </Suspense>
      </div>
    </>
  );
};

export default Page;

async function RenderCourses() {
  const data: CourseItem[] = await admingetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState
          title="No Courses Found"
          description="Create a new Course get started"
          buttonText="Create Course"
          href="/admin/courses/create"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
          {data.map((course: CourseItem) => (
            <AdminCourseCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminCourseCardSkeltonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index: number) => (
        <AdminCourseCardSkelton key={index} />
      ))}
    </div>
  );
}
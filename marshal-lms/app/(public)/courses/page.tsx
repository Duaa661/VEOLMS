import {
  getAllCourses,
  type PublicCourseType,
} from "@/app/data/course/get-all-courses";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/PublicCourseCard";
import { Suspense } from "react";

export default function PublicCoursesRoute() {
  return (
    <div className="mt-8">
      <div className="mb-10 flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
          Explore Courses
        </h1>

        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>

      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const courses: PublicCourseType[] = await getAllCourses();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course: PublicCourseType) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
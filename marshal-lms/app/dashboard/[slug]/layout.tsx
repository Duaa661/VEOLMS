import { ReactNode } from "react";
import CourseSidebar from "../_components/CourseSidebar";
import { GetCourseSidebardata } from "@/app/data/course/get-course-sidebar-data";

interface Props {
  params: Promise<{ slug: string }>;
  children: ReactNode;
}

export default async function CourseLayout({
  children,
  params,
}: Props) {
  const { slug } = await params;
  const course = await GetCourseSidebardata(slug);

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Course Sidebar */}
      <aside className="w-full lg:w-80 xl:w-96 border-b lg:border-b-0 lg:border-r border-border shrink-0">
        <CourseSidebar course={course.course} />
      </aside>

      {/* Lesson Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
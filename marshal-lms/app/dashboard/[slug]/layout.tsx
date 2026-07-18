import { ReactNode } from "react";
import CourseSidebar from "../_components/CourseSidebar";
import { GetCourseSidebardata } from "@/app/data/course/get-course-sidebar-data";
import MobileCourseSidebar from "../_components/MobileCourseSidebar";
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
    <div className="h-full">

      {/* Desktop */}
      <div className="hidden lg:flex h-full">

        <aside className="w-80 xl:w-96 border-r border-border shrink-0">
          <CourseSidebar course={course.course} />
        </aside>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>

      </div>


      {/* Mobile */}
      <div className="lg:hidden h-full">

        <MobileCourseSidebar course={course.course}>
          {children}
        </MobileCourseSidebar>

      </div>

    </div>
  );
}
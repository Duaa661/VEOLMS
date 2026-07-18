"use client";

import { ReactNode } from "react";
import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import CourseSidebar from "./CourseSidebar";
import { CouseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";


interface Props {
  course: CouseSidebarDataType["course"];
  children: ReactNode;
}


export default function MobileCourseSidebar({
  course,
  children,
}: Props) {

  return (
    <div className="flex flex-col h-full">


      {/* Mobile Header */}
      <div className="flex items-center border-b p-3 shrink-0">

        <Sheet>

          <SheetTrigger asChild>

            <button
              className="flex items-center gap-2 text-sm font-medium"
            >
              <Menu className="size-5" />
              Lessons
            </button>

          </SheetTrigger>


          <SheetContent
            side="left"
            className="w-80 p-0"
          >

            <SheetHeader className="p-4 border-b">
              <SheetTitle>
                {course.title}
              </SheetTitle>
            </SheetHeader>


            <div className="h-[calc(100vh-65px)]">
              <CourseSidebar course={course}/>
            </div>


          </SheetContent>


        </Sheet>

      </div>


      {/* Lesson Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>


    </div>
  );
}
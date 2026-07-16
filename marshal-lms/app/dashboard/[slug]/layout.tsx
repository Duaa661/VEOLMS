import { ReactNode } from "react";
import CourseSidebar from "../_components/CourseSidebar";
import { GetCourseSidebardata } from "@/app/data/course/get-course-sidebar-data";

interface isAppProps{
    params: Promise<{ slug: string }>
    children:ReactNode
}
export default async function CourseLayout({ children, params }: isAppProps) {
    const { slug } = await params;
    const course = await GetCourseSidebardata(slug)
    
    return (
        <div className="flex flex-1">
            {/* Sidebar 30% */}
            <div className="w-90 border-r border-border shrink-0">
                <CourseSidebar course={course.course}/>
            </div>
            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
                { children}
            </div>
    </div>
)
}
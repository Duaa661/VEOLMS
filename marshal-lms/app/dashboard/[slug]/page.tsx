import { GetCourseSidebardata } from "@/app/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";


interface isAppProps{
    params:Promise<{slug:string}>
}
export default async function CoursesSlugRoute({ params}:isAppProps) {
    const { slug } = await params;
    const course = await GetCourseSidebardata(slug);
    const firstChapter = course.course.chapter[0];
    const firstLesson = firstChapter.lessons[0]
    if(firstLesson){
        redirect(`/dashboard/${slug}/${firstLesson.id}`)
    }
    return (
        <div className="flex items-center justify-center h-full text-center">
            <p className="text-2xl font-bold mb-2">No lesson Available</p>
            <p className="text-muted-foreground">This course does not have any lesson yet</p>
        </div>
    )
}


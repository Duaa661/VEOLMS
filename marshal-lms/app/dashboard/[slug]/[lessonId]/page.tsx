import { getLessonContent } from "@/app/data/course/get-lesson-content"
import { CourseContent } from "../../_components/CourseContent"

type Params=Promise<{lessonId:string}>
export default async function LessonCreationPage({ params }: { params: Params }) {
    // get the lesson id in url
    const {lessonId}= await  params
    const data=await getLessonContent(lessonId)
    return (
        <div>
            <CourseContent data={data}/>
        </div>
    )
}
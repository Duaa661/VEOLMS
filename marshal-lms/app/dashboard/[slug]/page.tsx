import { CourseContent } from "../_components/CourseContent";
import { getLessonContent } from "@/app/data/course/get-lesson-content";

interface Props {
  params: Promise<{
    slug: string;
    lessonId: string;
  }>;
}

export default async function CoursesSlugRoute({ params }: Props) {
  const { lessonId } = await params;

  const data = await getLessonContent(lessonId);

  return (
    <div className="flex h-full flex-col">
      <CourseContent data={data} />
    </div>
  );
}

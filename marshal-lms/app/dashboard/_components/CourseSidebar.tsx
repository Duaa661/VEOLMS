"use client"
import { CouseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import LessonItem from "./LessonItem";
import { usePathname } from "next/navigation";

interface Props {
  course: CouseSidebarDataType["course"];
}

const CourseSidebar = ({ course }: Props) => {
  const totalLessons = course.chapter.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0
    );
    const pathname = usePathname()
    const currentLessonId = pathname.split("/").pop();

  // Replace with actual completed lessons from your database
  const completedLessons = 0;

  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <Play className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="truncate text-base font-semibold">
              {course.title}
            </h1>

            <p className="mt-1 truncate text-xs text-muted-foreground">
              {course.category}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {completedLessons}/{totalLessons} lessons
            </span>
          </div>

          <Progress value={progress} className="h-1.5" />

          <p className="text-xs text-muted-foreground">
            {Math.round(progress)}% complete
          </p>
        </div>
      </div>

      {/* Chapters & Lessons */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {course.chapter.map((chapter,index) => (
            <Collapsible key={chapter.id} defaultOpen={ index==0}>
                <CollapsibleTrigger asChild>
                    <Button variant="outline"
                        className="w-full p-3 h-auto flex items-center gap-2">
                        <div className="shrink-0">
                            <ChevronDown className="size-4 text-primary"/>
                        </div>
                        <div className="flex-1 text-left min-w-0">
                            <p className="font-semibold text-sm truncate text-foreground">
                                { chapter.position}:{chapter.title}
                            </p>
                            <p className="text-[11px]">{ chapter.lessons.length}.lessons</p>
                        </div>
                    </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
                    {
                        chapter.lessons.map((lesson) => (
                            <LessonItem key={lesson.id} lesson={lesson} slug={course.slug} isActive={currentLessonId===lesson.id} />
                        ))
                    }
                </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
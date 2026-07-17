import { useMemo } from "react";
import { CouseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";


export function useCourseProgress(
  courseData: CouseSidebarDataType["course"]
) {

  return useMemo(() => {

    let totalLessons = 0;
    let completedLessons = 0;


    courseData.chapter.forEach((chapter) => {

      chapter.lessons.forEach((lesson) => {

        totalLessons++;


        const isCompleted = lesson.lessonProgress?.some(
          (progress) =>
            progress.lessonId === lesson.id &&
            progress.completed
        );


        if (isCompleted) {
          completedLessons++;
        }

      });

    });


    const progressPercentage =
      totalLessons > 0
        ? (completedLessons / totalLessons) * 100
        : 0;



    return {
      totalLessons,
      completedLessons,
      progressPercentage,
    };


  }, [courseData]);

}
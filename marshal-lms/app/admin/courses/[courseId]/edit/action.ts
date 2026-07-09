"use server"

import { requireAdmin } from "@/app/data/admin/require-user"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import { chapterSchema, ChapterSchemaType, courseSchema, CourseSchemaType, lessonSchema } from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { number, string } from "zod";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: []
  })
).withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5
  })
)
export async function editCourse(data:CourseSchemaType,courseId:string): Promise<ApiResponse> {
    const user = await requireAdmin();
    try {
        const req = await request();
        const decision = await aj.protect(req, {
            fingerprint:user.user.id
        })
        if (decision.isDenied()) {
      if (!decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Looks like you are a malicous user"
        }
      }
      else {
        return {
          status: "error",
          message: "You are a bot! if this is a mistake correct our support"
        }
      }
        }
    
        const result = courseSchema.safeParse(data);
        if (!result.success) {
            return {
                status: "error",
                message:"Invalid data"
            }
        }
        await prisma.course.update({
            where: {
                id: courseId,
                userId:user.user.id
            },
            data: {
                ...result.data
            }
        })
        return {
            status: 'success',
            message:'Course updated Sucessfully'
        }
    } catch (error) {
        return {
            status: 'success',
            message:'Failed to update Course'
        }
    }
}
// reoder lesson with spacific postion
export async function reorderforLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
   await requireAdmin()
  try {
    if (!lessons.length) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: lesson.position,
        },
      })
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error) {
    console.error("Lesson reorder error:", error);

    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}
// reoder chapter with spacific postion
export async function reorderChapter(
  courseId: string,
  chapters: { id: string; position:number}[]
): Promise<ApiResponse>{
  await requireAdmin()
  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: 'error',
        message:'No chapters provided for reordering'
      }
    }
    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId:courseId,
        },
        data: {
          position: chapter.position,
        },
      })
    );
   await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter reordered successfully",
    };
   
  } catch (error) {
    return {
      status: 'error',
      message: "Failed to reoder chapters"
    }
  }
}

// Create a new Chapter function
export async function createChapter(values:ChapterSchemaType): Promise<ApiResponse>{
  try {
    await requireAdmin()
    const result = chapterSchema.safeParse(values)
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data"
      }
    }

    await prisma.$transaction(async (tx) => {
      const maxpos = await tx.chapter.findFirst({
        where: {
          courseId:result.data.courseId
        },
        select: {
          position:true
        },
        orderBy: {
          position:"desc"
        }
      })

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position:(maxpos?.position ?? 1)+1
        }
      })
    })
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

    return {
      status: 'success',
      message:"Chapter Created Sucessfully"
    }
  } catch (error) {
    return {
      status: 'error',
      message:"Failed to create Chapter"
    }
      
  }
}

// Create a new Lesson
export async function createLesson(values:ChapterSchemaType): Promise<ApiResponse>{
  try {
    await requireAdmin()
    const result = lessonSchema.safeParse(values)
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data"
      }
    }

    await prisma.$transaction(async (tx) => {
      const maxpos = await tx.lesson.findFirst({
        where: {
          chapterId:result.data.chapterId
        },
        select: {
          position:true
        },
        orderBy: {
          position:"desc"
        }
      })

      await tx.lesson.create({
        data: {
          title: result.data.name,
          description: result.data.description,
          videoKey: result.data.videoUrl,
          thumbnailKey: result.data.thumbnailKey,
          chapterId:result.data.chapterId,
          position:(maxpos?.position ?? 0)+1
        }
      })
    })
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`)

    return {
      status: 'success',
      message:"Lesson Created Sucessfully"
    }
  } catch (error) {
    return {
      status: 'error',
      message:"Failed to create Chapter"
    }
      
  }
}

// Delete a Lesson
export async function deleteLesson({
  chapterId,
  courseId,
  lessonId,
}: {
  chapterId: string;
  courseId: string;
  lessonId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // Verify chapter belongs to the course
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
      select: {
        lessons: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position:true,
          }
        },
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found.",
      };
    }

    // Verify lesson exists
    const lesson = chapter.lessons.find((l) => l.id === lessonId);

    if (!lesson) {
      return {
        status: "error",
        message: "Lesson not found.",
      };
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: {
        id: lessonId,
        chapterId:chapterId
      },
    });

    // Reorder remaining lessons
    const remainingLessons = chapter.lessons.filter(
      (l) => l.id !== lessonId
    );

    await prisma.$transaction(
      remainingLessons.map((lesson, index) =>
        prisma.lesson.update({
          where: {
            id: lesson.id,
          },
          data: {
            position: index + 1,
          },
        })
      )
    );
    revalidatePath(`/admin/courses/${courseId}/edit`)
    return {
      status: "success",
      message: "Lesson deleted and postion reordered successfully.",
    };
    
  } catch (error) {
    return {
      status: "error",
      message: "Failed to delete lesson.",
    };
  }
}
// Delete a chapter
export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // Verify course and get all chapters
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapter: {
          orderBy: {
            position: "asc",
          },
          select: {
            id: true,
            position: true,
          },
        },
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    // Verify chapter exists
    const chapter = course.chapter.find((c) => c.id === chapterId);

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found.",
      };
    }

    // Delete chapter
    await prisma.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    // Reorder remaining chapter
    const remainingChapters = course.chapter.filter(
      (c) => c.id !== chapterId
    );

    await prisma.$transaction(
      remainingChapters.map((chapter, index) =>
        prisma.chapter.update({
          where: {
            id: chapter.id,
          },
          data: {
            position: index + 1,
          },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted and positions reordered successfully.",
    };
  } catch (error) {
    console.error(error);

    return {
      status: "error",
      message: "Failed to delete chapter.",
    };
  }
}
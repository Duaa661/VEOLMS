"use server";

import { requireAdmin } from "@/app/data/admin/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
type LessonItem = {
  id: string;
  position: number;
};

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    }),
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    }),
  );
export async function editCourse(
  data: CourseSchemaType,
  courseId: string,
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
    });

    if (decision.isDenied()) {
      if (!decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Looks like you are a malicous user",
        };
      } else {
        return {
          status: "error",
          message: "You are a bot! if this is a mistake correct our support",
        };
      }
    }

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Course updated Sucessfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      status: "success",
      message: "Failed to update Course",
    };
  }
}
// reoder lesson with spacific postion
export async function reorderforLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    // Keep parameter to preserve function signature
    void chapterId;

    if (!lessons.length) {
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }

    const updates = lessons.map(
      (lesson: { id: string; position: number }) =>
        prisma.lesson.update({
          where: {
            id: lesson.id,
          },
          data: {
            position: lesson.position,
          },
        }),
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error: unknown) {
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
  chapters: { id: string; position: number }[],
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }

    const updates = chapters.map(
      (chapter: { id: string; position: number }) =>
        prisma.chapter.update({
          where: {
            id: chapter.id,
            courseId: courseId,
          },
          data: {
            position: chapter.position,
          },
        }),
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter reordered successfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      status: "error",
      message: "Failed to reoder chapters",
    };
  }
}
// Create a new Chapter function
export async function createChapter(
  values: ChapterSchemaType,
): Promise<ApiResponse> {
  try {
    await requireAdmin();

    const result = chapterSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    const maxpos = await prisma.chapter.findFirst({
      where: {
        courseId: result.data.courseId,
      },
      select: {
        position: true,
      },
      orderBy: {
        position: "desc",
      },
    });

    await prisma.$transaction([
      prisma.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (maxpos?.position ?? 0) + 1,
        },
      }),
    ]);

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter Created Sucessfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      status: "error",
      message: "Failed to create Chapter",
    };
  }
}

// Create a new Lesson
export async function createLesson(
  values: LessonSchemaType,
): Promise<ApiResponse> {
  try {
    await requireAdmin();

    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid Data",
      };
    }

    const maxpos = await prisma.lesson.findFirst({
      where: {
        chapterId: result.data.chapterId,
      },
      select: {
        position: true,
      },
      orderBy: {
        position: "desc",
      },
    });

    await prisma.lesson.create({
      data: {
        title: result.data.name,
        description: result.data.description,
        videoUrl: result.data.videoUrl,
        thumbnailKey: result.data.thumbnailKey,
        chapterId: result.data.chapterId,
        position: (maxpos?.position ?? 0) + 1,
      },
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson Created Sucessfully",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      status: "error",
      message: "Failed to create Chapter",
    };
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
            position: true,
          },
        },
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found.",
      };
    }

    const lesson = chapter.lessons.find(
      (l: { id: string; position: number }) => l.id === lessonId,
    );

    if (!lesson) {
      return {
        status: "error",
        message: "Lesson not found.",
      };
    }

    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    const remainingLessons: { id: string; position: number }[] =
      chapter.lessons.filter(
        (l: { id: string; position: number }) => l.id !== lessonId,
      );

    const updates = remainingLessons.map(
      (lesson: { id: string; position: number }, index: number) =>
        prisma.lesson.update({
          where: {
            id: lesson.id,
          },
          data: {
            position: index + 1,
          },
        }),
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted and postion reordered successfully.",
    };
  } catch (error: unknown) {
    console.error(error);

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
    const chapter = course.chapter.find(
      (c: { id: string; position: number }): boolean =>
        c.id === chapterId,
    );

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

    // Reorder remaining chapters
    const remainingChapters: { id: string; position: number }[] =
      course.chapter.filter(
        (c: { id: string; position: number }): boolean =>
          c.id !== chapterId,
      );

    const updates = remainingChapters.map(
      (
        chapter: { id: string; position: number },
        index: number,
      ) =>
        prisma.chapter.update({
          where: {
            id: chapter.id,
          },
          data: {
            position: index + 1,
          },
        }),
    );

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted and positions reordered successfully.",
    };
  } catch (error: unknown) {
    console.error(error);

    return {
      status: "error",
      message: "Failed to delete chapter.",
    };
  }
}
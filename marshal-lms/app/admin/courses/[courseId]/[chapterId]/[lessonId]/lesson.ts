"use server"

import { requireAdmin } from "@/app/data/admin/require-user"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/type"
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas"

export async function updateLesson(
  values: LessonSchemaType,
  lessonId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(values);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    const {
      name,
      description,
      thumbnailKey,
      videoUrl,
    } = result.data;

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: name,
        description,
        thumbnailKey,
        videoUrl,
      },
    });

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error) {
    console.error("Update Lesson Error:", error);

    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
}
import { z } from "zod";

export const courseLevels = [
  "Beginner",
  "Intermediate",
  "Advanced",
] as const;

export const courseStatus = [
  "Draft",
  "Published",
  "Archived",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, {
      message: "Title must be at least 3 characters long",
    })
    .max(100, {
      message: "Title must be at most 100 characters long",
    }),

  slug: z
    .string()
    .trim()
    .min(3, {
      message: "Slug must be at least 3 characters long",
    })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message:
        "Slug can only contain lowercase letters, numbers and hyphens",
    }),

  smallDescription: z
    .string()
    .trim()
    .min(3, {
      message: "Small description must be at least 3 characters long",
    })
    .max(200, {
      message: "Small description must be at most 200 characters long",
    }),

  description: z
    .string()
    .trim()
    .min(10, {
      message: "Course description is required",
    }),

  // Match this with your form field
  thumbnail: z.string().min(1, {
    message: "Course thumbnail is required",
  }),

  category: z
    .string()
    .trim()
    .min(1, {
      message: "Category is required",
    }),

  price: z.coerce
    .number({
      invalid_type_error: "Price is required",
    })
    .min(1, {
      message: "Price must be greater than 0",
    }),

  duration: z.coerce
    .number({
      invalid_type_error: "Duration is required",
    })
    .min(1, {
      message: "Duration must be at least 1 hour",
    })
    .max(500, {
      message: "Duration must be at most 500 hours",
    }),

  level: z.enum(courseLevels, {
    error: "Please select a course level",
  }),

  status: z.enum(courseStatus, {
    error: "Please select a course status",
  }),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;
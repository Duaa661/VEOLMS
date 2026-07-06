"use client";

import React, { useTransition } from "react";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/uploader";

import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";

import { editCourse } from "../action";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

interface EditCourseFormProps {
  data: AdminCourseSingularType;
}

export default function EditCourseForm({ data }: EditCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    mode: "onChange",
    defaultValues: {
      title: data.title ?? "",
      slug: data.slug ?? "",
      description: data.description ?? "",
      smallDescription: data.smallDescription ?? "",
      fileKey: data.fileKey ?? "",
      category: data.category as CourseSchemaType["category"],
      level: data.level,
      status: data.status,
      duration: data.duration,
      price: data.price,
    },
  });
  console.log(data.description);
  const onSubmit = (values: CourseSchemaType) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        editCourse(values, data.id),
      );

      if (error) {
        toast.error("Something went wrong.");
        return;
      }

      if (!result) {
        toast.error("No response received.");
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);

        router.push("/admin/courses");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Title & Slug */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Course Title
          </label>

          <input
            id="title"
            aria-invalid={!!form.formState.errors.title}
            placeholder="Complete React & Next.js Bootcamp"
            {...form.register("title")}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />

          <p className="text-sm text-destructive">
            {form.formState.errors.title?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="slug"
              placeholder="complete-react-nextjs-bootcamp"
              {...form.register("slug")}
              className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
            />

            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const title = form.getValues("title");

                if (!title) return;

                form.setValue(
                  "slug",
                  slugify(title, {
                    lower: true,
                    strict: true,
                    trim: true,
                  }),
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                );
              }}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </Button>
          </div>

          <p className="text-sm text-destructive">
            {form.formState.errors.slug?.message}
          </p>
        </div>
      </div>

      {/* Short Description */}

      <div className="space-y-2">
        <label htmlFor="smallDescription" className="text-sm font-medium">
          Short Description
        </label>

        <textarea
          id="smallDescription"
          rows={3}
          placeholder="A short summary displayed on the course card."
          {...form.register("smallDescription")}
          className="w-full resize-none rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        />

        <p className="text-sm text-destructive">
          {form.formState.errors.smallDescription?.message}
        </p>
      </div>

      {/* Description */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Course Description</label>

        <Controller
          control={form.control}
          name="description"
          render={({ field }) => <RichTextEditor field={field} />}
        />
        <p className="text-sm text-destructive">
          {form.formState.errors.description?.message}
        </p>
      </div>

      {/* Thumbnail */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Course Thumbnail</label>

        <Controller
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <Uploader value={field.value} onChange={field.onChange} />
          )}
        />

        <p className="text-sm text-destructive">
          {form.formState.errors.fileKey?.message}
        </p>
      </div>

      {/* Category & Level */}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>

          <input
            placeholder="Web Development"
            {...form.register("category")}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />

          <p className="text-sm text-destructive">
            {form.formState.errors.category?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Course Level</label>

          <select
            {...form.register("level")}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <p className="text-sm text-destructive">
            {form.formState.errors.level?.message}
          </p>
        </div>
      </div>

      {/* Price & Duration */}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Price (₹)</label>

          <input
            type="number"
            min={0}
            {...form.register("price", {
              valueAsNumber: true,
            })}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />

          <p className="text-sm text-destructive">
            {form.formState.errors.price?.message}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration (Hours)</label>

          <input
            type="number"
            min={1}
            {...form.register("duration", {
              valueAsNumber: true,
            })}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
          />

          <p className="text-sm text-destructive">
            {form.formState.errors.duration?.message}
          </p>
        </div>
      </div>

      {/* Status */}

      <div className="space-y-2">
        <label className="text-sm font-medium">Status</label>

        <select
          {...form.register("status")}
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>

        <p className="text-sm text-destructive">
          {form.formState.errors.status?.message}
        </p>
      </div>

      {/* Submit */}

      <div className="flex justify-end">
        <Button size="lg" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Update Course
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import slugify from "slugify";
import { Controller } from "react-hook-form";
import { ArrowLeft, FileDiff, Loader2, PlusIcon, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/uploader";
import { tryCatch } from "@/hooks/try-catch";
import { CreateCourses } from "./action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CourseCreationPage() {
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [Pending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      fileKey: "",
      price: 0,
      duration: 0,
      level: "Beginner",
      category: "",
      status: "Draft",
      slug: "",
      smallDescription: "",
    },
  });

  function onSubmit(values: CourseSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateCourses(values));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (!result) return;

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        router.push("/admin/courses");
      } else {
        toast.error(result.message);
      }
    });
  }
  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>

        <h1 className="text-2xl font-bold">Create Courses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            Provide basic information about the course
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            {/* Course Title & Slug */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Course Title
                </label>

                <input
                  id="title"
                  {...form.register("title")}
                  placeholder="Complete React & Next.js Bootcamp"
                  className="w-full rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
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
                    {...form.register("slug")}
                    placeholder="complete-react-nextjs-bootcamp"
                    className="w-full flex-1 rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full sm:w-auto shrink-0"
                    onClick={() => {
                      const title = form.getValues("title");

                      if (!title) return;

                      const generatedSlug = slugify(title, {
                        lower: true,
                        strict: true,
                        trim: true,
                      });

                      form.setValue("slug", generatedSlug, {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
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
                {...form.register("smallDescription")}
                placeholder="A short summary displayed on the course card."
                className="w-full resize-none rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
              />

              <p className="text-sm text-destructive">
                {form.formState.errors.smallDescription?.message}
              </p>
            </div>

            {/* Course Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Course Description
              </label>
              <Controller
                control={form.control}
                name="description"
                render={({ field }) => <RichTextEditor field={field} />}
              />
              <p className="text-sm text-destructive">
                {form.formState.errors.description?.message}
              </p>
            </div>

            {/* Course Thumbnail */}
            <div className="space-y-2">
              <label htmlFor="fileKey" className="text-sm font-medium">
                Course Thumbnail
              </label>

              <Controller
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <Uploader onChange={field.onChange} value={field.value} />
                )}
              />

              <p className="text-sm text-destructive">
                {form.formState.errors.fileKey?.message}
              </p>
            </div>
            {/* Category & Level */}
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>

                <input
                  id="category"
                  {...form.register("category")}
                  placeholder="ex-Web Development"
                  className="w-full rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
                />

                <p className="text-sm text-destructive">
                  {form.formState.errors.category?.message}
                </p>
              </div>
              <div className="space-y-2">
                <label htmlFor="level" className="text-sm font-medium">
                  Course Level
                </label>

                <select
                  id="level"
                  {...form.register("level")}
                  className="
      w-full
      rounded-md
      border
      border-input
      bg-background
      text-foreground
      px-3
      py-2
      outline-none
      transition-colors
      focus:ring-2
      focus:ring-primary
      focus:border-primary
      dark:bg-background
      dark:text-foreground
    "
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
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price (₹)
                </label>

                <input
                  id="price"
                  type="number"
                  min={0}
                  {...form.register("price", {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
                />

                <p className="text-sm text-destructive">
                  {form.formState.errors.price?.message}
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="duration" className="text-sm font-medium">
                  Duration (Hours)
                </label>

                <input
                  id="duration"
                  type="number"
                  min={1}
                  {...form.register("duration", {
                    valueAsNumber: true,
                  })}
                  className="w-full rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
                />

                <p className="text-sm text-destructive">
                  {form.formState.errors.duration?.message}
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>

              <select
                id="status"
                {...form.register("status")}
                className="
      w-full
      rounded-md
      border
      border-input
      bg-background
      text-foreground
      px-3
      py-2
      transition-colors
      outline-none
      focus:border-primary
      focus:ring-2
      focus:ring-primary
      disabled:cursor-not-allowed
      disabled:opacity-50
    "
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Archived">Archived</option>
              </select>

              <p className="text-sm text-destructive">
                {form.formState.errors.status?.message}
              </p>
            </div>
            {/* Submit Button */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                disabled={Pending}
                size="lg"
                className="w-full sm:w-auto"
              >
                {Pending ? (
                  <>
                    Creating...
                    <Loader2 className="animate-spin" />
                  </>
                ) : (
                  <>
                    Create Course <PlusIcon className="ml-1" size={16} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

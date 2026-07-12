"use client";

import Link from "next/link";
import slugify from "slugify";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, PlusIcon, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/uploader";

import { courseSchema } from "@/lib/zodSchemas";
import { tryCatch } from "@/hooks/try-catch";
import { useConfetti } from "@/hooks/use-confetti";

import { CreateCourses } from "./action";

export default function CourseCreationPage() {
  const [pending, startTransition] = useTransition();

  const router = useRouter();
  const { triggerConfetti } = useConfetti();

  const form = useForm<
  z.input<typeof courseSchema>,
  unknown,
  z.output<typeof courseSchema>
>({
  resolver: zodResolver(courseSchema),
  mode: "onChange",
  defaultValues: {
    title: "",
    slug: "",
    smallDescription: "",
    description: "",
    fileKey: "",
    category: "",
    price: 0,
    duration: 1,
    level: "Beginner",
    status: "Draft",
  },
});

  function onSubmit(values: z.output<typeof courseSchema>) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(CreateCourses(values));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (!result) return;

      if (result.status === "success") {
        toast.success(result.message);

        triggerConfetti();

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
                    className="w-full shrink-0 sm:w-auto"
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
                    <Sparkles className="mr-2 size-4" />
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

            {/* Thumbnail */}
            <div className="space-y-2">
              <label htmlFor="fileKey" className="text-sm font-medium">
                Course Thumbnail
              </label>

              <Controller
                control={form.control}
                name="fileKey"
                render={({ field }) => (
                  <Uploader
                    onChange={field.onChange}
                    value={field.value}
                    filetypeAccepted="image"
                  />
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
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary"
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
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
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
                disabled={pending}
                size="lg"
                className="w-full sm:w-auto"
              >
                {pending ? (
                  <>
                    Creating...
                    <Loader2 className="ml-2 size-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Create Course
                    <PlusIcon className="ml-1" size={16} />
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

"use client";

import React, { useState } from "react";
import Link from "next/link";
import slugify from "slugify";

import { ArrowLeft, PlusIcon, Sparkles } from "lucide-react";
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
export default function CourseCreationPage() {
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
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
    console.log(values);
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

              <textarea
                id="description"
                rows={8}
                {...form.register("description")}
                placeholder="Write a detailed description about your course..."
                className="w-full resize-none rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
              />

              <p className="text-sm text-destructive">
                {form.formState.errors.description?.message}
              </p>
            </div>
            {/* Course Thubnail */}
            {/* Course Thumbnail */}
<div className="space-y-3">
  <label htmlFor="thumbnail" className="text-sm font-medium">
    Course Thumbnail
  </label>

  <div className="grid grid-cols-1 gap-6 rounded-lg border p-4 md:grid-cols-[220px_1fr]">
    {/* Preview */}
    <div className="flex h-52 w-full items-center justify-center overflow-hidden rounded-lg border bg-muted">
      {thumbnailPreview ? (
        <img
          src={thumbnailPreview}
          alt="Course Thumbnail"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImagePlus className="h-10 w-10" />
          <span className="text-sm">Thumbnail Preview</span>
        </div>
      )}
    </div>

    {/* Upload */}
    <div className="flex flex-col justify-center space-y-4">
      <input
        id="thumbnail"
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          form.setValue("thumbnail", file, {
            shouldDirty: true,
            shouldValidate: true,
          });

          setThumbnailPreview(URL.createObjectURL(file));
        }}
        className="block w-full rounded-md border text-sm
        file:mr-4 file:cursor-pointer file:border-0
        file:bg-primary file:px-4 file:py-2
        file:text-primary-foreground hover:file:opacity-90"
      />

      <div className="space-y-1 text-sm text-muted-foreground">
        <p>• Upload JPG, PNG or WEBP image.</p>
        <p>• Recommended size: 1280 × 720 pixels.</p>
        <p>• Maximum file size: 5 MB.</p>
      </div>
    </div>
  </div>

  <p className="text-sm text-destructive">
    {form.formState.errors.thumbnail?.message}
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
                  placeholder="Web Development"
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
                  className="w-full rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
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
                className="w-full rounded-md border px-3 py-2 outline-none transition focus:ring-2 focus:ring-primary"
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
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Create Course<PlusIcon/>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

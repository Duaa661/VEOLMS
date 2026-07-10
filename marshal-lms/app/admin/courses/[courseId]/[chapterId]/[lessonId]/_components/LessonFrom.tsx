"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { updateLesson } from "../lesson";

import { Uploader } from "@/components/file-uploader/uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

interface AppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}

export function LessonForm({
  chapterId,
  data,
  courseId,
}: AppProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      chapterId,
      courseId,
      description: data.description ?? "",
      videoUrl: data.videoUrl ?? "",
      thumbnailKey: data.thumbnailKey ?? "",
    },
  });

  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      try {
        const response = await updateLesson(values, data.id);

        if (response.status === "success") {
          toast.success(response.message);

          form.reset(values);

          router.refresh();

          return;
        }

        toast.error(response.message);
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({
          variant: "outline",
          className: "mb-6",
        })}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the lesson details, thumbnail, and video.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Lesson Name"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <Uploader
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        filetypeAccepted="image"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Video</FormLabel>
                    <FormControl>
                      <Uploader
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        filetypeAccepted="video"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Lesson"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createLesson } from "../action";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { tryCatch } from "@/hooks/try-catch";

type Props = {
  courseId: string;
  chapterId: string;
};

export default function NewLessonModal({ courseId, chapterId }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      courseId,
      chapterId: chapterId,
    },
  });
  function handleOpenChange(open: boolean) {
    if(!open){
      form.reset();
    }
    setOpen(open);
  }
  async function onSubmit(values: LessonSchemaType) {
  values.courseId = courseId;
  values.chapterId = chapterId;

  startTransition(async () => {
    const { data: result, error } = await tryCatch(createLesson(values));

    if (error) {
      toast.error("An unexpected error occurred. Please try again");
      return;
    }

    if (result.status === "success") {
      toast.success(result.message);
      form.reset({
        name: "",
        courseId,
        chapterId,
      });
      setOpen(false);
    } else {
      toast.error(result.message);
    }
  });
}

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            Enter a name for your new lesson.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <input
              type="hidden"
              {...form.register("courseId")}
              value={courseId}
            />

            <input
              type="hidden"
              {...form.register("chapterId")}
              value={chapterId}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>

                  <FormControl>
                    <Input placeholder="Lesson Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

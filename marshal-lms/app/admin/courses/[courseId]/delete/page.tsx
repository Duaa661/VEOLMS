"use client";

import { useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button, buttonVariants } from "@/components/ui/button";
import { deleteCourse } from "./action";

const DeleteCourseRoute = () => {
    
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const {courseId}=useParams<{courseId:string}>();
  const handleDelete = () => {
    startTransition(async () => {
      try {
        const response = await deleteCourse(courseId);

        if (response.status === "success") {
          toast.success(response.message);
          router.push("/admin/courses");
          router.refresh();
          return;
        }

        toast.error(response.message);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete course.");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">
            Delete Course
          </CardTitle>

          <CardDescription>
            Are you sure you want to delete this course?
            <br />
            <span className="font-semibold">
              This action cannot be undone.
            </span>
          </CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-between">
          <Link
            href="/admin/courses"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            Cancel
          </Link>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Delete
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteCourseRoute;
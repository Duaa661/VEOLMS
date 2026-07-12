"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { deleteChapter} from "../action";
import { toast } from "sonner";

const DeleteChapter = ({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition()
  async function OnSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteChapter({ chapterId, courseId }))
      
          if (error) {
            toast.error("An unexpected error occurred. Please try again");
            return;
          }
      
          if (result.status === "success") {
            toast.success(result.message);
            setOpen(false);
      } 
       else {
            toast.error(result.message);
          }
    })
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            chapter cannot be return.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button onClick={OnSubmit} disabled={ pending}>
            {pending ? "Deleting..." :"Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteChapter;
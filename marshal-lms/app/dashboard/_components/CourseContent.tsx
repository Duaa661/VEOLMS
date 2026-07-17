"use client";

import { useTransition } from "react";

import { LessonContenttype } from "@/app/data/course/get-lesson-content";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { constructObjectUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle, Loader2 } from "lucide-react";

import { markLessonComplete } from "../[slug]/[lessonId]/action";
import { toast } from "sonner";
import { useConfetti } from "@/hooks/use-confetti";

interface isAppProps {
  data: LessonContenttype;
}

interface VideoPlayerProps {
  thumbnailKey: string;
  videoUrl: string;
}

function VideoPlayer({ thumbnailKey, videoUrl }: VideoPlayerProps) {
  const videoSrc = constructObjectUrl(videoUrl);
  const thumbnailSrc = constructObjectUrl(thumbnailKey);

  if (!videoSrc) {
    return (
      <div className="flex aspect-video flex-col items-center justify-center rounded-lg bg-muted">
        <BookIcon className="mb-4 size-16 text-primary" />

        <p className="text-muted-foreground">
          This lesson does not have a video yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-lg bg-black">
      <video
        className="h-full w-full rounded-lg object-cover"
        controls
        poster={thumbnailSrc}
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc} type="video/webm" />
        <source src={videoSrc} type="video/ogg" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export function CourseContent({ data }: isAppProps) {
  const [pending, startTransition] = useTransition();

  const { triggerConfetti } = useConfetti();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.Chapter.Course.slug),
      );

      if (error) {
        console.log(error);
        toast.error("Something went wrong");
        return;
      }

      if (result?.status === "success") {
        toast.success(result.message);

        triggerConfetti();
      }
    });
  }

  return (
    <div className="flex h-full flex-col bg-background">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoUrl={data.videoUrl ?? ""}
      />

      <div className="border-b p-4">
        {data.lessonProgress.length > 0 ? (
          <Button
            variant="outline"
            className="bg-green-500/10 text-green-500"
            disabled
          >
            <CheckCircle className="mr-2 size-4 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            className="w-full sm:w-fit"
            onClick={onSubmit}
            disabled={pending}
          >
            {pending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 size-4 text-green-500 hover:text-green-600" />
            )}
            Mark as Complete
          </Button>
        )}
      </div>

      <div className="p-4 md:p-6">
        <h1 className="mb-4 text-2xl md:text-3xl font-bold">{data.title}</h1>

        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}

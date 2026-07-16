import { LessonContenttype } from "@/app/data/course/get-lesson-content";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { constructObjectUrl } from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle } from "lucide-react";

interface isAppProps {
  data: LessonContenttype;
}

interface VideoPlayerProps {
  thumbnailKey: string;
  videoUrl: string;
}

function VideoPlayer({
  thumbnailKey,
  videoUrl,
}: VideoPlayerProps) {
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
  return (
    <div className="flex h-full flex-col bg-background">
      <VideoPlayer
        thumbnailKey={data.thumbnailKey ?? ""}
        videoUrl={data.videoUrl ?? ""}
      />

      <div className="border-b p-4">
        <Button variant="outline">
          <CheckCircle className="mr-2 size-4 text-green-500" />
          Mark as Complete
        </Button>
      </div>

      <div className="p-6">
        <h1 className="mb-4 text-3xl font-bold">{data.title}</h1>

        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}
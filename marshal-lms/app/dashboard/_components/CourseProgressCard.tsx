"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { constructObjectUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Image from "next/image";
import Link from "next/link";

interface IsAppProps {
  data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: IsAppProps) {
  const thumbnailUrl = constructObjectUrl(data.course.fileKey);
const {
  completedLessons,
  totalLessons,
  progressPercentage,
} = useCourseProgress(data.course);
  return (
    <Card className="group relative overflow-hidden gap-0 py-0">
      <Badge className="absolute top-2 right-2 z-10">
        {data.course.level}
      </Badge>

      <div className="relative aspect-video w-full">
        <Image
          src={thumbnailUrl}
          alt={`Thumbnail for ${data.course.title}`}
          fill
          className="rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
        />
      </div>

      <CardContent className="space-y-4 p-4">
        <Link
          href={`/dashboard/${data.course.slug}`}
          className="line-clamp-2 text-lg font-medium transition-colors hover:text-primary hover:underline"
        >
          {data.course.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {data.course.smallDescription}
        </p>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>

          <Progress value={progressPercentage} />

          <p className="text-xs text-muted-foreground">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>

        <Link
          href={`/dashboard/${data.course.slug}`}
          className={buttonVariants({
            className: "w-full",
          })}
        >
          Continue Learning
        </Link>
      </CardContent>
    </Card>
  );
}
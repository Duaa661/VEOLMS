import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { constructObjectUrl } from "@/hooks/use-construct-url";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface IsAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: IsAppProps) {
  const thumbnailUrl = constructObjectUrl(data.fileKey);

  return (
    <Card className="group relative overflow-hidden py-0 gap-0">
      <Badge className="absolute top-2 right-2 z-10">
        {data.level}
      </Badge>

      <div className="relative w-full aspect-video">
        <Image
          src={thumbnailUrl}
          alt="Thumbnail Image of course"
          fill
          className="rounded-t-xl object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <CardContent className="p-4">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>

        <p className="mt-2 text-sm leading-tight text-muted-foreground line-clamp-2">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 rounded-md bg-primary/10 p-1 text-primary" />
            <p className="text-sm text-muted-foreground">
              {data.duration} hours
            </p>
          </div>

          <div className="flex items-center gap-x-2">
            <School className="size-6 rounded-md bg-primary/10 p-1 text-primary" />
            <p className="text-sm text-muted-foreground">
              {data.category}
            </p>
          </div>
        </div>

        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({
            className: "w-full mt-4",
          })}
        >
          Learn More
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
    return (
        <Card className="group relative py-0 gap-0 ">
            <div className="absolute top-2 right-2 z-10 flex items-center">
              <Skeleton className="h-6 w-20 rounded-full"/>
            </div>
            <div className="w-full relative h-fit">
             <Skeleton className="w-full rounded-t-xl aspect-video"/>
            </div>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="mt-4 flex items-center gap-x-2">
                    <div className="flex items-center gap-x-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-4 w-8" />
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-4 w-8" />
                </div>
                </div>
                <Skeleton className="mt-4 w-full h-10 rounded-md"/>
            </CardContent>
        </Card>
    )
}
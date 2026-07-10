import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { constructObjectUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AdminCourseCardProps {
  data: AdminCourseType;
}

export function AdminCourseCard({ data }: AdminCourseCardProps) {
  const thumbnailUrl = data.fileKey
    ? constructObjectUrl(data.fileKey)
    : "/placeholder.png";

  return (
    <Card className="group  relative overflow-hidden gap-0">
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`}>
                <Pencil className="mr-2 size-4" />
                Edit Course
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`}>
                <Eye className="mr-2 size-4" />
                Preview
              </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`}>
                <Trash2 className="mr-2 size-4 text-destructive" />
                Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative aspect-video w-full">
        <Image
          src={thumbnailUrl}
          alt={data.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </div>

      <CardContent className="p-4">
        <Link
          href={`/admin/courses/${data.id}`}
          className="line-clamp-2 text-lg font-semibold transition-colors hover:text-primary"
        >
          {data.title}
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground text-tight mt-2">
          {data.smallDescription}
        </p>

        <div className="mt-4 flex items-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">
              {`${data.duration} hours`}
            </p>
          </div>

          <div className="flex items-center gap-x-2">
            <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
            <p className="text-sm text-muted-foreground">
              {data.level}
            </p>
          </div>
        </div>

        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({
            className: "w-full inline-flex items-center justify-center gap-2 mt-4",
          })}
        >
          Edit Course
          <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}


export function AdminCourseCardSkelton() {
  return (
    <Card className="grop relative py-0 gap-0">
    <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
      <Skeleton className="h-6 w-16 rounded-full" />
      <Skeleton className="size-8 rounded-md"/>
    </div>
    <div className="w-full relative h-fit">
    <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover"/>
      </div>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-4 rounded" />
        <div className="mt-4 flex items-center gap-x-2">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded"/>
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10 rounded"/>
          </div>
          
        </div>
        <Skeleton className="mt-4 h-10 w-full rounded"/>
      </CardContent>
  </Card>
  )
}
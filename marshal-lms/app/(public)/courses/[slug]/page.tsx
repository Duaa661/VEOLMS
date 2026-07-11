import { getSingleCourse } from "@/app/data/course/get-course";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { constructObjectUrl } from "@/hooks/use-construct-url";
import { BookOpen, Clock3, GraduationCap } from "lucide-react";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

const SlugPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const course = await getSingleCourse(slug);
  const thumbnailKey = constructObjectUrl(course.fileKey);

  return (
    <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="order-1 lg:col-span-2">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
          <Image
            src={thumbnailKey}
            alt={course.title}
            fill
            unoptimized
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>

            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {course.smallDescription}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-2 px-3 py-1">
              <GraduationCap className="size-4" />
              <span>{course.level}</span>
            </Badge>

            <Badge className="flex items-center gap-2 px-3 py-1">
              <BookOpen className="size-4" />
              <span>{course.category}</span>
            </Badge>

            <Badge className="flex items-center gap-2 px-3 py-1">
              <Clock3 className="size-4" />
              <span>{course.duration} Hours</span>
            </Badge>
                  </div>
                  <Separator className="my-8" />
                  <div className="space-y-6">
                      <h2 className="text-3xl font-semibold tracking-tight">Course Description</h2>
                      <div>
                          <p>{course.description}</p>
                      </div>
                  </div>
        </div>
      </div>
    </div>
  );
};

export default SlugPage;
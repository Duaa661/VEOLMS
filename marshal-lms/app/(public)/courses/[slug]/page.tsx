import { getSingleCourse } from "@/app/data/course/get-course";
import RenderDescription from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { constructObjectUrl } from "@/hooks/use-construct-url";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  GraduationCap,
  PlayCircle,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";

type Params = Promise<{ slug: string }>;

const SlugPage = async ({ params }: { params: Params }) => {
  const { slug } = await params;

  const course = await getSingleCourse(slug);
  const thumbnailKey = constructObjectUrl(course.fileKey);

  const totalLessons = course.chapter.reduce(
    (total, chapter) => total + chapter.lessons.length,
    0,
  );

  return (
    <div className="mt-5 grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Left Content */}
      <div className="order-1 lg:col-span-2">
        {/* Thumbnail */}
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

        <div className="mt-8 space-y-8">
          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>

            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {course.smallDescription}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-3">
            <Badge className="flex items-center gap-2 px-3 py-1">
              <GraduationCap className="size-4" />
              {course.level}
            </Badge>

            <Badge className="flex items-center gap-2 px-3 py-1">
              <BookOpen className="size-4" />
              {course.category}
            </Badge>

            <Badge className="flex items-center gap-2 px-3 py-1">
              <Clock3 className="size-4" />
              {course.duration} Hours
            </Badge>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              Course Description
            </h2>

            <RenderDescription json={JSON.parse(course.description)} />
          </div>

          {/* Course Content */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl font-semibold tracking-tight">
                Course Content
              </h2>

              <p className="text-sm text-muted-foreground">
                {course.chapter.length} Chapters | {totalLessons} Lessons
              </p>
            </div>

            <div className="space-y-4">
              {course.chapter.map((chapter, index) => (
                <Collapsible key={chapter.id} defaultOpen={index === 0}>
                  <Card className="overflow-hidden border-2 p-0 transition-all duration-200 hover:shadow-md">
                    <CollapsibleTrigger asChild>
                      <button className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                            {index + 1}
                          </div>

                          <div>
                            <h3 className="text-xl font-semibold">
                              {chapter.title}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              {chapter.lessons.length} Lesson
                              {chapter.lessons.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>

                        <ChevronDown className="size-5" />
                      </button>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <Separator />
                      <CardContent className="p-0">
                        {chapter.lessons.length > 0 ? (
                          chapter.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lesson.id}
                              className="flex items-start gap-4
                               border-b px-6 py-4 last:border-b-0 roundedlg hover:bg-accent transition-colors"
                            >
                              <PlayCircle className="mt-1 size-5 shrink-0 text-primary" />

                              <div className="flex-1">
                                <h4 className="font-medium">
                                  {lessonIndex + 1}. {lesson.title}
                                </h4>

                                <p className="mt-1 text-sm text-muted-foreground">
                                  Lesson {lessonIndex + 1}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-6 py-4 text-sm text-muted-foreground">
                            No lessons available.
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="order-2 lg:col-span-1">
  <div className="sticky top-20 space-y-6">
    {/* Price Card */}
    <Card>
      <CardContent className="space-y-6 p-6">
        {/* Price */}
        <div>
          <p className="text-sm text-muted-foreground">
            One-time Purchase
          </p>

          <div className="mt-2 flex items-end gap-2">
            <h2 className="text-4xl font-bold">
              ₹{course.price}
            </h2>

            <span className="pb-1 text-sm text-muted-foreground">
              INR
            </span>
          </div>
        </div>

        <Button className="h-11 w-full text-base">
          Enroll Now
        </Button>

        <Separator />

        {/* What you will get */}
        <div className="space-y-4">
          <h4 className="font-semibold">
            What you'll get
          </h4>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Clock3 className="size-4" />
              </div>

              <span>{course.duration} Hours of Content</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <BookOpen className="size-4" />
              </div>

              <span>{course.category}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <GraduationCap className="size-4" />
              </div>

              <span>{course.level}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Course Includes */}
        <div className="space-y-4">
          <h4 className="font-semibold">
            This course includes
          </h4>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Lifetime Access</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" />
              <span>{course.chapter.length} Chapters</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" />
              <span>{totalLessons} Lessons</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" />
              <span>{course.duration} Hours of Content</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Certificate of Completion</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle2 className="size-4 text-primary" />
              <span>Access on Mobile & Desktop</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Secure Payment */}
        <div className="rounded-lg border bg-muted/40 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-green-600" />

            <div>
              <p className="font-medium">
                Secure Payment
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Your payment is protected with secure encryption.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CreditCard className="size-4" />
            <span>Supports UPI, Cards & Net Banking</span>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Course Information */}
    <Card>
      <CardContent className="space-y-6 p-6">
        <h3 className="text-xl font-semibold">
          Course Information
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Level</span>
            <span className="font-medium">{course.level}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Category</span>
            <span className="font-medium">{course.category}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Duration</span>
            <span className="font-medium">{course.duration} Hours</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Chapters</span>
            <span className="font-medium">{course.chapter.length}</span>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Lessons</span>
            <span className="font-medium">{totalLessons}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
    </div>
  );
};

export default SlugPage;

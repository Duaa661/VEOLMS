import { notFound } from "next/navigation";

import { AdminGetCourses } from "@/app/data/admin/admin-get-course";

import EditCourseForm from "./_components/EditCourseFrom";
import CourseFormStructure from "./_components/CourseFormStructure";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface EditRouteProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function EditRoute({
  params,
}: EditRouteProps) {
  const { courseId } = await params;

  const data = await AdminGetCourses(courseId);
  if (!data) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Course{" "}
          <span className="text-primary underline underline-offset-4">
            {data.title}
          </span>
        </h1>

        <p className="text-muted-foreground">
          Update your course information, pricing, thumbnail,
          and course structure.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="basic-info"
        className="w-full"
      >
        <TabsList className="grid h-auto w-full grid-cols-2">
          <TabsTrigger value="basic-info">
            Basic Information
          </TabsTrigger>

          <TabsTrigger value="course-structure">
            Course Structure
          </TabsTrigger>
        </TabsList>

        {/* ---------------- Basic Information ---------------- */}
        <TabsContent
          value="basic-info"
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Basic Information
              </CardTitle>

              <CardDescription>
                Update the course title, description,
                thumbnail, category, pricing, level, status,
                and other settings.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---------------- Course Structure ---------------- */}
        <TabsContent
          value="course-structure"
          className="mt-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>
                Course Structure
              </CardTitle>

              <CardDescription>
                Organize chapters, lessons, videos, quizzes,
                and downloadable resources using drag-and-drop.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <CourseFormStructure data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
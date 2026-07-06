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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Course{" "}
          <span className="text-primary underline">
            {data.title}
          </span>
        </h1>

        <p className="mt-2 text-muted-foreground">
          Update your course information and structure.
        </p>
      </div>

      <Tabs
        defaultValue="basic-info"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic-info">
            Basic Information
          </TabsTrigger>

          <TabsTrigger value="course-structure">
            Course Structure
          </TabsTrigger>
        </TabsList>

        {/* Basic Information */}
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>

              <CardDescription>
                Update the title, description, thumbnail,
                category, pricing, and other course details.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <EditCourseForm data={data} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Course Structure */}
        <TabsContent value="course-structure">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>

              <CardDescription>
                Manage chapters, lessons, videos, and
                downloadable resources.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <CourseFormStructure />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
"use client";

import {
  IconBook,
  IconPlaylistX,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SectionCardsProps = {
  stats: {
    totalSignup: number;
    totalCustomers: number;
    totalCourses: number;
    totalLessons: number;
  };
};

export function SectionCards({ stats }: SectionCardsProps) {
  const dashboardStats = [
    {
      title: "Total Signups",
      value: stats.totalSignup.toLocaleString(),
      description: "Registered users on the platform.",
      icon: IconUsers,
    },
    {
      title: "Total Enrollments",
      value: stats.totalCustomers.toLocaleString(),
      description: "Students enrolled in one or more courses.",
      icon: IconUserCheck,
    },
    {
      title: "Published Courses",
      value: stats.totalCourses.toLocaleString(),
      description: "Courses currently available for learning.",
      icon: IconBook,
    },
    {
      title: "Total Lessons",
      value: stats.totalLessons.toLocaleString(),
      description: "Learning lessons across all published courses.",
      icon: IconPlaylistX,
    },
  ];

  return (
    <div
      className="
        grid grid-cols-1 gap-4 px-4
        @xl/main:grid-cols-2
        @5xl/main:grid-cols-4
        *:data-[slot=card]:bg-gradient-to-t
        *:data-[slot=card]:from-primary/5
        *:data-[slot=card]:to-card
        *:data-[slot=card]:shadow-xs
        dark:*:data-[slot=card]:bg-card
      "
    >
      {dashboardStats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.title} className="@container/card">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardDescription>{stat.title}</CardDescription>

                <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl">
                  {stat.value}
                </CardTitle>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>

            <CardFooter>
              <p className="text-sm text-muted-foreground">
                {stat.description}
              </p>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
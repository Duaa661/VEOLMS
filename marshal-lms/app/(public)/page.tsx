"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// TypeScript added
interface featuresProps{
  title: string,
  description: string,
  icon:string
}
// Courses Description
const features: featuresProps[] = [
  {
    title: "Comprehensive Courses",
    description:
      "Access a wide range of carefully curated courses designed by industry experts.",
    icon: "📚",
  },
  {
    title: "Interactive Learning",
    description:
      "Engage with interactive content, quizzes, and assignments to enhance your learning experience.",
    icon: "🎮",
  },
  {
    title: "Progress Tracking",
    description:
      "Monitor your progress and achievements with detailed analytics and personalized dashboards.",
    icon: "📊",
  },
  {
    title: "Community Support",
    description:
      "Join a vibrant community of learners and instructors to collaborate and share knowledge.",
    icon: "👥",
  },
];
export default function Home() {


  return (
    <>
      <section className="relative py-20">
        <div className="flex flex-col items-center text-center space-y-8">
          <Badge variant="outline"> The Future of Online Education</Badge>
          <h1 className="text-4cl md:text-6xl font-bold tracking-tight">
            Build Your Future Through Learning
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Discover a new way to learn with our modern, interactive learning
            managment system . Acess high-quality courses anytime, anywhere
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/courses"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-11 rounded-lg px-6 font-medium shadow-sm transition-colors",
              })}
            >
              Explore Courses
            </Link>

            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "h-11 rounded-lg border-border bg-background px-6 font-medium shadow-sm hover:bg-accent hover:text-accent-foreground",
              })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {
          features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))
          }
      </section>
    </>
  );
}

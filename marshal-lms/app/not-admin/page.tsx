import Link from "next/link";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotAdminRole() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
  <Card className="w-full max-w-xl border shadow-xl">
    <CardHeader className="flex flex-col items-center text-center space-y-6 pt-10">
      {/* Icon */}
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10 ring-8 ring-destructive/5">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive">
          <ShieldX className="h-8 w-8 text-white" />
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-3">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Unauthorized Access
        </CardTitle>

        <CardDescription className="mx-auto max-w-md text-base leading-7 text-muted-foreground">
          You don't have permission to access the{" "}
          <span className="font-semibold text-foreground">
            Admin Dashboard
          </span>
          . This area is restricted to users with the{" "}
          <span className="font-semibold text-foreground">
            Administrator
          </span>{" "}
          role.
        </CardDescription>
      </div>
    </CardHeader>

    <div className="mx-6 border-t" />

    <CardContent className="flex flex-col justify-center gap-3 py-8 sm:flex-row">
      <Button asChild size="lg">
        <Link href="/">
          <Home className="mr-2 h-4 w-4" />
          Go to Home
        </Link>
      </Button>

      <Button variant="outline" size="lg" asChild>
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
    </CardContent>
  </Card>
</div>
  );
}
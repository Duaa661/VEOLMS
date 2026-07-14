import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentCancelled = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
          <XCircle className="size-20 text-red-500" />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Payment Cancelled</h1>

            <p className="text-muted-foreground">
              Your payment was cancelled and no amount has been charged.
              You can return to the course page and try again whenever you're
              ready.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link href="/">
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancelled;
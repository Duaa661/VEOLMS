/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useConfetti } from "@/hooks/use-confetti";
import { useEffect } from "react";

const PaymentSuccess = () => {
    const { triggerConfetti } = useConfetti()
    useEffect(() => {
        triggerConfetti()
    },[])
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center space-y-6 p-8 text-center">
          <CheckCircle2 className="size-20 text-green-500" />

          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Payment Successful</h1>

            <p className="text-muted-foreground">
              Thank you for your purchase! Your payment has been processed
              successfully and your course is now available in your account.
              Start learning anytime.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>

            <Button asChild variant="outline" className="flex-1">
              <Link href="/courses">
                Browse Courses
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
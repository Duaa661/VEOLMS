"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export default function VerifyRequestClient() {
  const [otp, setOtp] = useState("");
  const router = useRouter();
  const [emailPending, startTransition] = useTransition();

  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email,
        otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email Verified");
            router.push("/");
          },
          onError: () => {
            toast.error("Invalid OTP or Email");
          },
        },
      });
    });
  }

  return (
    <Card className="mx-auto w-full max-w-md rounded-xl shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">
          Please check your email
        </CardTitle>

        <CardDescription className="text-sm leading-6 text-muted-foreground">
          We have sent a verification code to your email address.
          <br />
          Please open the email and enter the 6-digit code below.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-col items-center space-y-6">
          <InputOTP
            value={otp}
            className="gap-8"
            onChange={setOtp}
            maxLength={6}
          >
            <div className="flex gap-2">
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </div>
          </InputOTP>

          <p className="text-center text-sm text-muted-foreground">
            Enter the 6-digit verification code.
          </p>
        </div>

        <Button
          onClick={verifyOtp}
          disabled={emailPending || !isOtpCompleted}
          className="w-full"
        >
          {emailPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
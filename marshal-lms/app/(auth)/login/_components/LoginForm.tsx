"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();

  const [githubPending, startGithubTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();

  const [email, setEmail] = useState("");

  async function GithubLoginPage() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success(
              "Signed in with GitHub. You will be redirected shortly."
            );
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  function signWithEmail() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email.");
      return;
    }

    if (emailPending) return;

    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: trimmedEmail,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification email sent successfully.");
            router.push(
              `/verify-request?email=${encodeURIComponent(trimmedEmail)}`
            );
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>
          Sign in with GitHub or continue with your email.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {/* GitHub Login */}
        <Button
          className="w-full"
          variant="outline"
          onClick={GithubLoginPage}
          disabled={githubPending}
        >
          {githubPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <FaGithub className="size-4" />
              <span>Sign in with GitHub</span>
            </>
          )}
        </Button>

        {/* Divider */}
        <div
          className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
        >
          <span className="relative z-10 bg-card px-4 text-muted-foreground">
            Or continue with
          </span>
        </div>

        {/* Email Login */}
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailPending}
              required
            />
          </div>

          <Button onClick={signWithEmail} disabled={emailPending}>
            {emailPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="size-4" />
                <span>Continue with Email</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
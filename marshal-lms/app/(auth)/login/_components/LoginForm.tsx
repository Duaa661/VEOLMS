"use client"
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
import { Loader } from "lucide-react";
import { useTransition } from "react";
import { FaGithub } from "react-icons/fa";
import { toast } from "sonner";

export function LoginForm() {
    const [githubPending, startGithubTransition] = useTransition();
      async function GithubLoginPage() {
        startGithubTransition(async () => {
          await authClient.signIn.social({
            provider: "github",
            callbackURL: "/",
            fetchOptions: {
              onSuccess: () => {
                toast.success("Signed in with github, you will br redirecting...");
              },
              onError: (error) => {
                toast.error(`Internal Server Error ${error.error.message}`);
              },
            },
          });
        });
      }
    return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>Login with your Github Email Account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          className="w-full"
          variant="outline"
          onClick={GithubLoginPage}
          disabled={githubPending}
        >
          {githubPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading..</span>
            </>
          ) : (
            <>
              <FaGithub className="size-4" />
              Sign in With Github
            </>
          )}
        </Button>
        {/* other content */}
        <div
          className="relative text-center text-sm after:absolute
                after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center
                after:border-t after:border-border"
        >
          <span className="relative z-10 bg-card px-4 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <Button>Continue with Email</Button>
        </div>
      </CardContent>
    </Card>
  );
}
"use client";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  async function signOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          toast.success('Signed Out Successfully')
        },
      },
    });
  }

  return (
    <div className="p-24">
      <h1 className="text-2xl font-bold text-red-500">
        Hello World
      </h1>

      <ThemeToggle />

      {session ? (
        <div className="space-y-4">
          <p>Welcome, {session.user.name}</p>

          <Button onClick={signOut}>
            Logout
          </Button>
        </div>
      ) : (
        <Button onClick={() => router.push("/login")}>
          Login
        </Button>
      )}
    </div>
  );
}
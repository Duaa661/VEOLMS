"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/lms.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropDown";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image
            src={Logo}
            alt="VeoLMS Logo"
            width={36}
            height={36}
            className="size-9"
            priority
          />
          <span className="text-lg font-bold">VeoLMS.</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-between md:flex">
          <div className="flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isPending ? null : session ? (
              <UserDropdown />
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({
                    variant: "secondary",
                  })}
                >
                  Login
                </Link>

                <Link
                  href="/login"
                  className={buttonVariants()}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
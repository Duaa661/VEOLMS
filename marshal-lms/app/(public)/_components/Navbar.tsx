"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/public/lms.png";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropDown";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/course" },
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Image src={Logo} className="size-9" alt="logo" />
          <span className="font-bold text-lg">VeoLMS.</span>
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
              <UserDropdown
                email={session.user.email}
                image={
                  session?.user.image ??
                      `https://avatar.vercel.sh/${session?.user.email}`
                    
                }
                name={
                  session?.user.name && session.user.name.length > 0
                    ? session.user.name :
                    session.user.email.split("@")[0]
                }
              />
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
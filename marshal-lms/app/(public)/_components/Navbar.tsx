"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/lms.png";

import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import { buttonVariants } from "@/components/ui/button";
import { UserDropdown } from "./UserDropDown";

import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "Dashboard", href: "/dashboard" },
];

const Navbar = () => {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={Logo}
            alt="VeoLMS Logo"
            width={36}
            height={36}
            className="size-9"
            priority
          />

          <span className="text-lg font-bold tracking-tight">VeoLMS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-between ml-6">
          <div className="flex items-center gap-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary"
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

                <Link href="/login" className={buttonVariants()}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <button
                className="
          flex size-10 items-center justify-center
          rounded-lg border bg-background
          hover:bg-muted transition
        "
              >
                <Menu className="size-5" />
              </button>
            </SheetTrigger>

            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src={Logo}
                      alt="VeoLMS Logo"
                      width={32}
                      height={32}
                      className="size-8"
                    />

                    <span className="text-lg font-bold">VeoLMS</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-8 flex flex-col">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="
              flex items-center
              rounded-lg
              px-3 py-3
              text-base font-medium
              text-muted-foreground
              hover:bg-muted
              hover:text-primary
              transition
            "
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="my-6 border-t" />

                {isPending ? null : session ? (
                  <div className="px-3">
                    <UserDropdown />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 px-3">
                    <Link
                      href="/login"
                      className={buttonVariants({
                        variant: "secondary",
                        className: "w-full justify-center",
                      })}
                    >
                      Login
                    </Link>

                    <Link
                      href="/login"
                      className={buttonVariants({
                        className: "w-full justify-center",
                      })}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

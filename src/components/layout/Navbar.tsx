"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getMe, logoutUser } from "@/services/auth.services";
import { IUser } from "@/types/auth.types";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import LiquidNavLinks from "./navbar/LiquidNavLinks";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import NavbarUserMenu from "./navbar/NavbarUserMenu";

interface NavbarProps {
  initialUser?: IUser | null;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<IUser | null>(
    initialUser ?? null
  );

  const [isScrolled, setIsScrolled] = useState(false);

  // Sync when initialUser from server layout changes
  useEffect(() => {
    if (initialUser !== undefined) {
      setCurrentUser(initialUser);
    }
  }, [initialUser]);

  // Sync if Better-Auth client session updates
  useEffect(() => {
    if (session?.user) {
      setCurrentUser(
        (prev) =>
          ({
            ...prev,
            ...session.user,
            createdAt: session.user.createdAt
              ? String(session.user.createdAt)
              : prev?.createdAt,
            updatedAt: session.user.updatedAt
              ? String(session.user.updatedAt)
              : prev?.updatedAt,
            role: (session.user as any).role || prev?.role || "CUSTOMER",
          } as unknown as IUser)
      );
    }
  }, [session]);

  // Client-side fallback check on mount to ensure immediate sync
  useEffect(() => {
    if (!currentUser) {
      getMe()
        .then((res) => {
          if (res) setCurrentUser(res);
        })
        .catch(() => {});
    }
  }, [currentUser]);

  // Detect scroll to apply liquid glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileLogout = async () => {
    try {
      await logoutUser();
      setCurrentUser(null);
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  // Brand Logo: Fifth Sense Brand Image from /navbar/fifthsenselogo.png
  const Logo = (
    <Link href="/" className="flex items-center group shrink-0 select-none">
      <Image
        src="/navbar/fifthsenselogo.png"
        alt="Fifth Sense"
        width={150}
        height={50}
        priority
        className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 dark:invert"
      />
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10"
          : "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo (Pure Typography) */}
        <div className="flex items-center">{Logo}</div>

        {/* Center: Desktop Navigation with Liquid Glass & Perfume Amber Elixir Tone */}
        <nav className="hidden lg:flex items-center">
          <Suspense
            fallback={
              <div className="h-10 w-[540px] rounded-full bg-neutral-100/60 dark:bg-neutral-900/60 animate-pulse" />
            }
          >
            <LiquidNavLinks />
          </Suspense>
        </nav>

        {/* Right: Actions, User Profile & Mobile Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Search Text Link */}
          <Link
            href="/products"
            className="text-xs font-normal text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors px-1 py-1 select-none"
            title="Search Fragrances"
          >
            Search
          </Link>

          {/* Cart Text Link with Counter */}
          <Link
            href="/cart"
            className="text-xs font-normal text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors px-1 py-1 select-none"
            title="Fragrance Bag"
          >
            Bag (0)
          </Link>

          {/* Profile Menu when logged in, or Sign In button when logged out */}
          {currentUser ? (
            <NavbarUserMenu user={currentUser} />
          ) : (
            <Link
              href="/login"
              className="h-8 px-4 rounded-full text-xs font-normal leading-none text-[#fff8ea] bg-[#29170e] hover:bg-[#3f2214] border border-[#d97706]/35 transition-all duration-300 select-none inline-flex items-center justify-center"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger Drawer Menu */}
          <NavbarMobileMenu
            user={currentUser}
            onLogout={handleMobileLogout}
            logoElement={Logo}
          />
        </div>
      </div>
    </header>
  );
}

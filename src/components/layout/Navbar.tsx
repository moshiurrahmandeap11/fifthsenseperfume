"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/auth.services";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import LiquidNavLinks from "./navbar/LiquidNavLinks";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import NavbarUserMenu from "./navbar/NavbarUserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [isScrolled, setIsScrolled] = useState(false);

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
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
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

        {/* Right: Actions, Try It / User Profile & Mobile Toggle (No Icons, Normal Font) */}
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

          {/* Try It Button / Profile Menu (Normal Font, Luxury Perfume Amber Tone, No Icons) */}
          {user ? (
            <NavbarUserMenu user={user} />
          ) : (
            <Link
              href="/login"
              className="h-8 px-4 rounded-full text-xs font-normal leading-none text-[#fff8ea] bg-[#29170e] hover:bg-[#3f2214] border border-[#d97706]/35 transition-all duration-300 select-none inline-flex items-center justify-center shadow-xs"
            >
              Try It
            </Link>
          )}

          {/* Mobile Hamburger Drawer Menu */}
          <NavbarMobileMenu
            user={user}
            onLogout={handleMobileLogout}
            logoElement={Logo}
          />
        </div>
      </div>
    </header>
  );
}

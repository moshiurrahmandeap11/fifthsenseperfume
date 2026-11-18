"use client";

import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/auth.services";
import {
  ArrowRight,
  Flame,
  Footprints,
  Search,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import NavbarUserMenu from "./navbar/NavbarUserMenu";
import { STOREFRONT_NAV_LINKS } from "./navbar/navLinks";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [isScrolled, setIsScrolled] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

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

  // Reusable Logo Component with graceful fallback if .jxl isn't supported by client browser
  const Logo = (
    <Link href="/" className="flex items-center gap-2.5 group shrink-0">
      <div className="relative size-9 sm:size-10 rounded-xl overflow-hidden bg-black text-white dark:bg-white dark:text-black flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform duration-300">
        {!logoError ? (
          <picture className="w-full h-full flex items-center justify-center">
            <source srcSet="/navbar/logo.jxl" type="image/jxl" />
            <img
              src="/navbar/logo.jxl"
              alt="Logo"
              className="w-full h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
              onError={() => setLogoError(true)}
            />
          </picture>
        ) : (
          <Footprints className="size-5 text-white dark:text-black animate-pulse" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-extrabold tracking-tight text-base sm:text-lg text-black dark:text-white leading-none">
          FIFTH SENSE
        </span>
        <span className="text-[10px] uppercase font-semibold tracking-widest text-neutral-500 leading-tight mt-0.5">
          Footwear Atelier
        </span>
      </div>
    </Link>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-white/85 dark:bg-black/85 backdrop-blur-xl border-b border-black/5 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
          : "bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-900"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center">{Logo}</div>

        {/* Center: Desktop Navigation with Smooth Liquid Floating Pill Animation */}
        <nav className="hidden lg:flex items-center">
          <div
            className="relative flex items-center p-1.5 rounded-full bg-neutral-100/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/60 dark:border-neutral-800/60 shadow-xs"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            {STOREFRONT_NAV_LINKS.map((link, idx) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);
              const isHovered = hoveredIdx === idx;

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={cn(
                    "relative px-4 py-1.5 text-xs font-medium rounded-full transition-all duration-300 z-10 select-none flex items-center gap-1.5",
                    isActive
                      ? "text-white dark:text-black font-semibold"
                      : "text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                  )}
                >
                  {/* Liquid Active Background Pill */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full bg-black dark:bg-white shadow-sm z-[-1] transition-all duration-300" />
                  )}

                  {/* Liquid Hover Indicator Pill (when not active) */}
                  {!isActive && isHovered && (
                    <span className="absolute inset-0 rounded-full bg-neutral-200/80 dark:bg-neutral-800/80 z-[-1] transition-all duration-200 animate-in fade-in-50 zoom-in-95" />
                  )}

                  <span>{link.title}</span>

                  {link.badge && (
                    <span
                      className={cn(
                        "text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider flex items-center gap-0.5",
                        isActive
                          ? "bg-white text-black dark:bg-black dark:text-white"
                          : "bg-black text-white dark:bg-white dark:text-black"
                      )}
                    >
                      <Flame className="size-2.5 text-orange-500 fill-orange-500" />
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Right: Actions, Try It / User Profile & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Search Trigger */}
          <Link
            href="/products"
            className="size-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            aria-label="Search Catalog"
            title="Search shoes"
          >
            <Search className="size-4" />
          </Link>

          {/* Cart Icon with Counter */}
          <Link
            href="/cart"
            className="relative size-9 rounded-full flex items-center justify-center text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
            aria-label="Shopping Cart"
            title="Cart"
          >
            <ShoppingBag className="size-4" />
            <span className="absolute -top-0.5 -right-0.5 size-4 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold flex items-center justify-center shadow-xs">
              0
            </span>
          </Link>

          {/* 3. Try It Button / Profile Picture Icon */}
          {user ? (
            /* Logged In: Show Profile Picture / Avatar Icon with Dropdown */
            <NavbarUserMenu user={user} />
          ) : (
            /* Not Logged In: Show High-Contrast Black & White "Try It" Button with Liquid Shimmer */
            <Link
              href="/login"
              className="group relative overflow-hidden inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-black dark:text-black dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer select-none"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="size-3.5 animate-pulse text-amber-400 dark:text-amber-500" />
                <span>Try It</span>
                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              {/* Liquid Shimmer Light Beam Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 dark:via-black/20 to-transparent transition-transform duration-700 ease-in-out" />
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

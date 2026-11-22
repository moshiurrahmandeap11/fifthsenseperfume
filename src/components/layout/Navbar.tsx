"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
  X,
  User,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { logoutUser } from "@/services/auth.services";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import TopBar from "./TopBar";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import NavbarUserMenu from "./navbar/NavbarUserMenu";
import { STOREFRONT_NAV_LINKS } from "./navbar/navLinks";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const user = session?.user;

  const [prevPathname, setPrevPathname] = useState(pathname);
  const [showNavLinks, setShowNavLinks] = useState(true);
  const navVisibleRef = useRef(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isShopHovered, setIsShopHovered] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Reset UI states cleanly when route changes without setState inside useEffect
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setShowNavLinks(true);
    setIsSearchOpen(false);
    setIsShopHovered(false);
  }

  useEffect(() => {
    navVisibleRef.current = showNavLinks;
  }, [showNavLinks]);

  // Smooth, jitter-free scroll direction detection (paired with zero-reflow Row 2 transform)
  useEffect(() => {
    let lastScrollY = Math.max(0, window.scrollY);
    let accumulatedDistance = 0;
    let currentDirection: "up" | "down" | null = null;
    let ticking = false;

    const updateOnScroll = () => {
      const currentScrollY = Math.max(0, window.scrollY);
      const delta = currentScrollY - lastScrollY;

      // Always keep links visible near top of page
      if (currentScrollY <= 30) {
        if (!navVisibleRef.current) {
          navVisibleRef.current = true;
          setShowNavLinks(true);
        }
        accumulatedDistance = 0;
        currentDirection = null;
        lastScrollY = currentScrollY;
        ticking = false;
        return;
      }

      if (delta > 0) {
        // Scrolling DOWN
        if (currentDirection !== "down") {
          currentDirection = "down";
          accumulatedDistance = 0;
        }
        accumulatedDistance += delta;

        if (accumulatedDistance >= 6 && currentScrollY > 60) {
          if (navVisibleRef.current) {
            navVisibleRef.current = false;
            setShowNavLinks(false);
            setIsShopHovered(false);
          }
        }
      } else if (delta < 0) {
        // Scrolling UP
        if (currentDirection !== "up") {
          currentDirection = "up";
          accumulatedDistance = 0;
        }
        accumulatedDistance += Math.abs(delta);

        if (accumulatedDistance >= 8) {
          if (!navVisibleRef.current) {
            navVisibleRef.current = true;
            setShowNavLinks(true);
          }
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateOnScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus input when search bar opens with smooth timing
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
  };

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

  // Brand Logo: Original brand logo from /navbar/fifthsenselogo.png
  const BrandLogo = (
    <Link
      href="/"
      className="flex items-center justify-center group select-none py-1"
      title="Fifth Sense"
    >
      <Image
        src="/navbar/fifthsenselogo.png"
        alt="Fifth Sense"
        width={160}
        height={48}
        priority
        className="h-8 sm:h-9 md:h-10 w-auto object-contain transition-opacity duration-200 group-hover:opacity-85 dark:invert"
      />
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent pointer-events-none rounded-none">
      {/* 1. Black Top Announcement Bar */}
      <div className="pointer-events-auto">
        <TopBar />
      </div>

      {/* 2. Main Navbar Container (transparent wrapper; Row 1/Row 2 maintain constant layout height -> zero scroll reflow) */}
      <div className="w-full">
        {/* ROW 1: Search Icon (Left) | Centered Logo (Center) | Wishlist & Cart (Right) */}
        <div
          className={cn(
            "w-full relative z-20 bg-white dark:bg-neutral-950 pointer-events-auto border-b transition-colors duration-200 shadow-none",
            showNavLinks || isSearchOpen
              ? "border-neutral-100 dark:border-neutral-900"
              : "border-neutral-200 dark:border-neutral-800"
          )}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-18 sm:h-20 grid grid-cols-3 items-center">
            
            {/* Left Column: Search Icon & Mobile Menu */}
            <div className="flex items-center gap-1 sm:gap-2 -ml-2">
              {/* Mobile Drawer Trigger (Only visible on mobile) */}
              <div className="md:hidden">
                <NavbarMobileMenu
                  user={user}
                  onLogout={handleMobileLogout}
                  logoElement={BrandLogo}
                />
              </div>

              {/* Search Icon Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white transition-all cursor-pointer rounded-none"
                aria-label="Toggle Search"
                title="Search"
              >
                {isSearchOpen ? (
                  <X className="size-5 stroke-[1.5] animate-in fade-in zoom-in-75 duration-200" />
                ) : (
                  <Search className="size-5 stroke-[1.5] animate-in fade-in zoom-in-75 duration-200" />
                )}
              </button>
            </div>

            {/* Center Column: Symmetrical Brand Logo */}
            <div className="flex justify-center items-center">
              {BrandLogo}
            </div>

            {/* Right Column: Wishlist & Shopping Cart */}
            <div className="flex items-center justify-end gap-2 sm:gap-4 -mr-2">
              {/* Wishlist Link */}
              <Link
                href="/products"
                className="p-2 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white transition-colors select-none"
                title="Olfactory Wishlist"
              >
                <Heart className="size-5 stroke-[1.5]" />
              </Link>

              {/* Shopping Cart Link with Count Badge */}
              <Link
                href="/cart"
                className="relative p-2 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white transition-colors select-none"
                title="Shopping Bag"
              >
                <ShoppingCart className="size-5 stroke-[1.5]" />
                {/* Subtle Cart Indicator */}
                <span className="absolute top-1 right-0 min-w-[14px] h-[14px] px-1 text-[9px] font-mono leading-none flex items-center justify-center bg-black text-white dark:bg-white dark:text-black rounded-none">
                  0
                </span>
              </Link>

              {/* User Profile / Menu (if logged in, or subtle user icon) */}
              {user ? (
                <div className="hidden sm:block">
                  <NavbarUserMenu user={user} />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:inline-flex p-2 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white transition-colors"
                  title="Sign In"
                >
                  <User className="size-5 stroke-[1.5]" />
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Expandable Smooth Animated Inline Search Bar */}
      <div
        className={cn(
          "relative z-20 grid transition-[grid-template-rows,padding,opacity] duration-300 ease-out bg-white dark:bg-neutral-950 overflow-hidden shadow-none",
          isSearchOpen
            ? cn(
                "grid-rows-[1fr] opacity-100 py-3 border-b pointer-events-auto",
                showNavLinks
                  ? "border-neutral-100 dark:border-neutral-900"
                  : "border-neutral-200 dark:border-neutral-800"
              )
            : "grid-rows-[0fr] opacity-0 py-0 border-b-0 border-transparent pointer-events-none"
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="w-full max-w-[480px] sm:max-w-[520px] mx-auto px-4">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
              <Search className="absolute left-3 size-4 stroke-[1.5] text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search artisanal fragrances, notes (oud, bergamot, santal)..."
                className="w-full h-10 pl-9 pr-24 text-xs font-sans bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#cfb98f] rounded-none shadow-none"
              />
              <button
                type="submit"
                className="absolute inset-y-1 right-1 px-4 flex items-center justify-center text-[11px] font-sans font-medium uppercase tracking-normal bg-[#cfb98f] hover:bg-[#bfa77a] active:bg-[#b0986b] text-white rounded-none transition-colors cursor-pointer shadow-none"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ROW 2: Desktop Centered Navigation Links — Pure GPU slide behind Row 1 without layout reflow */}
      <div
        className={cn(
          "hidden md:block relative z-10",
          showNavLinks ? "pointer-events-auto" : "pointer-events-none",
          showNavLinks && isShopHovered ? "overflow-visible" : "overflow-hidden"
        )}
      >
        <nav
          aria-label="Storefront Navigation"
          className={cn(
            "flex items-center justify-center gap-7 lg:gap-10 py-3.5 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 transition-[transform,opacity] duration-200 ease-out transform-gpu",
            showNavLinks
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "-translate-y-full opacity-0 pointer-events-none"
          )}
        >
          {STOREFRONT_NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            // "SHOP" with Dropdown Menu
            if (link.hasDropdown && link.sublinks) {
              return (
                <div
                  key={link.title}
                  className="relative group"
                  onMouseEnter={() => setIsShopHovered(true)}
                  onMouseLeave={() => setIsShopHovered(false)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-sans uppercase tracking-normal transition-colors py-1 select-none rounded-none",
                      isActive
                        ? "text-black dark:text-white font-medium"
                        : "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                    )}
                  >
                    <span>{link.title}</span>
                    <ChevronDown className="size-3 stroke-[1.5] transition-transform duration-200 group-hover:rotate-180" />
                  </Link>

                  {/* Dropdown Menu Panel (Zero border-radius, clean luxury) */}
                  {isShopHovered && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-64">
                      <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-lg py-2 rounded-none">
                        {link.sublinks.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            className="block px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group/item"
                          >
                            <p className="text-xs font-sans tracking-normal text-neutral-800 dark:text-neutral-200 group-hover/item:text-black dark:group-hover/item:text-white">
                              {sub.title}
                            </p>
                            {sub.description && (
                              <p className="text-[10px] text-neutral-500 font-sans tracking-normal mt-0.5 line-clamp-1">
                                {sub.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Normal Navigation Links
            return (
              <Link
                key={link.title}
                href={link.href}
                className={cn(
                  "text-xs font-sans uppercase tracking-normal transition-colors py-1 select-none rounded-none",
                  isActive
                    ? "text-black dark:text-white font-medium"
                    : "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                )}
              >
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>
      </div>
    </header>
  );
}

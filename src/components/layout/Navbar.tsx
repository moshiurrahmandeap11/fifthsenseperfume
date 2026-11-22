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
import { signOut, useSession } from "@/lib/auth-client";
import { logoutUser } from "@/services/auth.services";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/auth.types";
import toast from "react-hot-toast";
import TopBar from "./TopBar";
import NavbarMobileMenu from "./navbar/NavbarMobileMenu";
import NavbarUserMenu from "./navbar/NavbarUserMenu";
import { STOREFRONT_NAV_LINKS } from "./navbar/navLinks";

interface NavbarProps {
  initialUser?: IUser | null;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [prevInitialUserId, setPrevInitialUserId] = useState<string | null>(
    initialUser?.id ?? null
  );
  const [currentUser, setCurrentUser] = useState<IUser | null>(
    initialUser ?? null
  );

  const nextInitialUserId = initialUser?.id ?? null;
  if (nextInitialUserId !== prevInitialUserId) {
    setPrevInitialUserId(nextInitialUserId);
    setCurrentUser(initialUser ?? null);
  }

  const user =
    currentUser ?? (session?.user as unknown as IUser | undefined) ?? null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavLinks, setShowNavLinks] = useState(true);
  const navVisibleRef = useRef(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isShopHovered, setIsShopHovered] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keep navigation visible when switching routes
  useEffect(() => {
    navVisibleRef.current = true;
    setShowNavLinks(true);
    setIsSearchOpen(false);
    setIsShopHovered(false);
  }, [pathname]);

  // Robust scroll direction detection with hysteresis and requestAnimationFrame to eliminate glitches
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY);

          // 1. Always show navigation links when near top of page
          if (currentScrollY <= 60) {
            if (!navVisibleRef.current) {
              navVisibleRef.current = true;
              setShowNavLinks(true);
            }
            lastScrollY = currentScrollY;
            ticking = false;
            return;
          }

          const diff = currentScrollY - lastScrollY;

          // 2. Scrolling DOWN with deliberate movement (>15px) past 90px from top
          if (diff > 15 && currentScrollY > 90) {
            if (navVisibleRef.current) {
              navVisibleRef.current = false;
              setShowNavLinks(false);
              setIsShopHovered(false);
            }
            lastScrollY = currentScrollY;
          }
          // 3. Scrolling UP with deliberate movement (>15px)
          else if (diff < -15) {
            if (!navVisibleRef.current) {
              navVisibleRef.current = true;
              setShowNavLinks(true);
            }
            lastScrollY = currentScrollY;
          }

          ticking = false;
        });
        ticking = true;
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
      await Promise.allSettled([signOut(), logoutUser()]);
      setCurrentUser(null);
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
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-neutral-950 rounded-none">
      {/* 1. Black Top Announcement Bar */}
      <TopBar />

      {/* 2. Main Navbar Container */}
      <div
        className={cn(
          "w-full bg-white dark:bg-neutral-950 transition-colors duration-200 border-b border-neutral-200 dark:border-neutral-800 shadow-none"
        )}
      >
        {/* ROW 1: Search Icon (Left) | Centered Logo (Center) | Wishlist & Cart (Right) */}
        <div className="w-full relative z-20 bg-white dark:bg-neutral-950">
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
            ? "grid-rows-[1fr] opacity-100 py-3 border-t border-neutral-100 dark:border-neutral-900"
            : "grid-rows-[0fr] opacity-0 py-0 border-t-0 border-transparent pointer-events-none"
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

      {/* ROW 2: Desktop Centered Navigation Links with Smooth Slide-Up on Scroll Down */}
      <div
        className={cn(
          "hidden md:block relative z-10 transition-all duration-300 ease-in-out",
          showNavLinks
            ? "max-h-[46px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none overflow-hidden",
          showNavLinks && isShopHovered ? "overflow-visible" : "overflow-hidden"
        )}
      >
        <nav
          aria-label="Storefront Navigation"
          className={cn(
            "flex items-center justify-center gap-7 lg:gap-10 py-3.5 border-t border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 transition-transform duration-300 ease-in-out",
            showNavLinks ? "translate-y-0" : "-translate-y-full"
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

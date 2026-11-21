"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { STOREFRONT_NAV_LINKS } from "./navLinks";

interface NavbarMobileMenuProps {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  } | null;
  onLogout?: () => void;
  logoElement: React.ReactNode;
}

export default function NavbarMobileMenu({
  user,
  onLogout,
  logoElement,
}: NavbarMobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = user?.role && [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "MODERATOR",
    "INVENTORY_STAFF",
    "ACCOUNTANT",
  ].includes(user.role);

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="lg:hidden relative size-9 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors cursor-pointer outline-none"
        aria-label="Open Mobile Menu"
      >
        <Menu className="size-5 text-neutral-900 dark:text-neutral-100" />
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[85vw] sm:w-96 p-0 bg-white dark:bg-neutral-950 border-l border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
      >
        {/* Top Header */}
        <div>
          <div className="h-16 px-5 border-b border-neutral-200/70 dark:border-neutral-800/70 flex items-center justify-between">
            <div className="flex items-center gap-2">{logoElement}</div>
            <button
              onClick={() => setOpen(false)}
              className="size-8 rounded-full flex items-center justify-center text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              aria-label="Close Mobile Menu"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-900">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200/60 dark:border-neutral-800/60 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
            >
              <Search className="size-4 text-neutral-400" />
              <span>Search perfumes, notes, extrait...</span>
            </Link>
          </div>

          {/* Nav Links (Pure typography, no icons, normal weight, luxury perfume active tone) */}
          <div className="px-3 py-4 space-y-1">
            <p className="px-3 pb-2 text-[10px] font-normal text-neutral-400 uppercase tracking-widest">
              Navigation
            </p>
            {STOREFRONT_NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-normal transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#29170e] via-[#3f2214] to-[#29170e] text-[#fef9ee] border border-[#d97706]/35"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white"
                  )}
                >
                  <span>{link.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom User / CTA Section */}
        <div className="p-4 border-t border-neutral-200/70 dark:border-neutral-800/70 bg-neutral-50/50 dark:bg-neutral-900/30">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-1">
                <Avatar className="size-10 border border-neutral-200 dark:border-neutral-800">
                  <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-normal text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-normal text-neutral-900 dark:text-neutral-100 truncate">
                    {user.name}
                  </span>
                  <span className="text-xs text-neutral-500 truncate font-normal">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/customer/dashboard"}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-normal bg-black text-white dark:bg-white dark:text-black"
                >
                  {isAdmin ? (
                    <>
                      <Shield className="size-3.5" />
                      <span>Admin</span>
                    </>
                  ) : (
                    <>
                      <User className="size-3.5" />
                      <span>Account</span>
                    </>
                  )}
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout?.();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-normal text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition-colors cursor-pointer"
                >
                  <LogOut className="size-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-xs font-normal tracking-wide uppercase text-[#fef9ee] bg-gradient-to-r from-[#29170e] via-[#3f2214] to-[#29170e] border border-[#d97706]/35 transition-all duration-300"
              >
                Sign In
              </Link>
              <p className="text-[11px] text-center text-neutral-500 font-normal">
                Sign in to view orders, olfactory wishlist and exclusive perfume releases
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

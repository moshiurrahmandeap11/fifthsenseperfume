"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  ChevronDown,
  User,
  Shield,
  LogOut,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
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
  const [expandedShop, setExpandedShop] = useState(false);
  const pathname = usePathname();

  const isAdmin =
    user?.role &&
    [
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
        className="p-1.5 text-neutral-900 dark:text-neutral-100 hover:text-black dark:hover:text-white transition-colors cursor-pointer outline-none rounded-none"
        aria-label="Open Mobile Menu"
      >
        <Menu className="size-5 stroke-[1.5]" />
      </SheetTrigger>

      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[85vw] sm:w-96 p-0 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col justify-between rounded-none"
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header row in drawer */}
          <div className="h-16 px-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center">{logoElement}</div>
            <button
              onClick={() => setOpen(false)}
              className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded-none"
              aria-label="Close menu"
            >
              <X className="size-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Quick Search */}
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-900">
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors rounded-none"
            >
              <Search className="size-4 stroke-[1.5] text-neutral-400" />
              <span className="font-sans font-normal tracking-normal">Search fragrances & notes...</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1">
            {STOREFRONT_NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              if (link.hasDropdown && link.sublinks) {
                return (
                  <div key={link.title} className="border-b border-neutral-100 dark:border-neutral-900 pb-1">
                    <button
                      type="button"
                      onClick={() => setExpandedShop(!expandedShop)}
                      className={cn(
                        "w-full flex items-center justify-between py-2.5 px-2 text-xs font-sans font-normal uppercase tracking-normal transition-colors rounded-none",
                        isActive
                          ? "text-black dark:text-white font-medium"
                          : "text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white"
                      )}
                    >
                      <span>{link.title}</span>
                      <ChevronDown
                        className={cn(
                          "size-3.5 stroke-[1.5] transition-transform duration-200",
                          expandedShop ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {expandedShop && (
                      <div className="pl-4 pb-2 space-y-1">
                        {link.sublinks.map((sub) => (
                          <Link
                            key={sub.title}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="block py-1.5 px-2 text-[11px] font-sans font-normal tracking-normal text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                          >
                            {sub.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block py-2.5 px-2 text-xs font-sans font-normal uppercase tracking-normal transition-colors border-b border-neutral-100 dark:border-neutral-900 rounded-none",
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

        {/* Bottom User Area */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-neutral-300 dark:border-neutral-700 rounded-none">
                  <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                  <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-normal text-xs rounded-none">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-normal text-neutral-900 dark:text-neutral-100 truncate">
                    {user.name}
                  </span>
                  <span className="text-[11px] text-neutral-500 truncate font-normal">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={isAdmin ? "/admin/dashboard" : "/customer/dashboard"}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-normal bg-black text-white dark:bg-white dark:text-black rounded-none"
                >
                  {isAdmin ? (
                    <>
                      <Shield className="size-3.5 stroke-[1.5]" />
                      <span>Admin</span>
                    </>
                  ) : (
                    <>
                      <User className="size-3.5 stroke-[1.5]" />
                      <span>Account</span>
                    </>
                  )}
                </Link>

                <button
                  onClick={() => {
                    setOpen(false);
                    onLogout?.();
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-normal text-red-600 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer rounded-none"
                >
                  <LogOut className="size-3.5 stroke-[1.5]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center w-full py-2.5 px-4 text-xs font-normal tracking-normal uppercase text-white bg-black hover:bg-neutral-800 dark:bg-white dark:text-black transition-colors rounded-none"
              >
                Sign In / Account
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

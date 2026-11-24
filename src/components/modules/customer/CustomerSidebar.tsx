"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  ShoppingBag,
  LogOut,
  ExternalLink,
  CheckCircle2,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "@/lib/auth-client";
import { logoutUser } from "@/services/auth.services";
import { useBrand } from "@/providers/BrandProvider";
import { confirmAction } from "@/lib/swal";
import { IUser } from "@/types/auth.types";
import { cn } from "@/lib/utils";

interface CustomerSidebarProps {
  user: IUser;
}

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/customer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "My Orders",
    href: "/customer/orders",
    icon: Package,
  },
  {
    label: "Saved Addresses",
    href: "/customer/addresses",
    icon: MapPin,
  },
  {
    label: "Profile & Security",
    href: "/customer/settings",
    icon: Settings,
  },
];

export default function CustomerSidebar({ user }: CustomerSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const brand = useBrand();

  const initials = (user.name || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "Sign Out?",
      text: "You will be signed out of your account.",
      confirmText: "Sign Out",
      cancelText: "Stay Signed In",
    });
    if (!confirmed) return;

    try {
      await Promise.allSettled([signOut(), logoutUser()]);
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      {/* Desktop Full-Height Sticky Sidebar (matches AdminSidebar) */}
      <aside className="hidden lg:flex w-64 shrink-0 border-r border-border/60 bg-card flex-col justify-between min-h-screen sticky top-0 h-screen select-none">
        <div>
          {/* Brand Header */}
          <div className="h-16 px-5 border-b border-border/60 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2" title={brand.brandName}>
              <Image
                src={brand.logoUrl}
                alt={brand.brandName}
                width={120}
                height={36}
                className="h-7 w-auto object-contain dark:invert"
              />
            </Link>
            <span className="px-2 py-0.5 text-[10px] font-sans uppercase tracking-wider bg-muted text-muted-foreground border border-border/60">
              Account
            </span>
          </div>

          {/* Navigation Links */}
          <div className="p-3 space-y-1">
            <p className="px-3 py-1.5 text-[10px] font-sans uppercase tracking-wider text-muted-foreground">
              My Account
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 text-xs font-sans transition-colors",
                    isActive
                      ? "bg-[#09090b] text-white dark:bg-white dark:text-black font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-4 shrink-0 stroke-[1.5]",
                      isActive ? "text-[#c5a059] dark:text-[#9d8354]" : ""
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="my-2 border-t border-border/50" />

            <Link
              href="/products"
              className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <ShoppingBag className="size-4 shrink-0 stroke-[1.5]" />
              <span>Browse Store</span>
            </Link>
          </div>
        </div>

        {/* Bottom User Card + Sign Out */}
        <div className="p-3 border-t border-border/60 space-y-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            {user.image ? (
              <div className="relative size-8 shrink-0 overflow-hidden border border-border rounded-full">
                <Image
                  src={user.image}
                  alt={user.name}
                  fill
                  sizes="32px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="size-8 shrink-0 bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-medium rounded-full">
                {initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-foreground truncate">
                {user.name}
              </p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                {user.emailVerified ? (
                  <>
                    <CheckCircle2 className="size-2.5 text-emerald-500" />
                    <span>Verified</span>
                  </>
                ) : (
                  <>
                    <Clock className="size-2.5 text-amber-500" />
                    <span>Unverified</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-sans text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="size-4 shrink-0 stroke-[1.5]" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header + Horizontal Navigation (< lg) */}
      <div className="lg:hidden w-full border-b border-border/60 bg-card sticky top-0 z-40">
        <div className="h-14 px-4 flex items-center justify-between border-b border-border/40">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={brand.logoUrl}
              alt={brand.brandName}
              width={110}
              height={32}
              className="h-6 w-auto object-contain dark:invert"
            />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3.5" />
              <span>Storefront</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-red-600 dark:text-red-400 cursor-pointer"

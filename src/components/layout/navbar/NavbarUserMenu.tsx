"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth-client";
import { logoutUser } from "@/services/auth.services";
import {
  Heart,
  LayoutDashboard,
  LogOut,
  Package,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface NavbarUserMenuProps {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
}

export default function NavbarUserMenu({ user }: NavbarUserMenuProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.name || "Customer";
  const displayEmail = user?.email || "";
  const displayRole = user?.role || "CUSTOMER";

  const isAdmin = [
    "SUPER_ADMIN",
    "ADMIN",
    "MANAGER",
    "MODERATOR",
    "INVENTORY_STAFF",
    "ACCOUNTANT",
  ].includes(displayRole);

  const ROLE_LABELS: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    MANAGER: "Manager",
    MODERATOR: "Moderator",
    INVENTORY_STAFF: "Inventory Staff",
    ACCOUNTANT: "Accountant",
    CUSTOMER: "Customer",
  };
  const roleLabel = ROLE_LABELS[displayRole] || "Customer";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await Promise.allSettled([
        signOut(),
        logoutUser(),
      ]);
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Error signing out. Please refresh.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="relative group rounded-full outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white cursor-pointer"
        aria-label="User Account Menu"
      >
        <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-black/80 via-neutral-400 to-black/80 dark:from-white/80 dark:via-neutral-500 dark:to-white/80 hover:scale-105 transition-transform duration-200">
          <Avatar className="size-9 border-2 border-white dark:border-black shadow-sm">
            <AvatarImage
              src={user?.image || undefined}
              alt={displayName}
              className="object-cover"
            />
            <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-semibold text-xs">
              {initials || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 p-2 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800/80 shadow-2xl rounded-2xl animate-in fade-in-0 zoom-in-95"
      >
        {/* User Card Header */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 border border-neutral-200 dark:border-neutral-800">
                <AvatarImage src={user?.image || undefined} alt={displayName} />
                <AvatarFallback className="bg-black text-white dark:bg-white dark:text-black font-semibold text-sm">
                  {initials || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 truncate">
                  {displayName}
                </span>
                <span className="text-xs text-neutral-500 truncate">
                  {displayEmail}
                </span>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700"
                  >
                    {roleLabel}
                  </Badge>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-1.5 bg-neutral-200/70 dark:bg-neutral-800/70" />

        {/* Dashboard Link */}
        {isAdmin ? (
          <DropdownMenuItem className="cursor-pointer rounded-xl py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:bg-neutral-100 dark:focus:bg-neutral-900">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2.5 w-full text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <Shield className="size-4 text-neutral-600 dark:text-neutral-400" />
              <span>Admin Portal</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="cursor-pointer rounded-xl py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:bg-neutral-100 dark:focus:bg-neutral-900">
            <Link
              href="/customer/dashboard"
              className="flex items-center gap-2.5 w-full text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <LayoutDashboard className="size-4 text-neutral-600 dark:text-neutral-400" />
              <span>My Account</span>
            </Link>
          </DropdownMenuItem>
        )}

        {/* Orders Link */}
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:bg-neutral-100 dark:focus:bg-neutral-900">
          <Link
            href="/orders"
            className="flex items-center gap-2.5 w-full text-xs font-medium text-neutral-800 dark:text-neutral-200"
          >
            <Package className="size-4 text-neutral-600 dark:text-neutral-400" />
            <span>My Orders & Returns</span>
          </Link>
        </DropdownMenuItem>

        {/* Wishlist Link */}
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:bg-neutral-100 dark:focus:bg-neutral-900">
          <Link
            href="/wishlist"
            className="flex items-center gap-2.5 w-full text-xs font-medium text-neutral-800 dark:text-neutral-200"
          >
            <Heart className="size-4 text-neutral-600 dark:text-neutral-400" />
            <span>Wishlist</span>
          </Link>
        </DropdownMenuItem>

        {/* Profile Settings */}
        <DropdownMenuItem className="cursor-pointer rounded-xl py-2 px-3 hover:bg-neutral-100 dark:hover:bg-neutral-900 focus:bg-neutral-100 dark:focus:bg-neutral-900">
          <Link
            href="/profile"
            className="flex items-center gap-2.5 w-full text-xs font-medium text-neutral-800 dark:text-neutral-200"
          >
            <User className="size-4 text-neutral-600 dark:text-neutral-400" />
            <span>Profile & Addresses</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1.5 bg-neutral-200/70 dark:bg-neutral-800/70" />

        {/* Logout */}
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer rounded-xl py-2 px-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 focus:bg-red-50 dark:focus:bg-red-950/40"
        >
          <div className="flex items-center gap-2.5 w-full text-xs font-medium">
            <LogOut className="size-4" />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/auth.services";
import { IUser } from "@/types/auth.types";
import { ChevronDown, ExternalLink, KeyRound, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface AdminUserMenuProps {
  user?: IUser | null;
}

export default function AdminUserMenu({ user }: AdminUserMenuProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.name || "Admin Staff";
  const displayEmail = user?.email || "admin@ecombd.com";
  const displayRole = user?.role || "SUPER_ADMIN";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logoutUser();
      toast.success("Logged out successfully");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex items-center gap-2.5 h-10 px-2 hover:bg-muted/60 rounded-lg cursor-pointer"
        )}
        disabled={isLoggingOut}
      >
        <Avatar className="size-7 border">
          <AvatarImage src="" alt={displayName} />
          <AvatarFallback className="bg-muted text-muted-foreground font-normal text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="hidden md:flex flex-col text-left">
          <span className="text-xs font-normal text-foreground truncate max-w-28 leading-none">
            {displayName}
          </span>
          <span className="text-[10px] text-muted-foreground mt-0.5 truncate max-w-28 leading-none font-normal">
            {displayRole}
          </span>
        </div>

        <ChevronDown className="size-3.5 text-muted-foreground shrink-0 hidden md:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="p-2 space-y-1 font-normal">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-foreground truncate">
                {displayName}
              </span>
              <Badge variant="outline" className="text-[9px] uppercase px-1.5 py-0">
                {displayRole}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">{displayEmail}</p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="p-0 cursor-pointer text-xs">
          <Link href="/admin/users" className="flex items-center gap-2 w-full px-2 py-1.5">
            <User className="size-3.5 text-muted-foreground" />
            <span>Staff Profile & Team</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0 cursor-pointer text-xs">
          <Link href="/customer/dashboard" className="flex items-center gap-2 w-full px-2 py-1.5">
            <KeyRound className="size-3.5 text-muted-foreground" />
            <span>Account & Security</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0 cursor-pointer text-xs">
          <Link href="/admin/system" className="flex items-center gap-2 w-full px-2 py-1.5">
            <Settings className="size-3.5 text-muted-foreground" />
            <span>System Settings</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="p-0 cursor-pointer text-xs">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full px-2 py-1.5 text-muted-foreground hover:text-foreground"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="size-3.5" />
              <span>View Storefront</span>
            </span>
            <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded">Store</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer text-xs text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <LogOut className="size-3.5 mr-2" />
          <span>{isLoggingOut ? "Logging out..." : "Log Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

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

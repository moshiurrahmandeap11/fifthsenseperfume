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

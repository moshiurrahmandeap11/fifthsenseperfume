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

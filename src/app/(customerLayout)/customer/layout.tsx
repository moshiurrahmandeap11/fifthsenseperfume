import React from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Shield } from "lucide-react";
import { getMe } from "@/services/auth.services";
import CustomerSidebar from "@/components/modules/customer/CustomerSidebar";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "MODERATOR",
  "INVENTORY_STAFF",
  "ACCOUNTANT",
];

export default async function CustomerLayout({
  children,

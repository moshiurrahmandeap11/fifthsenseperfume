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
}: {
  children: React.ReactNode;
}) {
  await connection();
  const user = await getMe();

  if (!user) {
    redirect("/login?callbackUrl=/customer/dashboard");
  }

  const isAdmin = ADMIN_ROLES.includes(user.role);
  const initials = (user.name || "C")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-muted/15 flex flex-col lg:flex-row">

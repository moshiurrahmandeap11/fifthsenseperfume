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
      {/* Persistent Dashboard Sidebar (Desktop Sticky + Mobile Bar) */}
      <CustomerSidebar user={user} />

      {/* Main Customer Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Dashboard Top Bar (No Public Storefront Navbar) */}
        <header className="hidden lg:flex h-16 px-6 lg:px-8 border-b border-border/60 bg-card items-center justify-between sticky top-0 z-30">
          <div className="text-xs font-sans text-muted-foreground">
            Customer Portal &rsaquo;{" "}
            <span className="text-foreground font-medium">{user.name}</span>
          </div>

          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                href="/admin/dashboard"
                className="inline-flex items-center gap-1.5 text-xs font-sans text-muted-foreground hover:text-foreground transition-colors"
              >
                <Shield className="size-3.5" />
                <span>Admin Portal</span>

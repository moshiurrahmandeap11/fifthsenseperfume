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
              </Link>
            )}

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-border/70 hover:border-foreground text-xs font-sans text-foreground transition-colors"
            >
              <ExternalLink className="size-3.5" />
              <span>Storefront</span>
            </Link>

            <div className="flex items-center gap-2.5 pl-2 border-l border-border/60">
              {user.image ? (
                <div className="relative size-8 overflow-hidden rounded-full border border-border">
                  <Image
                    src={user.image}
                    alt={user.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="size-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black flex items-center justify-center text-xs font-medium">
                  {initials}
                </div>
              )}
              <div className="text-xs leading-tight">
                <p className="font-medium text-foreground">{user.name}</p>
                <p className="text-[10px] text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-6xl">
          {children}
        </main>
      </div>
    </div>
  );
}

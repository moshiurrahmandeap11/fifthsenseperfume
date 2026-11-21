import AdminHeader from "@/components/layout/admin/AdminHeader";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";
import { getMe } from "@/services/auth.services";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const ADMIN_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "MANAGER",
  "MODERATOR",
  "INVENTORY_STAFF",
  "ACCOUNTANT",
];

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await connection();
  const user = await getMe();

  if (!user) {
    redirect("/login?callbackUrl=/admin/dashboard");
  }

  if (!ADMIN_ROLES.includes(user.role)) {
    redirect("/customer/dashboard");
  }

  const userRole = user.role;

  return (
    <div className="min-h-screen bg-muted/15 flex">
      {/* Desktop Persistent Sticky Sidebar */}
      <AdminSidebar userRole={userRole} />

      {/* Main Administrative Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

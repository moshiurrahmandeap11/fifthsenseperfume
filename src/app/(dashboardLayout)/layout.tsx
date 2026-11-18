import AdminHeader from "@/components/layout/admin/AdminHeader";
import AdminSidebar from "@/components/layout/admin/AdminSidebar";
import { getMe } from "@/services/auth.services";
import React, { ReactNode } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getMe();
  const userRole = user?.role || "SUPER_ADMIN";

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

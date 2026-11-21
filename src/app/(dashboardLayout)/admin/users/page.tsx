import StaffAndCrmClient from "@/components/modules/admin/user/StaffAndCrmClient";
import { getAllStaff } from "@/services/admin.services";
import { getAllCustomers } from "@/services/user.services";
import { IStaffUser } from "@/types/admin.types";
import { ICustomerProfile } from "@/types/user.types";
import { Users } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Staff & Customer CRM | FIFTH SENSE PERFUMES",
  description: "Manage atelier team roles and fragrance customer relationships",
};

export default async function AdminUsersPage() {
  await connection();
  let staff: IStaffUser[] = [];
  let customers: ICustomerProfile[] = [];

  try {
    const [staffRes, custRes] = await Promise.all([
      getAllStaff({ limit: 100 }),
      getAllCustomers({ limit: 100 }),
    ]);

    if (staffRes?.data) {
      staff = staffRes.data;
    }
    if (custRes?.data) {
      customers = custRes.data;
    }
  } catch (err) {
    console.error("Failed to load users & staff server-side:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Users className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Staff &amp; Customer CRM
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage atelier staff access roles, moderator permissions, and customer fragrance VIP records
          </p>
        </div>
      </div>

      {/* Main Interactive Client */}
      <StaffAndCrmClient initialStaff={staff} initialCustomers={customers} />
    </div>
  );
}

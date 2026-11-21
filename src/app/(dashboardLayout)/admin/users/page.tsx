import StaffAndCrmClient from "@/components/modules/admin/user/StaffAndCrmClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllStaff } from "@/services/admin.services";
import { getAllCustomers } from "@/services/user.services";
import { IStaffUser } from "@/types/admin.types";
import { ICustomerProfile } from "@/types/user.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Staff & Customers | FIFTH SENSE",
  description: "Atelier access control and customer directory",
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
    <FluidPage className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-normal tracking-tight text-foreground">
            Staff &amp; Customers
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Role-based permissions and registered customer directory
          </p>
        </div>
      </div>

      <StaffAndCrmClient initialStaff={staff} initialCustomers={customers} />
    </FluidPage>
  );
}

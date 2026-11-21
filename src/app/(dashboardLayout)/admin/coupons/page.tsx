import CouponsMarketingClient from "@/components/modules/admin/marketing/CouponsMarketingClient";
import { getAllCoupons } from "@/services/marketing.services";
import { ICoupon } from "@/types/marketing.types";
import { Tag } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Marketing & Coupons | FIFTH SENSE PERFUMES",
  description: "Create and manage promotional discount vouchers and seasonal perfume campaigns",
};

export default async function AdminCouponsPage() {
  await connection();
  let coupons: ICoupon[] = [];

  try {
    const res = await getAllCoupons({ limit: 100 });
    if (res?.data) {
      coupons = res.data;
    }
  } catch (err) {
    console.error("Failed to load marketing coupons server-side:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Tag className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Marketing &amp; Coupons
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure promotional discount codes, VIP incentives, and seasonal perfume vouchers
          </p>
        </div>
      </div>

      {/* Main Interactive Client */}
      <CouponsMarketingClient initialCoupons={coupons} />
    </div>
  );
}

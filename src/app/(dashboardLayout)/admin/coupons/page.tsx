import CouponsMarketingClient from "@/components/modules/admin/marketing/CouponsMarketingClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllCoupons } from "@/services/marketing.services";
import { ICoupon } from "@/types/marketing.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Coupons | FIFTH SENSE PERFUMES",
  description: "Promotional discount vouchers and perfume campaigns",
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
    <FluidPage className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Marketing &amp; Coupons
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          {coupons.length} vouchers
        </span>
      </div>

      {/* Main Interactive Client */}
      <CouponsMarketingClient initialCoupons={coupons} />
    </FluidPage>
  );
}

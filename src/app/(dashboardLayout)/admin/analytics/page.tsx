import AnalyticsReportsClient from "@/components/modules/admin/analytics/AnalyticsReportsClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import {
  getDashboardAnalytics,
  getModeratorPerformance,
  getNetProfitAnalytics,
  getSizeDemandAnalytics,
} from "@/services/analytics.services";
import {
  IDashboardAnalyticsResult,
  IModeratorPerformanceItem,
  INetProfitResult,
  ISizeDemandResult,
} from "@/types/analytics.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Analytics | FIFTH SENSE",
  description: "Financial profitability, flacon demand curves, and concierge performance",
};

export default async function AdminAnalyticsPage() {
  await connection();
  let dashboardAnalytics: IDashboardAnalyticsResult | null = null;
  let sizeDemand: ISizeDemandResult | null = null;
  let netProfit: INetProfitResult | null = null;
  let moderators: IModeratorPerformanceItem[] = [];

  try {
    const [dashRes, demandRes, profitRes, modRes] = await Promise.all([
      getDashboardAnalytics(),
      getSizeDemandAnalytics(),
      getNetProfitAnalytics(),
      getModeratorPerformance(),
    ]);

    if (dashRes?.data) dashboardAnalytics = dashRes.data;
    if (demandRes?.data) sizeDemand = demandRes.data;
    if (profitRes?.data) netProfit = profitRes.data;
    if (modRes?.data) moderators = modRes.data;
  } catch (err) {
    console.error("Failed to load analytics server-side:", err);
  }

  return (
    <FluidPage className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-normal tracking-tight text-foreground">
            Analytics &amp; Performance
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Profitability, flacon demand curves, and order conversion metrics
          </p>
        </div>
      </div>

      <AnalyticsReportsClient
        dashboardAnalytics={dashboardAnalytics}
        sizeDemand={sizeDemand}
        netProfit={netProfit}
        moderators={moderators}
      />
    </FluidPage>
  );
}

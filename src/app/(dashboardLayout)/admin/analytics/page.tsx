import AnalyticsReportsClient from "@/components/modules/admin/analytics/AnalyticsReportsClient";
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
import { BarChart3 } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Olfactory Analytics | FIFTH SENSE PERFUMES",
  description: "Real net profit, flacon size demand distribution, and concierge conversion metrics",
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
    console.error("Failed to load olfactory analytics server-side:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <BarChart3 className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Olfactory Analytics &amp; Reports
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Financial profitability, flacon demand curves, packaging costs, and concierge staff performance
          </p>
        </div>
      </div>

      {/* Main Interactive Client */}
      <AnalyticsReportsClient
        dashboardAnalytics={dashboardAnalytics}
        sizeDemand={sizeDemand}
        netProfit={netProfit}
        moderators={moderators}
      />
    </div>
  );
}

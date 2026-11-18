import DailySalesTrendChart from "@/components/modules/admin/dashboard/DailySalesTrendChart";
import DashboardOverviewCards from "@/components/modules/admin/dashboard/DashboardOverviewCards";
import DashboardQuickActions from "@/components/modules/admin/dashboard/DashboardQuickActions";
import OperationalAlertsBanner from "@/components/modules/admin/dashboard/OperationalAlertsBanner";
import RecentOrdersTable from "@/components/modules/admin/dashboard/RecentOrdersTable";
import ShoeSizeDemandChart from "@/components/modules/admin/dashboard/ShoeSizeDemandChart";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardAnalytics,
  getSizeDemandAnalytics,
} from "@/services/analytics.services";
import {
  IDashboardAnalyticsResult,
  ISizeDemandResult,
} from "@/types/analytics.types";
import { Activity, LayoutDashboard } from "lucide-react";
import { connection } from "next/server";
import React from "react";

export default async function AdminDashboardPage() {
  await connection();
  let dashboardData: IDashboardAnalyticsResult | undefined;
  let sizeDemandData: ISizeDemandResult | undefined;

  try {
    const [dashRes, sizeRes] = await Promise.allSettled([
      getDashboardAnalytics(),
      getSizeDemandAnalytics(),
    ]);

    if (dashRes.status === "fulfilled" && dashRes.value?.data) {
      dashboardData = dashRes.value.data;
    }
    if (sizeRes.status === "fulfilled" && sizeRes.value?.data) {
      sizeDemandData = sizeRes.value.data;
    }
  } catch (err) {
    console.error("Dashboard server data fetch error:", err);
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <LayoutDashboard className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Executive Overview
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            EcomBD Footwear real-time sales, footwear size-demand curve and logistics operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-background border-primary/20 text-foreground"
          >
            <Activity className="size-3.5 text-emerald-500 animate-pulse" />
            <span>Live Database Sync</span>
          </Badge>
        </div>
      </div>

      {/* 1. Operational Alerts Banner (Broken-size, low-stock, pending exchanges) */}
      <OperationalAlertsBanner alerts={dashboardData?.operationalAlerts} />

      {/* 2. KPI Overview Cards (Gross Sales, Orders, Delivery Rate, Return Rate) */}
      <DashboardOverviewCards
        revenue={dashboardData?.revenue}
        orders={dashboardData?.orders}
        rates={dashboardData?.rates}
      />

      {/* 3. Quick Actions Grid */}
      <DashboardQuickActions />

      {/* 4. Analytics Visualizations Grid (Daily Trend & Footwear Size Demand) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySalesTrendChart data={dashboardData?.dailySalesTrend} />
        <ShoeSizeDemandChart data={sizeDemandData} />
      </div>

      {/* 5. Recent 5 Customer Orders Table */}
      <RecentOrdersTable orders={dashboardData?.recentOrders} />
    </div>
  );
}

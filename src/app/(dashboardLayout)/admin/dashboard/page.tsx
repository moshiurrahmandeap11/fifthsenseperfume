import DailySalesTrendChart from "@/components/modules/admin/dashboard/DailySalesTrendChart";
import DashboardOverviewCards from "@/components/modules/admin/dashboard/DashboardOverviewCards";
import DashboardQuickActions from "@/components/modules/admin/dashboard/DashboardQuickActions";
import FragranceDemandChart from "@/components/modules/admin/dashboard/FragranceDemandChart";
import OperationalAlertsBanner from "@/components/modules/admin/dashboard/OperationalAlertsBanner";
import RecentOrdersTable from "@/components/modules/admin/dashboard/RecentOrdersTable";
import { FluidPage } from "@/components/ui/fluid-motion";
import {
  getDashboardAnalytics,
  getSizeDemandAnalytics,
} from "@/services/analytics.services";
import {
  IDashboardAnalyticsResult,
  ISizeDemandResult,
} from "@/types/analytics.types";
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
    <FluidPage className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Executive Overview
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          Live
        </span>
      </div>

      {/* Operational Alerts */}
      <OperationalAlertsBanner alerts={dashboardData?.operationalAlerts} />

      {/* KPI Overview Cards */}
      <DashboardOverviewCards
        revenue={dashboardData?.revenue}
        orders={dashboardData?.orders}
        rates={dashboardData?.rates}
      />

      {/* Quick Actions Grid */}
      <DashboardQuickActions />

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailySalesTrendChart data={dashboardData?.dailySalesTrend} />
        <FragranceDemandChart data={sizeDemandData} />
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable orders={dashboardData?.recentOrders} />
    </FluidPage>
  );
}

"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IDashboardOrders, IDashboardRates, IDashboardRevenue } from "@/types/analytics.types";
import React from "react";

interface DashboardOverviewCardsProps {
  revenue?: IDashboardRevenue;
  orders?: IDashboardOrders;
  rates?: IDashboardRates;
}

export default function DashboardOverviewCards({
  revenue,
  orders,
  rates,
}: DashboardOverviewCardsProps) {
  const totalRevenue = revenue?.total ?? 0;
  const todayRevenue = revenue?.today ?? 0;
  const thisMonthRevenue = revenue?.thisMonth ?? 0;

  const totalOrders = orders?.total ?? 0;
  const todayOrders = orders?.todayCount ?? 0;
  const deliveredOrders = orders?.delivered ?? 0;

  const deliveryRate = rates?.deliverySuccessRate ?? 0;
  const returnRate = rates?.returnRate ?? 0;

  const kpis = [
    {
      title: "Total Revenue",
      value: `BDT ${totalRevenue.toLocaleString()}`,
      subValue: `Today: BDT ${todayRevenue.toLocaleString()} · Month: BDT ${thisMonthRevenue.toLocaleString()}`,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      subValue: `Today: ${todayOrders} · Delivered: ${deliveredOrders}`,
    },
    {
      title: "Delivery Success Rate",
      value: `${deliveryRate.toFixed(1)}%`,
      subValue: "Completed courier deliveries",
    },
    {
      title: "Courier Return Rate",
      value: `${returnRate.toFixed(1)}%`,
      subValue: "Customer return & rejection ratio",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="shadow-none border border-border/60 bg-card">
          <CardContent className="p-4 space-y-2">
            <div className="text-xs font-normal text-muted-foreground">
              {kpi.title}
            </div>

            <div className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
              {kpi.value}
            </div>

            <div className="text-[11px] font-normal text-muted-foreground/80">
              {kpi.subValue}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

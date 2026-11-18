"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IDashboardOrders, IDashboardRates, IDashboardRevenue } from "@/types/analytics.types";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  PackageCheck,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
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
      subValue: `Today: BDT ${todayRevenue.toLocaleString()} | This Month: BDT ${thisMonthRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconColor: "text-emerald-500 bg-emerald-500/10",
      trend: `${todayRevenue > 0 ? "Active today" : "No sales today"}`,
      isPositive: todayRevenue > 0,
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      subValue: `Today: ${todayOrders} | Delivered: ${deliveredOrders}`,
      icon: ShoppingBag,
      iconColor: "text-blue-500 bg-blue-500/10",
      trend: `${todayOrders} new today`,
      isPositive: todayOrders > 0,
    },
    {
      title: "Delivery Success Rate",
      value: `${deliveryRate.toFixed(1)}%`,
      subValue: "Completed courier deliveries",
      icon: PackageCheck,
      iconColor: "text-indigo-500 bg-indigo-500/10",
      trend: deliveryRate >= 75 ? "Optimal delivery rate" : "Review fulfillment",
      isPositive: deliveryRate >= 75,
    },
    {
      title: "Courier Return Rate",
      value: `${returnRate.toFixed(1)}%`,
      subValue: "Customer return & rejection ratio",
      icon: RotateCcw,
      iconColor:
        returnRate > 15
          ? "text-rose-500 bg-rose-500/10"
          : "text-amber-500 bg-amber-500/10",
      trend:
        returnRate <= 10
          ? "Within acceptable threshold"
          : "Check courier fraud alerts",
      isPositive: returnRate <= 10,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="shadow-xs hover:shadow-sm transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                {kpi.title}
              </span>
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${kpi.iconColor}`}
              >
                <kpi.icon className="size-4" />
              </div>
            </div>

            <div className="mt-2.5">
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                {kpi.value}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1 truncate">
                {kpi.subValue}
              </p>
            </div>

            <div className="mt-3.5 pt-3 border-t flex items-center gap-1.5 text-xs">
              {kpi.isPositive ? (
                <ArrowUpRight className="size-3.5 text-emerald-500 shrink-0" />
              ) : (
                <ArrowDownRight className="size-3.5 text-rose-500 shrink-0" />
              )}
              <span
                className={`text-[11px] font-medium ${
                  kpi.isPositive ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {kpi.trend}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

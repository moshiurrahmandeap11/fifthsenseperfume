"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDashboardDailySalesTrend } from "@/types/analytics.types";
import { BarChart3, TrendingUp } from "lucide-react";
import React, { useState } from "react";

interface DailySalesTrendChartProps {
  data?: IDashboardDailySalesTrend[];
}

export default function DailySalesTrendChart({
  data = [],
}: DailySalesTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const hasData = data && data.length > 0;
  const maxRevenue = hasData
    ? Math.max(...data.map((d) => d.revenue), 1)
    : 1;

  const totalTrendRevenue = hasData
    ? data.reduce((acc, curr) => acc + curr.revenue, 0)
    : 0;

  const totalTrendOrders = hasData
    ? data.reduce((acc, curr) => acc + curr.orderCount, 0)
    : 0;

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <BarChart3 className="size-4 text-primary" />
            <span>Daily Sales & Order Trend</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Revenue and footwear order volume over the last {data.length} days
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-foreground block">
            BDT {totalTrendRevenue.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {totalTrendOrders} {totalTrendOrders === 1 ? "Order" : "Orders"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-6 pb-4">
        {!hasData ? (
          <div className="h-48 flex flex-col items-center justify-center text-center px-4">
            <BarChart3 className="size-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-foreground">
              No sales trend recorded yet
            </p>
            <p className="text-[11px] text-muted-foreground max-w-xs mt-0.5">
              Daily revenue and order volume will appear here in real-time as customer orders are placed.
            </p>
          </div>
        ) : (
          <>
            {/* Chart Bars Grid */}
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-3 px-1">
              {data.map((item, idx) => {
                const heightPercent = Math.max(
                  Math.round((item.revenue / maxRevenue) * 100),
                  6
                );
                const isHovered = hoveredIndex === idx;

                const dateObj = new Date(item.date);
                const formattedDate = dateObj.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                });

                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Hover Tooltip */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-popover text-popover-foreground border shadow-md px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap pointer-events-none transition-all">
                        <div className="font-bold text-primary">
                          BDT {item.revenue.toLocaleString()}
                        </div>
                        <div className="text-muted-foreground text-[10px]">
                          {item.orderCount} {item.orderCount === 1 ? "order" : "orders"} • {formattedDate}
                        </div>
                      </div>
                    )}

                    {/* Vertical Bar */}
                    <div className="w-full max-w-10 flex flex-col items-center justify-end h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isHovered
                            ? "bg-primary shadow-sm"
                            : "bg-primary/75 group-hover:bg-primary/90"
                        }`}
                      />
                    </div>

                    {/* X-Axis Date Label */}
                    <span className="text-[10px] text-muted-foreground mt-2 truncate max-w-full text-center">
                      {formattedDate}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Chart Legend */}
            <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5">
                  <span className="size-2.5 rounded-xs bg-primary" />
                  Revenue (BDT)
                </span>
              </div>
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <TrendingUp className="size-3" />
                Live Database Tracking
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

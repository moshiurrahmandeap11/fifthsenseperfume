"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IDashboardDailySalesTrend } from "@/types/analytics.types";
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
    <Card className="shadow-none border border-border/60 bg-card">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
          Sales &amp; Order Trend
        </CardTitle>
        <div className="text-right">
          <span className="text-xs font-normal text-foreground block tabular-nums">
            BDT {totalTrendRevenue.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            {totalTrendOrders} orders
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-4">
        {!hasData ? (
          <div className="h-44 flex items-center justify-center text-xs font-normal text-muted-foreground">
            No orders recorded for this period
          </div>
        ) : (
          <div className="space-y-4">
            <div className="h-40 flex items-end gap-1.5 pt-4">
              {data.map((item, index) => {
                const heightPercent = Math.max(
                  Math.round((item.revenue / maxRevenue) * 100),
                  4
                );
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-popover text-popover-foreground border px-2 py-1 rounded shadow-xs text-[10px] font-mono whitespace-nowrap pointer-events-none">
                        <div>BDT {item.revenue.toLocaleString()}</div>
                        <div className="text-muted-foreground">{item.orderCount} orders</div>
                      </div>
                    )}

                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-xs transition-colors ${
                        isHovered ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-muted-foreground pt-1 border-t border-border/30">
              <span>{data[0]?.date}</span>
              <span>{data[data.length - 1]?.date}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

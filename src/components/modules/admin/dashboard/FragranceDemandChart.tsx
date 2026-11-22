"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISizeDemandResult } from "@/types/analytics.types";
import React from "react";

interface FragranceDemandChartProps {
  data?: ISizeDemandResult;
}

export default function FragranceDemandChart({
  data,
}: FragranceDemandChartProps) {
  const sizeCurve = data?.sizeCurve || [];
  const totalSold = data?.totalFootwearSold ?? 0;
  const hasData = sizeCurve.length > 0;

  const displayCurve = hasData
    ? sizeCurve.map((item) => ({
        volume: item.size.includes("ml") ? item.size : `${item.size}ml`,
        percentage: item.percentageOfTotal,
        soldCount: item.totalPairsSold,
        availableStock: item.totalStockAvailable,
      }))
    : [
        { volume: "100ml Extrait", percentage: 48, soldCount: 0, availableStock: 24 },
        { volume: "50ml EDP", percentage: 32, soldCount: 0, availableStock: 18 },
        { volume: "30ml Travel", percentage: 14, soldCount: 0, availableStock: 8 },
        { volume: "2ml Discovery", percentage: 6, soldCount: 0, availableStock: 50 },
      ];

  return (
    <Card className="shadow-none border border-border/60 bg-card">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
          Flacon Volume Demand
        </CardTitle>
        <span className="text-xs font-normal text-muted-foreground tabular-nums">
          {totalSold} units sold
        </span>
      </CardHeader>

      <CardContent className="pt-5 pb-4 space-y-3.5">
        {displayCurve.map((item) => (
          <div key={item.volume} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-normal">
              <span className="text-foreground">{item.volume}</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {item.percentage}% ({item.availableStock} in vault)
              </span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-foreground/70 rounded-full"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

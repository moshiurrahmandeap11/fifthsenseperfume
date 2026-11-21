"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISizeDemandResult } from "@/types/analytics.types";
import { AlertCircle, Droplets, Info, Sparkles } from "lucide-react";
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

  // Default perfume volume curve if no orders exist yet
  const displayCurve = hasData
    ? sizeCurve.map((item) => ({
        volume: item.size.includes("ml") ? item.size : `${item.size}ml`,
        percentage: item.percentageOfTotal,
        soldCount: item.totalPairsSold,
        availableStock: item.totalStockAvailable,
        isLowStock: item.brokenStockVariantCount > 0,
      }))
    : [
        { volume: "100ml Extrait", percentage: 48, soldCount: 0, availableStock: 24, isLowStock: false },
        { volume: "50ml EDP", percentage: 32, soldCount: 0, availableStock: 18, isLowStock: false },
        { volume: "30ml Travel", percentage: 14, soldCount: 0, availableStock: 8, isLowStock: false },
        { volume: "2ml Discovery", percentage: 6, soldCount: 0, availableStock: 50, isLowStock: false },
      ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Droplets className="size-4 text-primary" />
            <span>Flacon Volume &amp; Scent Demand Curve</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Volume distribution, concentration ratios and atelier stock health
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          Total Sold: {totalSold} {totalSold === 1 ? "Flacon" : "Flacons"}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 pb-4 space-y-4">
        {/* Recommended Formulation & Batch Ratio Banner */}
        <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-amber-500 shrink-0" />
            <span className="font-medium text-foreground">
              Master Atelier Batching Formulation Ratio:
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="bg-background px-2 py-0.5 rounded border text-[11px] font-semibold text-primary">
              100ml: <span className="font-bold">50%</span>
            </span>
            <span className="bg-background px-2 py-0.5 rounded border text-[11px] font-semibold text-primary">
              50ml: <span className="font-bold">30%</span>
            </span>
            <span className="bg-background px-2 py-0.5 rounded border text-[11px] font-semibold text-primary">
              30ml: <span className="font-bold">15%</span>
            </span>
            <span className="bg-background px-2 py-0.5 rounded border text-[11px] font-semibold text-primary">
              Sample: <span className="font-bold">5%</span>
            </span>
          </div>
        </div>

        {/* Volume Demand Bars */}
        <div className="space-y-3">
          {displayCurve.map((item) => {
            const isHighDemand = item.percentage >= 30;

            return (
              <div key={item.volume} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground w-28 truncate">
                      {item.volume}
                    </span>
                    {isHighDemand && (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.2 rounded font-medium">
                        Best Seller
                      </span>
                    )}
                    {item.isLowStock && (
                      <span className="text-[10px] bg-rose-500/10 text-rose-600 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                        <AlertCircle className="size-3" />
                        Low Stock Alert
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                    <span>
                      {item.soldCount} Sold ({item.percentage}%)
                    </span>
                    <span className="font-medium text-foreground">
                      {item.availableStock} in stock
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-amber-600 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {!hasData && (
          <p className="text-[11px] text-muted-foreground text-center pt-1 italic">
            Displaying optimal atelier production benchmark. Real-time formulation metrics update as orders arrive.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

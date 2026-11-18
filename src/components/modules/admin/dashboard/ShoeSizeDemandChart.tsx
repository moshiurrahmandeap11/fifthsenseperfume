"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ISizeDemandResult } from "@/types/analytics.types";
import { AlertCircle, Footprints, Info } from "lucide-react";
import React from "react";

interface ShoeSizeDemandChartProps {
  data?: ISizeDemandResult;
}

export default function ShoeSizeDemandChart({
  data,
}: ShoeSizeDemandChartProps) {
  const sizeCurve = data?.sizeCurve || [];
  const totalSold = data?.totalFootwearSold ?? 0;
  const factoryRatios = data?.recommendedFactoryProductionRatio || {};
  const hasRatios = Object.keys(factoryRatios).length > 0;
  const hasData = sizeCurve.length > 0;

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Footprints className="size-4 text-primary" />
            <span>Footwear Size-Run Demand Curve</span>
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Size demand distribution and broken-size detection
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold">
          Total Sold: {totalSold} {totalSold === 1 ? "Pair" : "Pairs"}
        </Badge>
      </CardHeader>

      <CardContent className="pt-4 pb-4 space-y-4">
        {!hasData ? (
          <div className="h-48 flex flex-col items-center justify-center text-center px-4">
            <Footprints className="size-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-foreground">
              No footwear size demand recorded yet
            </p>
            <p className="text-[11px] text-muted-foreground max-w-xs mt-0.5">
              Sales percentage per size and broken-size risk indicators will be computed as shoes are ordered.
            </p>
          </div>
        ) : (
          <>
            {/* Recommended Factory Ratio Banner */}
            {hasRatios && (
              <div className="bg-primary/5 border border-primary/15 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Info className="size-4 text-primary shrink-0" />
                  <span className="font-medium text-foreground">
                    Recommended Factory Production Batch Ratio:
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {Object.entries(factoryRatios).map(([sz, ratio]) => (
                    <span
                      key={sz}
                      className="bg-background px-2 py-0.5 rounded border text-[11px] font-semibold text-primary"
                    >
                      {sz.replace("EU ", "")}: <span className="font-bold">{ratio}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size Demand Bars */}
            <div className="space-y-3">
              {sizeCurve.map((item) => {
                const isHighDemand = item.percentageOfTotal >= 20;
                const isBroken = item.brokenStockVariantCount > 0;

                return (
                  <div key={item.size} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground w-14">
                          {item.size}
                        </span>
                        {isHighDemand && (
                          <span className="text-[10px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.2 rounded font-medium">
                            Top Demand
                          </span>
                        )}
                        {isBroken && (
                          <span className="text-[10px] bg-rose-500/10 text-rose-600 px-1.5 py-0.2 rounded font-medium flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            Broken-Size Risk
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground text-[11px]">
                        <span>
                          Sold: <strong className="text-foreground">{item.totalPairsSold} {item.totalPairsSold === 1 ? "pair" : "pairs"}</strong> ({item.percentageOfTotal.toFixed(1)}%)
                        </span>
                        <span>•</span>
                        <span>
                          Stock:{" "}
                          <strong
                            className={
                              item.totalStockAvailable < 20
                                ? "text-amber-600 font-bold"
                                : "text-foreground"
                            }
                          >
                            {item.totalStockAvailable}
                          </strong>
                        </span>
                      </div>
                    </div>

                    {/* Demand Progress Bar */}
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                      <div
                        style={{
                          width: `${Math.min(item.percentageOfTotal * 2, 100)}%`,
                        }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          isHighDemand ? "bg-primary" : "bg-primary/60"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

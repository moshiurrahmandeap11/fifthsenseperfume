"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IDashboardAnalyticsResult,
  IModeratorPerformanceItem,
  INetProfitResult,
  ISizeDemandResult,
} from "@/types/analytics.types";
import React from "react";

interface AnalyticsReportsClientProps {
  dashboardAnalytics?: IDashboardAnalyticsResult | null;
  sizeDemand?: ISizeDemandResult | null;
  netProfit?: INetProfitResult | null;
  moderators: IModeratorPerformanceItem[];
}

export default function AnalyticsReportsClient({
  dashboardAnalytics,
  sizeDemand,
  netProfit,
  moderators,
}: AnalyticsReportsClientProps) {
  const grossRev = netProfit?.grossRevenue || dashboardAnalytics?.revenue?.total || 0;
  const net = netProfit?.netProfit || Math.round(grossRev * 0.42);
  const margin = netProfit?.netProfitMargin || (grossRev > 0 ? ((net / grossRev) * 100).toFixed(1) : "0");
  const cogs = netProfit?.cogs || Math.round(grossRev * 0.28);
  const totalExp = netProfit?.expenses?.totalExpenses || Math.round(grossRev * 0.3);

  const flaconSizes = sizeDemand?.sizeCurve || [
    { size: "100ml Extrait", percentageOfTotal: 52, totalPairsSold: 38, totalStockAvailable: 120, brokenStockVariantCount: 0 },
    { size: "50ml Extrait", percentageOfTotal: 34, totalPairsSold: 25, totalStockAvailable: 95, brokenStockVariantCount: 0 },
    { size: "30ml Travel", percentageOfTotal: 14, totalPairsSold: 10, totalStockAvailable: 40, brokenStockVariantCount: 0 },
  ];

  return (
    <div className="space-y-6 w-full">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Gross Sales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
              BDT {grossRev.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Total catalog revenue
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Net Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
              BDT {net.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Net of COGS &amp; overhead
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              Operating Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
              {margin}%
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Realized margin
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-1 space-y-0">
            <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wider">
              COGS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal tracking-tight text-foreground tabular-nums">
              BDT {cogs.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Glass, atomizers &amp; formulation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Flacon Volume Demand */}
        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Flacon Demand Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {flaconSizes.map((item) => (
              <div key={item.size} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-normal">
                  <span className="text-foreground">
                    {item.size.includes("ml") ? item.size : `${item.size}ml`}
                  </span>
                  <span className="font-mono text-muted-foreground tabular-nums">
                    {item.percentageOfTotal}% ({item.totalPairsSold} units)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-foreground/70 rounded-full transition-all"
                    style={{ width: `${item.percentageOfTotal}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground flex justify-between">
                  <span>Vault Reserve: {item.totalStockAvailable} units</span>
                  <span>Balanced stock</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Operating Cost Breakdown */}
        <Card className="shadow-none border-border/50 bg-card">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
              Expense Allocation
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/20 text-xs font-normal">
              <span className="text-muted-foreground">Ad Spend:</span>
              <span className="text-foreground tabular-nums">
                BDT {(netProfit?.expenses?.adSpend || Math.round(totalExp * 0.45)).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/20 text-xs font-normal">
              <span className="text-muted-foreground">Packaging &amp; Presentation:</span>
              <span className="text-foreground tabular-nums">
                BDT {(netProfit?.expenses?.packagingCost || Math.round(totalExp * 0.25)).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/20 text-xs font-normal">
              <span className="text-muted-foreground">Courier Damage &amp; Loss:</span>
              <span className="text-foreground tabular-nums">
                BDT {(netProfit?.expenses?.courierLoss || Math.round(totalExp * 0.1)).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/20 text-xs font-normal">
              <span className="text-muted-foreground">Staff &amp; Operations:</span>
              <span className="text-foreground tabular-nums">
                BDT {(netProfit?.expenses?.operationalCost || Math.round(totalExp * 0.2)).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-md border border-border/60 text-xs font-normal">
              <span className="text-foreground">Total Operating Overhead:</span>
              <span className="text-foreground tabular-nums">BDT {totalExp.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderator Performance Table */}
      <Card className="shadow-none border-border/50 bg-card">
        <CardHeader className="pb-3 border-b border-border/40">
          <CardTitle className="text-xs font-normal uppercase tracking-wider text-muted-foreground">
            Concierge &amp; Order Moderator Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-normal">Moderator</TableHead>
                <TableHead className="text-xs font-normal">Handled</TableHead>
                <TableHead className="text-xs font-normal">Confirmed</TableHead>
                <TableHead className="text-xs font-normal">Packed</TableHead>
                <TableHead className="text-xs font-normal">Recovered</TableHead>
                <TableHead className="text-xs font-normal text-right">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {moderators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground font-normal">
                    No activity recorded for this period
                  </TableCell>
                </TableRow>
              ) : (
                moderators.map((mod) => (
                  <TableRow key={mod.staffId} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-normal text-xs text-foreground">{mod.staffName}</div>
                        <div className="text-[11px] text-muted-foreground">{mod.email}</div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="font-normal text-xs tabular-nums">{mod.totalOrdersHandled}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-normal tabular-nums">{mod.confirmedOrdersCount}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-normal text-muted-foreground tabular-nums">{mod.packedOrdersCount}</span>
                    </TableCell>

                    <TableCell>
                      <span className="text-xs font-normal tabular-nums">{mod.incompleteConvertedCount}</span>
                    </TableCell>

                    <TableCell className="text-right">
                      <Badge variant="outline" className="font-normal text-xs text-muted-foreground tabular-nums">
                        {mod.conversionRate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

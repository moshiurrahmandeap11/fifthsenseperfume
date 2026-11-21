"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { checkFraud } from "@/services/courier.services";
import { ICourierShipment, IFraudCheckResult, IShippingZoneRule } from "@/types/courier.types";
import { ExternalLink, Search } from "lucide-react";
import React, { useState, useTransition } from "react";
import toast from "react-hot-toast";

interface CourierLogisticsClientProps {
  initialShipments: ICourierShipment[];
  shippingZones: IShippingZoneRule[];
}

export default function CourierLogisticsClient({
  initialShipments,
  shippingZones,
}: CourierLogisticsClientProps) {
  const [shipments] = useState<ICourierShipment[]>(initialShipments);
  const [zones] = useState<IShippingZoneRule[]>(shippingZones);
  const [searchTerm, setSearchTerm] = useState("");

  // Fraud check states
  const [phoneQuery, setPhoneQuery] = useState("");
  const [fraudResult, setFraudResult] = useState<IFraudCheckResult | null>(null);
  const [isCheckingFraud, startFraudCheck] = useTransition();

  const handleRunFraudCheck = () => {
    if (!phoneQuery || phoneQuery.trim().length < 11) {
      toast.error("Please enter an 11-digit Bangladesh phone number");
      return;
    }

    startFraudCheck(async () => {
      try {
        const res = await checkFraud(phoneQuery.trim());
        if (res?.data) {
          setFraudResult(res.data);
          toast.success("Courier record found");
        } else {
          toast.error("No record found");
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to query courier record");
      }
    });
  };

  const filteredShipments = shipments.filter((s) => {
    const q = searchTerm.toLowerCase();
    return (
      s.consignmentId?.toLowerCase().includes(q) ||
      s.trackingCode?.toLowerCase().includes(q) ||
      s.order?.orderNumber.toLowerCase().includes(q) ||
      s.order?.customerName.toLowerCase().includes(q) ||
      s.order?.customerPhone.includes(q)
    );
  });

  const activeShipmentCount = shipments.filter(
    (s) => s.courierStatus !== "DELIVERED" && s.courierStatus !== "CANCELLED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Total Dispatches
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {shipments.length}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            In Transit
          </div>
          <div className="text-xl font-normal text-foreground tabular-nums">
            {activeShipmentCount}
          </div>
        </Card>

        <Card className="shadow-none border border-border/60 bg-card p-4 space-y-1">
          <div className="text-xs font-normal text-muted-foreground uppercase">
            Couriers
          </div>
          <div className="text-xl font-normal text-foreground">
            Steadfast &amp; Pathao
          </div>
        </Card>
      </div>

      {/* Fraud Shield Check Card */}
      <Card className="shadow-none border border-border/60 bg-card">
        <CardHeader className="pb-3 border-b">
          <CardTitle className="text-xs font-normal text-muted-foreground uppercase tracking-wide">
            Courier Delivery Ratio &amp; Fraud Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 max-w-sm">
            <Input
              placeholder="Customer Phone (017...)"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              className="text-xs h-8 bg-background font-normal"
            />
            <Button
              size="sm"
              onClick={handleRunFraudCheck}
              disabled={isCheckingFraud}
              className="h-8 text-xs font-normal cursor-pointer"
            >
              {isCheckingFraud ? "Checking..." : "Check"}
            </Button>
          </div>

          {/* Result Profile */}
          {fraudResult && (
            <div className="p-3.5 rounded border border-border/40 bg-muted/20 space-y-3 mt-2 text-xs font-normal">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">{fraudResult.phoneNumber}</span>
                  {fraudResult.isBlacklisted && (
                    <Badge variant="outline" className="text-[10px] font-normal">
                      Blacklisted
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-muted-foreground text-[11px]">Recommendation:</span>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {fraudResult.recommendation.replace(/_/g, " ")}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Success Rate</span>
                  <span className="tabular-nums text-foreground">{fraudResult.successRate.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Total Parcels</span>
                  <span className="tabular-nums text-foreground">{fraudResult.totalParcels}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Delivered</span>
                  <span className="tabular-nums text-foreground">{fraudResult.deliveredCount}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Returned</span>
                  <span className="tabular-nums text-foreground">{fraudResult.returnedCount}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shipping Zones Snapshot */}
      {zones.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="p-3 rounded border border-border/60 bg-card flex items-center justify-between text-xs font-normal"
            >
              <div>
                <div className="text-foreground">{zone.title}</div>
                <div className="text-[11px] text-muted-foreground">{zone.estimatedDeliveryText}</div>
              </div>
              <div className="text-right">
                <div className="tabular-nums text-foreground">BDT {zone.charge}</div>
                {zone.freeShippingMinAmount && (
                  <div className="text-[10px] text-muted-foreground">
                    Free over {zone.freeShippingMinAmount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipments Table */}
      <div className="space-y-3">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search consignment or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 text-xs h-8 bg-background font-normal"
          />
        </div>

        <Card className="shadow-none border border-border/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-normal">Consignment</TableHead>
                <TableHead className="text-xs font-normal">Provider</TableHead>
                <TableHead className="text-xs font-normal">Order #</TableHead>
                <TableHead className="text-xs font-normal">Customer</TableHead>
                <TableHead className="text-xs font-normal text-right">COD</TableHead>
                <TableHead className="text-xs font-normal">Status</TableHead>
                <TableHead className="text-xs font-normal text-right">Tracking</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-36 text-center text-xs font-normal text-muted-foreground">
                    No shipments dispatched
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-mono text-xs font-normal text-foreground">
                      {s.consignmentId || "Pending"}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {s.provider}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-mono text-xs font-normal text-foreground">
                      #{s.order?.orderNumber}
                    </TableCell>

                    <TableCell className="text-xs font-normal">
                      <div>{s.order?.customerName || "Customer"}</div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        {s.order?.customerPhone}
                      </div>
                    </TableCell>

                    <TableCell className="text-right text-xs font-normal text-foreground tabular-nums">
                      BDT {s.codCollectibleAmount?.toLocaleString() || 0}
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {s.courierStatus || "PENDING"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {s.trackingUrl ? (
                        <a
                          href={s.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-foreground"
                        >
                          <span>Track</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Direct</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}

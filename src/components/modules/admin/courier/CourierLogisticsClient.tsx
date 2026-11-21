"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { checkFraud, getShippingZones } from "@/services/courier.services";
import { ICourierShipment, IFraudCheckResult, IShippingZoneRule } from "@/types/courier.types";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  MapPin,
  PhoneCall,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Truck,
} from "lucide-react";
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
      toast.error("Please enter a valid 11-digit Bangladesh phone number");
      return;
    }

    startFraudCheck(async () => {
      try {
        const res = await checkFraud(phoneQuery.trim());
        if (res?.data) {
          setFraudResult(res.data);
          toast.success("Courier history and fraud profile retrieved");
        } else {
          toast.error("No courier history found for this number");
        }
      } catch (err: unknown) {
        const error = err as { message?: string };
        toast.error(error.message || "Failed to analyze customer courier history");
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
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Dispatched Perfume Parcels
            </CardTitle>
            <Truck className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {shipments.length}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Total consignments generated
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              In-Transit Flacons
            </CardTitle>
            <MapPin className="size-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {activeShipmentCount}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Currently out with courier couriers
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-xs border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Steadfast &amp; Pathao Live Sync
            </CardTitle>
            <ShieldCheck className="size-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-emerald-600">
              Connected
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Automated API dispatch &amp; tracking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fraud Shield Calculator Card */}
      <Card className="shadow-xs border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            <CardTitle className="text-sm font-bold text-foreground">
              Fraud Shield &amp; Courier Success Rate Lookup
            </CardTitle>
          </div>
          <p className="text-xs text-muted-foreground">
            Instantly query past return ratios, bogus order history, and courier delivery rates across Steadfast and Pathao
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch gap-2 max-w-md">
            <div className="relative flex-1">
              <PhoneCall className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Customer Phone (e.g. 01712345678)"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="pl-8 text-xs h-9 bg-background"
              />
            </div>
            <Button
              size="sm"
              onClick={handleRunFraudCheck}
              disabled={isCheckingFraud}
              className="h-9 text-xs cursor-pointer gap-1.5"
            >
              <Search className="size-3.5" />
              <span>{isCheckingFraud ? "Analyzing..." : "Check Risk"}</span>
            </Button>
          </div>

          {/* Result Profile */}
          {fraudResult && (
            <div className="p-4 rounded-xl border bg-background space-y-3 mt-2 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-foreground">
                    {fraudResult.phoneNumber}
                  </span>
                  {fraudResult.isBlacklisted ? (
                    <Badge variant="destructive" className="gap-1 text-[11px]">
                      <AlertOctagon className="size-3" /> Blacklisted
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-300 text-[11px]">
                      Not Blacklisted
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Recommendation:</span>
                  {fraudResult.recommendation === "ACCEPT_COD" && (
                    <Badge className="bg-emerald-600 text-white text-[11px] gap-1">
                      <CheckCircle2 className="size-3" /> Safe to Ship COD
                    </Badge>
                  )}
                  {fraudResult.recommendation === "REQUIRE_ADVANCE_DELIVERY_FEE" && (
                    <Badge className="bg-amber-500 text-white text-[11px] gap-1">
                      <AlertTriangle className="size-3" /> Collect Advance Delivery Fee
                    </Badge>
                  )}
                  {fraudResult.recommendation === "REJECT_ORDER" && (
                    <Badge variant="destructive" className="text-[11px] gap-1">
                      <AlertOctagon className="size-3" /> High Risk (Cancel / Hold)
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Delivery Success Rate</span>
                  <span className="font-bold text-sm text-foreground">
                    {fraudResult.successRate.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Total Parcels</span>
                  <span className="font-bold text-sm text-foreground">
                    {fraudResult.totalParcels} orders
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Delivered</span>
                  <span className="font-bold text-sm text-emerald-600">
                    {fraudResult.deliveredCount} parcels
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Returned / Cancelled</span>
                  <span className="font-bold text-sm text-destructive">
                    {fraudResult.returnedCount} parcels
                  </span>
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
              className="p-3 rounded-lg border bg-card shadow-2xs flex items-center justify-between"
            >
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-foreground">{zone.title}</div>
                <div className="text-[11px] text-muted-foreground">{zone.estimatedDeliveryText || "1-3 Days"}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xs text-foreground">BDT {zone.charge}</div>
                {zone.freeShippingMinAmount && (
                  <div className="text-[10px] text-muted-foreground">
                    Free over BDT {zone.freeShippingMinAmount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Shipments Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search consignments, tracking ID, order or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-xs h-9 bg-background"
            />
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-xs overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-semibold">Consignment / Provider</TableHead>
                <TableHead className="text-xs font-semibold">Order / Customer</TableHead>
                <TableHead className="text-xs font-semibold">Shipping Address</TableHead>
                <TableHead className="text-xs font-semibold">COD Collectible</TableHead>
                <TableHead className="text-xs font-semibold">Tracking Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Courier Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-44 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground space-y-2">
                      <Truck className="size-8 stroke-[1.5]" />
                      <p className="text-xs font-medium">No courier shipments dispatched yet</p>
                      <p className="text-[11px] text-muted-foreground/80">
                        Dispatch verified perfume orders from the Orders page to create tracking consignments
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredShipments.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/20">
                    <TableCell>
                      <div className="space-y-0.5">
                        <span className="font-mono font-semibold text-xs text-foreground">
                          {s.consignmentId || "Pending"}
                        </span>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <Badge variant="outline" className="text-[10px] font-medium">
                            {s.provider}
                          </Badge>
                          {s.trackingCode && <span className="font-mono">{s.trackingCode}</span>}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-0.5">
                        <div className="font-medium text-xs text-foreground">
                          {s.order?.customerName || "Customer"}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {s.order?.customerPhone} • #{s.order?.orderNumber}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="max-w-xs text-xs text-muted-foreground line-clamp-1">
                        {s.order?.shippingAddress}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="font-bold text-xs text-foreground">
                        BDT {s.codCollectibleAmount?.toLocaleString() || 0}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="outline" className="text-[11px]">
                        {s.courierStatus || "PENDING"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      {s.trackingUrl ? (
                        <a
                          href={s.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <span>Track</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Local</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

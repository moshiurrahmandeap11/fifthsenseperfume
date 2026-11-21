import CourierLogisticsClient from "@/components/modules/admin/courier/CourierLogisticsClient";
import { getAllShipments, getShippingZones } from "@/services/courier.services";
import { ICourierShipment, IShippingZoneRule } from "@/types/courier.types";
import { Truck } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Courier & Fraud Check | FIFTH SENSE PERFUMES",
  description: "Track consignments across Steadfast and Pathao, check customer fraud risk scores",
};

export default async function AdminCourierPage() {
  await connection();
  let shipments: ICourierShipment[] = [];
  let shippingZones: IShippingZoneRule[] = [];

  try {
    const [shipmentsRes, zonesRes] = await Promise.all([
      getAllShipments({ limit: 100 }),
      getShippingZones(),
    ]);

    if (shipmentsRes?.data) {
      shipments = shipmentsRes.data;
    }
    if (zonesRes?.data) {
      shippingZones = zonesRes.data;
    }
  } catch (err) {
    console.error("Failed to load courier shipments server-side:", err);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Truck className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Courier &amp; Fraud Check
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Monitor Steadfast &amp; Pathao consignments, run phone fraud checks, and review delivery zones
          </p>
        </div>
      </div>

      {/* Main Interactive Client */}
      <CourierLogisticsClient
        initialShipments={shipments}
        shippingZones={shippingZones}
      />
    </div>
  );
}

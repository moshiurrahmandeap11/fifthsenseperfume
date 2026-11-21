import CourierLogisticsClient from "@/components/modules/admin/courier/CourierLogisticsClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllShipments, getShippingZones } from "@/services/courier.services";
import { ICourierShipment, IShippingZoneRule } from "@/types/courier.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Courier & Logistics | FIFTH SENSE PERFUMES",
  description: "Track consignments across Steadfast and Pathao, check fraud scores",
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
    <FluidPage className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Courier &amp; Fraud Check
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          {shipments.length} consignments
        </span>
      </div>

      {/* Main Interactive Client */}
      <CourierLogisticsClient
        initialShipments={shipments}
        shippingZones={shippingZones}
      />
    </FluidPage>
  );
}

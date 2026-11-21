import ReturnsQcClient from "@/components/modules/admin/exchange/ReturnsQcClient";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllExchanges } from "@/services/exchange.services";
import { IExchangeRequest } from "@/types/exchange.types";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Damages & Returns | FIFTH SENSE PERFUMES",
  description: "Fragrance leakage and atomizer damage returns",
};

export default async function AdminExchangesPage() {
  await connection();
  let exchanges: IExchangeRequest[] = [];

  try {
    const res = await getAllExchanges({ limit: 100 });
    if (res?.data) {
      exchanges = res.data;
    }
  } catch (err) {
    console.error("Failed to load fragrance returns server-side:", err);
  }

  return (
    <FluidPage className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b">
        <h1 className="text-base font-normal tracking-wide uppercase text-foreground">
          Damages &amp; Returns QC
        </h1>
        <span className="text-xs font-mono text-muted-foreground">
          {exchanges.length} tickets
        </span>
      </div>

      {/* Main Interactive Client */}
      <ReturnsQcClient initialExchanges={exchanges} />
    </FluidPage>
  );
}

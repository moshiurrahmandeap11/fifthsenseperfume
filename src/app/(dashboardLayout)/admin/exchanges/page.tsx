import ReturnsQcClient from "@/components/modules/admin/exchange/ReturnsQcClient";
import { getAllExchanges } from "@/services/exchange.services";
import { IExchangeRequest } from "@/types/exchange.types";
import { ArrowLeftRight } from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import React from "react";

export const metadata: Metadata = {
  title: "Damages & Returns QC | FIFTH SENSE PERFUMES",
  description: "Inspect fragrance leakage, defective atomizers, and process returns",
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <ArrowLeftRight className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Damages &amp; Returns QC
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Manage flacon replacement requests, atomizer defect reports, and warehouse inspections
          </p>
        </div>
      </div>

      {/* Main Interactive Client */}
      <ReturnsQcClient initialExchanges={exchanges} />
    </div>
  );
}

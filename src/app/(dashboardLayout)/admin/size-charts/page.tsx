import SizeChartCardGrid from "@/components/modules/admin/sizeChart/SizeChartCardGrid";
import { FluidPage } from "@/components/ui/fluid-motion";
import { getAllSizeCharts } from "@/services/sizeChart.services";
import { ISizeChart } from "@/types/sizeChart.types";
import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import React from "react";

export default async function AdminSizeChartsPage() {
  await connection();
  let sizeCharts: ISizeChart[] = [];

  try {
    const res = await getAllSizeCharts({ limit: 100 });
    if (res?.data) {
      sizeCharts = res.data;
    }
  } catch (err) {
    console.error("Failed to load volume guides server-side:", err);
  }

  const handleServerRefresh = async () => {
    "use server";
    revalidatePath("/admin/size-charts");
  };

  return (
    <FluidPage className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-xl font-normal tracking-tight text-foreground">
            Volume &amp; Concentration Guides
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Flacon sizing templates, oil concentrations, and atomized spray yields
          </p>
        </div>
      </div>

      <SizeChartCardGrid
        charts={sizeCharts}
        onRefresh={handleServerRefresh}
      />
    </FluidPage>
  );
}

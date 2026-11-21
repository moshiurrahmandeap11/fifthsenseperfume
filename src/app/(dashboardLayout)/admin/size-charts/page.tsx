import SizeChartCardGrid from "@/components/modules/admin/sizeChart/SizeChartCardGrid";
import { getAllSizeCharts } from "@/services/sizeChart.services";
import { ISizeChart } from "@/types/sizeChart.types";
import { Droplets } from "lucide-react";
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
    console.error("Failed to load fragrance concentration charts server-side:", err);
  }

  const handleServerRefresh = async () => {
    "use server";
    revalidatePath("/admin/size-charts");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Droplets className="size-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Concentration &amp; Volume Guides
            </h1>
          </div>
          <p className="text-xs text-muted-foreground">
            Configure fragrance concentration standards (Extrait, EDP, EDT), spray yields, and bottle volume guides
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <SizeChartCardGrid
        charts={sizeCharts}
        onRefresh={handleServerRefresh}
      />
    </div>
  );
}
